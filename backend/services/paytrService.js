import crypto from 'crypto'

import Invoice from '../models/Invoice.js'
import PatientProfile from '../models/PatientProfile.js'


const createPaytrError = (
  message,
  statusCode,
  code,
) => {
  const error =
    new Error(message)

  error.statusCode =
    statusCode

  error.code =
    code

  return error
}


const getPaytrConfig = () => {
  const merchantId =
    process.env.PAYTR_MERCHANT_ID

  const merchantKey =
    process.env.PAYTR_MERCHANT_KEY

  const merchantSalt =
    process.env.PAYTR_MERCHANT_SALT

  if (
    !merchantId ||
    !merchantKey ||
    !merchantSalt
  ) {
    throw createPaytrError(
      'PayTR entegrasyon bilgileri yapılandırılmamış.',
      503,
      'PAYTR_NOT_CONFIGURED',
    )
  }

  return {
    merchantId,
    merchantKey,
    merchantSalt,

    testMode:
      process.env.PAYTR_TEST_MODE ===
      '1'
        ? '1'
        : '0',

    debugOn:
      process.env.PAYTR_DEBUG_ON ===
      '1'
        ? '1'
        : '0',
  }
}


const createMerchantOid = (
  invoiceId,
) =>
  `DF${invoiceId}${Date.now()}`


export const createPaytrIframeToken =
  async ({
    patientUserId,
    invoiceId,
    address,
    userIp,
  }) => {
    const {
      merchantId,
      merchantKey,
      merchantSalt,
      testMode,
      debugOn,
    } = getPaytrConfig()


    const patientProfile =
      await PatientProfile.findOne({
        user: patientUserId,
      })
        .select(
          '_id firstName lastName phone user',
        )
        .populate({
          path: 'user',
          select: 'email',
        })
        .lean()


    if (!patientProfile) {
      throw createPaytrError(
        'Hasta profili bulunamadı.',
        404,
        'PATIENT_PROFILE_NOT_FOUND',
      )
    }


    if (
      !patientProfile.user?.email
    ) {
      throw createPaytrError(
        'Hasta e-posta bilgisi bulunamadı.',
        400,
        'PATIENT_EMAIL_REQUIRED',
      )
    }


    if (
      !patientProfile.phone
    ) {
      throw createPaytrError(
        'Ödeme için telefon bilgisi gereklidir.',
        400,
        'PATIENT_PHONE_REQUIRED',
      )
    }


    const normalizedAddress =
      address?.trim()

    if (
      !normalizedAddress ||
      normalizedAddress.length <
        5
    ) {
      throw createPaytrError(
        'Ödeme için geçerli bir adres gereklidir.',
        400,
        'PAYMENT_ADDRESS_REQUIRED',
      )
    }


    const invoice =
      await Invoice.findOne({
        _id: invoiceId,

        patient:
          patientProfile._id,
      })
        .select(
          '_id invoiceNumber description amount currency status',
        )
        .lean()


    if (!invoice) {
      throw createPaytrError(
        'Fatura bulunamadı.',
        404,
        'INVOICE_NOT_FOUND',
      )
    }


    if (
      invoice.status !==
      'PENDING'
    ) {
      throw createPaytrError(
        'Bu fatura ödeme için uygun durumda değil.',
        409,
        'INVOICE_NOT_PAYABLE',
      )
    }


    const paymentAmount =
      Math.round(
        Number(
          invoice.amount,
        ) * 100,
      ).toString()


    const merchantOid =
      createMerchantOid(
        invoice._id.toString(),
      )


    const basket =
      [
        [
          invoice.description,
          Number(
            invoice.amount,
          ).toFixed(2),
          1,
        ],
      ]


    const userBasket =
      Buffer.from(
        JSON.stringify(
          basket,
        ),
        'utf8',
      ).toString(
        'base64',
      )


    const noInstallment =
      '0'

    const maxInstallment =
      '0'

    const currency =
      'TL'


    const resolvedUserIp =
      process.env
        .PAYTR_TEST_USER_IP ||
      userIp


    if (!resolvedUserIp) {
      throw createPaytrError(
        'Ödeme için kullanıcı IP bilgisi alınamadı.',
        400,
        'USER_IP_REQUIRED',
      )
    }


    const hashString =
      `${merchantId}` +
      `${resolvedUserIp}` +
      `${merchantOid}` +
      `${patientProfile.user.email}` +
      `${paymentAmount}` +
      `${userBasket}` +
      `${noInstallment}` +
      `${maxInstallment}` +
      `${currency}` +
      `${testMode}`


    const paytrToken =
      crypto
        .createHmac(
          'sha256',
          merchantKey,
        )
        .update(
          hashString +
            merchantSalt,
        )
        .digest(
          'base64',
        )


    const clientUrl =
      process.env.CLIENT_URL ||
      'http://localhost:5173'


    const params =
      new URLSearchParams({
        merchant_id:
          merchantId,

        user_ip:
          resolvedUserIp,

        merchant_oid:
          merchantOid,

        email:
          patientProfile.user
            .email,

        payment_amount:
          paymentAmount,

        paytr_token:
          paytrToken,

        user_basket:
          userBasket,

        debug_on:
          debugOn,

        no_installment:
          noInstallment,

        max_installment:
          maxInstallment,

        user_name:
          `${patientProfile.firstName} ${patientProfile.lastName}`,

        user_address:
          normalizedAddress,

        user_phone:
          patientProfile.phone,

        merchant_ok_url:
          `${clientUrl}/patient/invoices?payment=success`,

        merchant_fail_url:
          `${clientUrl}/patient/invoices?payment=failed`,

        timeout_limit:
          '30',

        currency,

     test_mode:
  testMode,

lang:
  'tr',

iframe_v2:
  '1',

iframe_v2_dark:
  '0',
      })


    const response =
      await fetch(
        'https://www.paytr.com/odeme/api/get-token',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded',
          },

          body:
            params.toString(),
        },
      )


    const result =
      await response.json()


    if (
      !response.ok ||
      result.status !==
        'success' ||
      !result.token
    ) {
      throw createPaytrError(
        result.reason ||
          'PayTR ödeme oturumu oluşturulamadı.',
        502,
        'PAYTR_TOKEN_FAILED',
      )
    }


    await Invoice.updateOne(
      {
        _id:
          invoice._id,
      },
      {
        $set: {
          paymentReference:
            merchantOid,
        },
      },
    )


    return {
      token:
        result.token,

      merchantOid,

      iframeUrl:
        `https://www.paytr.com/odeme/guvenli/${result.token}`,
    }
  }