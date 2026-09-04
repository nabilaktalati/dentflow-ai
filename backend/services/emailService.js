const BREVO_API_URL =
  'https://api.brevo.com/v3'

const getBrevoHeaders = () => ({
  accept: 'application/json',
  'content-type': 'application/json',
  'api-key': process.env.BREVO_API_KEY,
})

const getSender = () => ({
  name:
    process.env.BREVO_SENDER_NAME ||
    'DentFlow AI',
  email:
    process.env.BREVO_SENDER_EMAIL,
})

const sendBrevoEmail = async ({
  to,
  subject,
  textContent,
  htmlContent,
  replyTo,
}) => {
  const response = await fetch(
    `${BREVO_API_URL}/smtp/email`,
    {
      method: 'POST',
      headers: getBrevoHeaders(),
      body: JSON.stringify({
        sender: getSender(),
        to: [
          {
            email: to,
          },
        ],
        subject,
        textContent,
        htmlContent,
        ...(replyTo
          ? {
              replyTo: {
                email: replyTo,
              },
            }
          : {}),
      }),
      signal: AbortSignal.timeout(10000),
    },
  )

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => ({}))

    throw new Error(
      data.message ||
        `Brevo API error: ${response.status}`,
    )
  }

  return response.json()
}

export async function verifyEmailConnection() {
  const response = await fetch(
    `${BREVO_API_URL}/account`,
    {
      headers: {
        accept: 'application/json',
        'api-key':
          process.env.BREVO_API_KEY,
      },
      signal: AbortSignal.timeout(10000),
    },
  )

  if (!response.ok) {
    throw new Error(
      'Brevo API connection failed.',
    )
  }

  return true
}

export async function sendContactEmail({
  fullName,
  email,
  phone,
  subject,
  message,
}) {
  return sendBrevoEmail({
    to: process.env.CONTACT_RECEIVER,
    replyTo: email,

    subject:
      `[DentFlow İletişim] ${subject}`,

    textContent: `
Yeni iletişim mesajı

Ad Soyad: ${fullName}
E-posta: ${email}
Telefon: ${phone || 'Belirtilmedi'}
Konu: ${subject}

Mesaj:
${message}
    `,

    htmlContent: `
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
          <p style="color:#5956f5;font-weight:700;">
            DENTFLOW AI
          </p>

          <h2>Yeni İletişim Mesajı</h2>

          <p><strong>Ad Soyad:</strong> ${fullName}</p>
          <p><strong>E-posta:</strong> ${email}</p>
          <p>
            <strong>Telefon:</strong>
            ${phone || 'Belirtilmedi'}
          </p>
          <p><strong>Konu:</strong> ${subject}</p>

          <div
            style="
              margin-top:24px;
              padding:18px;
              background:#f8fafd;
              border-radius:14px;
            "
          >
            <strong>Mesaj</strong>
            <p style="line-height:1.7;">
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
  return sendBrevoEmail({
    to: email,

    subject:
      'DentFlow AI - E-posta Doğrulama Kodu',

    textContent: `
Merhaba ${firstName},

DentFlow AI hesabınızı doğrulamak için aşağıdaki kodu kullanın:

${code}

Bu kod 10 dakika boyunca geçerlidir.

DentFlow AI
    `,

    htmlContent: `
      <div
        style="
          max-width:600px;
          margin:0 auto;
          padding:32px 20px;
          font-family:Arial,sans-serif;
          background:#f7f8fc;
          color:#111827;
        "
      >
        <div
          style="
            background:#ffffff;
            border:1px solid #e5e7eb;
            border-radius:20px;
            padding:32px;
          "
        >
          <p
            style="
              margin:0;
              color:#5956f5;
              font-size:12px;
              font-weight:700;
              letter-spacing:1.4px;
            "
          >
            DENTFLOW AI
          </p>

          <h2 style="margin:10px 0 12px;">
            E-posta Adresinizi Doğrulayın
          </h2>

          <p
            style="
              color:#6b7280;
              line-height:1.7;
            "
          >
            Merhaba ${firstName}, hesabınızı
            etkinleştirmek için aşağıdaki
            doğrulama kodunu kullanın.
          </p>

          <div
            style="
              margin:28px 0;
              padding:22px;
              text-align:center;
              background:#f4f3ff;
              border:1px solid #dddafe;
              border-radius:16px;
            "
          >
            <span
              style="
                font-size:34px;
                font-weight:800;
                letter-spacing:8px;
                color:#4f46e5;
              "
            >
              ${code}
            </span>
          </div>

          <p
            style="
              color:#6b7280;
              font-size:14px;
            "
          >
            Bu kod <strong>10 dakika</strong>
            boyunca geçerlidir.
          </p>
        </div>
      </div>
    `,
  })
}