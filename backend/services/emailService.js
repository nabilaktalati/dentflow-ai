import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function verifyEmailConnection() {
  await transporter.verify()
}

export async function sendContactEmail({
  fullName,
  email,
  phone,
  subject,
  message,
}) {
  return transporter.sendMail({
    from: `"DentFlow AI" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_RECEIVER,
    replyTo: email,

    subject: `[DentFlow İletişim] ${subject}`,

    text: `
Yeni iletişim mesajı

Ad Soyad: ${fullName}
E-posta: ${email}
Telefon: ${phone || 'Belirtilmedi'}
Konu: ${subject}

Mesaj:
${message}
    `,

    html: `
      <div
        style="
          max-width: 620px;
          margin: 0 auto;
          padding: 32px;
          font-family: Arial, sans-serif;
          color: #111827;
          background: #f8fafd;
        "
      >
        <div
          style="
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            padding: 28px;
          "
        >
          <p
            style="
              margin: 0;
              color: #5956f5;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 1px;
            "
          >
            DENTFLOW AI
          </p>

          <h2 style="margin: 10px 0 24px;">
            Yeni İletişim Mesajı
          </h2>

          <p><strong>Ad Soyad:</strong> ${fullName}</p>
          <p><strong>E-posta:</strong> ${email}</p>
          <p>
            <strong>Telefon:</strong>
            ${phone || 'Belirtilmedi'}
          </p>
          <p><strong>Konu:</strong> ${subject}</p>

          <div
            style="
              margin-top: 24px;
              padding: 18px;
              background: #f8fafd;
              border-radius: 14px;
            "
          >
            <strong>Mesaj</strong>

            <p style="line-height: 1.7; white-space: pre-line;">
              ${message}
            </p>
          </div>
        </div>
      </div>
    `,
  })
}