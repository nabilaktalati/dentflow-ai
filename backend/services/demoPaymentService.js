import crypto from 'crypto'

import Invoice from '../models/Invoice.js'
import PatientProfile from '../models/PatientProfile.js'


const createDemoPaymentError = (
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


const normalizeCardNumber = (
  value,
) =>
  String(value || '')
    .replace(/\s+/g, '')


export const processDemoPayment =
  async ({
    patientUserId,
    invoiceId,
    cardNumber,
    expiry,
    cvv,
    address,
  }) => {
    const patientProfile =
      await PatientProfile.findOne({
        user: patientUserId,
      })
        .select('_id')
        .lean()


    if (!patientProfile) {
      throw createDemoPaymentError(
        'Hasta profili bulunamadı.',
        404,
        'PATIENT_PROFILE_NOT_FOUND',
      )
    }


    const invoice =
      await Invoice.findOne({
        _id: invoiceId,
        patient:
          patientProfile._id,
      })


    if (!invoice) {
      throw createDemoPaymentError(
        'Fatura bulunamadı.',
        404,
        'INVOICE_NOT_FOUND',
      )
    }


    if (
      invoice.status !==
      'PENDING'
    ) {
      throw createDemoPaymentError(
        'Bu fatura ödeme için uygun durumda değil.',
        409,
        'INVOICE_NOT_PAYABLE',
      )
    }


    const normalizedCard =
      normalizeCardNumber(
        cardNumber,
      )


    /*
     * SADECE DentFlow demo kartı.
     * Gerçek kart kullanılmamalıdır.
     */
    if (
      normalizedCard !==
      '4242424242424242'
    ) {
      throw createDemoPaymentError(
        'Demo ödeme için test kartını kullanın: 4242 4242 4242 4242',
        400,
        'DEMO_CARD_INVALID',
      )
    }


    if (
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
        expiry || '',
      )
    ) {
      throw createDemoPaymentError(
        'Son kullanma tarihi AA/YY formatında olmalıdır.',
        400,
        'DEMO_EXPIRY_INVALID',
      )
    }


    if (
      !/^\d{3}$/.test(
        cvv || '',
      )
    ) {
      throw createDemoPaymentError(
        'Demo CVV 3 haneli olmalıdır.',
        400,
        'DEMO_CVV_INVALID',
      )
    }


    if (
      !address?.trim() ||
      address.trim().length < 5
    ) {
      throw createDemoPaymentError(
        'Geçerli bir fatura adresi gereklidir.',
        400,
        'DEMO_ADDRESS_REQUIRED',
      )
    }


    const paymentReference =
  `DF-PAY-${crypto
    .randomBytes(6)
    .toString('hex')
    .toUpperCase()}`


    /*
     * Kart numarası, SKT ve CVV
     * hiçbir şekilde veritabanına kaydedilmez.
     */
    invoice.status =
      'PAID'

    invoice.paidAt =
      new Date()

    invoice.paymentReference =
      paymentReference


    await invoice.save()


    return {
      invoiceId:
        invoice._id.toString(),

      invoiceNumber:
        invoice.invoiceNumber,

      status:
        invoice.status,

      paidAt:
        invoice.paidAt,

      paymentReference,

      mode:
        'DEMO',
    }
  }