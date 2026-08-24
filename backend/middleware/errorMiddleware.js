export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

const getDuplicateField = (error) => {
  if (error.keyPattern) {
    return Object.keys(error.keyPattern)[0]
  }

  if (error.keyValue) {
    return Object.keys(error.keyValue)[0]
  }

  return null
}

export const errorHandler = (err, req, res, next) => {
  // Express'in error middleware olarak tanıması için 4 parametre korunuyor.
  void next

  console.error(err)

  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'
  let errors

  // ---------------------------------------------------------
  // MongoDB duplicate key error
  // Örn: aynı email veya aynı profile iki kez oluşturulması
  // ---------------------------------------------------------
  if (err.code === 11000) {
    const field = getDuplicateField(err)

    statusCode = 409
    message = field
      ? `${field} alanı için kayıt zaten mevcut.`
      : 'Bu kayıt zaten mevcut.'
  }

  // ---------------------------------------------------------
  // Mongoose validation error
  // ---------------------------------------------------------
  else if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Gönderilen veriler doğrulanamadı.'

    errors = Object.fromEntries(
      Object.entries(err.errors).map(([field, error]) => [
        field,
        error.message,
      ]),
    )
  }

  // ---------------------------------------------------------
  // Invalid MongoDB ObjectId
  // ---------------------------------------------------------
  else if (err.name === 'CastError') {
    statusCode = 400
    message = `Geçersiz ${err.path || 'kimlik'} değeri.`
  }

  // ---------------------------------------------------------
  // MongoDB bağlantı hatası
  // ---------------------------------------------------------
  else if (
    err.name === 'MongooseServerSelectionError' ||
    err.name === 'MongoServerSelectionError'
  ) {
    statusCode = 503
    message = 'Veritabanı bağlantısı şu anda kullanılamıyor.'
  }

  // ---------------------------------------------------------
  // Production ortamında beklenmeyen hataları gizle
  // ---------------------------------------------------------
  const isProduction =
    process.env.NODE_ENV === 'production'

  if (isProduction && statusCode >= 500) {
    message = 'Internal server error'
    errors = undefined
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(!isProduction &&
      statusCode >= 500 && {
        error: err.name,
      }),
  })
}