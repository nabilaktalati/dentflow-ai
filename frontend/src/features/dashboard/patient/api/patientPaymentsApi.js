export const createPaytrPayment =
  async ({
    invoiceId,
    address,
  }) => {
    const response =
      await fetch(
        '/api/payments/paytr/create',
        {
          method: 'POST',

          credentials:
            'include',

          headers: {
            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify({
              invoiceId,
              address,
            }),
        },
      )

    const data =
      await response.json()

    if (!response.ok) {
      const error =
        new Error(
          data.message ||
            'Ödeme işlemi başlatılamadı.',
        )

      error.code =
        data.code

      throw error
    }

    return (
      data.data?.payment ||
      null
    )
  }

  export const createDemoPayment =
  async ({
    invoiceId,
    cardNumber,
    expiry,
    cvv,
    address,
  }) => {
    const response =
      await fetch(
        '/api/payments/demo',
        {
          method: 'POST',

          credentials:
            'include',

          headers: {
            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify({
              invoiceId,
              cardNumber,
              expiry,
              cvv,
              address,
            }),
        },
      )

    const data =
      await response.json()

    if (!response.ok) {
      const error =
        new Error(
          data.message ||
            'Demo ödeme işlemi tamamlanamadı.',
        )

      error.code =
        data.code

      throw error
    }

    return (
      data.data?.payment ||
      null
    )
  }