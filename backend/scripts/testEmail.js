import 'dotenv/config'
import {
  sendContactEmail,
  verifyEmailConnection,
} from '../services/emailService.js'

async function testEmail() {
  try {
    console.log('SMTP bağlantısı kontrol ediliyor...')

    await verifyEmailConnection()

    console.log('✅ SMTP bağlantısı başarılı.')

    const result = await sendContactEmail({
      fullName: 'DentFlow Test',
      email: 'dentflowai.clinic@gmail.com',
      phone: '+90 555 123 45 67',
      subject: 'İletişim Formu Testi',
      message:
        'Bu mesaj DentFlow AI backend e-posta servisini test etmek için gönderildi.',
    })

    console.log('✅ Test e-postası gönderildi.')
    console.log('Message ID:', result.messageId)
  } catch (error) {
    console.error('❌ E-posta gönderilemedi.')
    console.error(error)
  }
}

testEmail()