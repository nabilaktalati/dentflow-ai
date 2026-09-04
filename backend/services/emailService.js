import nodemailer from 'nodemailer'

const smtpPort =
  Number(process.env.SMTP_PORT)

const transporter =
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,

    secure: smtpPort === 465,

    requireTLS: smtpPort === 587,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
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
export async function sendVerificationEmail({
  email,
  firstName,
  code,
}) {
  return transporter.sendMail({
    from: `"DentFlow AI" <${process.env.SMTP_USER}>`,
    to: email,

    subject: 'DentFlow AI - E-posta Doğrulama Kodu',

    text: `
Merhaba ${firstName},

DentFlow AI hesabınızı doğrulamak için aşağıdaki kodu kullanın:

${code}

Bu kod 10 dakika boyunca geçerlidir.

Bu işlemi siz başlatmadıysanız bu e-postayı dikkate almayabilirsiniz.

DentFlow AI
    `,

    html: `
      <div
        style="
          max-width: 600px;
          margin: 0 auto;
          padding: 32px 20px;
          font-family: Arial, sans-serif;
          color: #111827;
          background: #f7f8fc;
        "
      >
        <div
          style="
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            padding: 32px;
          "
        >
          <p
            style="
              margin: 0;
              color: #5956f5;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 1.4px;
            "
          >
            DENTFLOW AI
          </p>

          <h2
            style="
              margin: 10px 0 12px;
              font-size: 24px;
              color: #111827;
            "
          >
            E-posta Adresinizi Doğrulayın
          </h2>

          <p
            style="
              margin: 0;
              color: #6b7280;
              line-height: 1.7;
            "
          >
            Merhaba ${firstName}, DentFlow AI hesabınızı
            etkinleştirmek için aşağıdaki doğrulama kodunu kullanın.
          </p>

          <div
            style="
              margin: 28px 0;
              padding: 22px;
              text-align: center;
              background: #f4f3ff;
              border: 1px solid #dddafe;
              border-radius: 16px;
            "
          >
            <span
              style="
                font-size: 34px;
                font-weight: 800;
                letter-spacing: 8px;
                color: #4f46e5;
              "
            >
              ${code}
            </span>
          </div>

          <p
            style="
              margin: 0;
              color: #6b7280;
              font-size: 14px;
              line-height: 1.7;
            "
          >
            Bu doğrulama kodu
            <strong>10 dakika</strong>
            boyunca geçerlidir.
          </p>

          <div
            style="
              margin-top: 28px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            "
          >
            <p
              style="
                margin: 0;
                color: #9ca3af;
                font-size: 12px;
                line-height: 1.6;
              "
            >
              Bu işlemi siz başlatmadıysanız bu e-postayı dikkate almayabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    `,
  })
}