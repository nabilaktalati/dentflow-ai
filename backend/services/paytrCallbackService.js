import crypto from 'crypto'

import Invoice from '../models/Invoice.js'


const createCallbackError = (
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


const verifyPaytrHash = ({
  merchantOid,
  status,
  totalAmount,
  receivedHash,
}) => {
  const merchantKey =
    process.env.PAYTR_MERCHANT_KEY

  const merchantSalt =
    process.env.PAYTR_MERCHANT_SALT

  if (
    !merchantKey ||
    !merchantSalt
  ) {
    throw createCallbackError(
      'PayTR entegrasyon bilgileri yapılandırılmamış.',
      503,
      'PAYTR_NOT_CONFIGURED',
    )
  }


  const hashString =
    `${merchantOid}` +
    `${merchantSalt}` +
    `${status}` +
    `${totalAmount}`


  const expectedHash =
    crypto
      .createHmac(
        'sha256',
        merchantKey,
      )
      .update(hashString)
      .digest('base64')


  const expectedBuffer =
    Buffer.from(expectedHash)

  const receivedBuffer =
    Buffer.from(
      receivedHash || '',
    )


  if (
    expectedBuffer.length !==
      receivedBuffer.length ||
    !crypto.timingSafeEqual(
      expectedBuffer,
      receivedBuffer,
    )
  ) {
    throw createCallbackError(
      'PayTR bildirim doğrulaması başarısız.',
      400,
      'PAYTR_INVALID_HASH',
    )
  }
}


export const processPaytrCallback =
  async ({
    merchantOid,
    status,
    totalAmount,
    hash,
  }) => {
    if (
      !merchantOid ||
      !status ||
      !totalAmount ||
      !hash
    ) {
      throw createCallbackError(
        'PayTR bildirim bilgileri eksik.',
        400,
        'PAYTR_CALLBACK_INVALID',
      )
    }


    verifyPaytrHash({
      merchantOid,
      status,
      totalAmount,
      receivedHash:
        hash,
    })


    const invoice =
      await Invoice.findOne({
        paymentReference:
          merchantOid,
      })


    if (!invoice) {
      throw createCallbackError(
        'Ödeme ile ilişkili fatura bulunamadı.',
        404,
        'PAYTR_INVOICE_NOT_FOUND',
      )
    }


    /*
     * PayTR aynı işlem için bildirimi
     * birden fazla kez gönderebilir.
     */
    if (
      invoice.status ===
      'PAID'
    ) {
      return {
        invoice,
        alreadyProcessed: true,
      }
    }


    if (
      status ===
      'success'
    ) {
      invoice.status =
        'PAID'

      invoice.paidAt =
        new Date()

      await invoice.save()

      return {
        invoice,
        alreadyProcessed: false,
      }
    }


    /*
     * Başarısız ödeme faturayı iptal etmez.
     * Hasta daha sonra tekrar ödeme deneyebilir.
     */
    return {
      invoice,
      alreadyProcessed: false,
    }
  }