import { sendContactEmail } from '../services/emailService.js'
import { contactSchema } from '../validators/contact.validator.js'

export async function submitContactForm(req, res, next) {
  try {
    const result = contactSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Form bilgilerini kontrol edin.',
        errors: result.error.flatten().fieldErrors,
      })
    }

    await sendContactEmail(result.data)

    return res.status(200).json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi.',
    })
  } catch (error) {
    next(error)
  }
}