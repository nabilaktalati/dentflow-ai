import multer from 'multer'


const storage =
  multer.memoryStorage()


const fileFilter = (
  req,
  file,
  cb,
) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ]

  if (
    allowedTypes.includes(
      file.mimetype,
    )
  ) {
    cb(null, true)
    return
  }

  cb(
    new Error(
      'Yalnızca JPG, PNG veya WEBP formatında görsel yükleyebilirsiniz.',
    ),
    false,
  )
}


export const uploadDoctorImage =
  multer({
    storage,

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },

    fileFilter,
  }).single(
    'profileImage',
  )

  const cvFileFilter = (
  req,
  file,
  cb,
) => {
  if (
    file.mimetype ===
    'application/pdf'
  ) {
    cb(null, true)
    return
  }

  cb(
    new Error(
      'CV yalnızca PDF formatında yüklenebilir.',
    ),
    false,
  )
}


export const uploadDoctorCv =
  multer({
    storage,

    limits: {
      fileSize:
        10 * 1024 * 1024,
    },

    fileFilter:
      cvFileFilter,
  }).single(
    'cvFile',
  )