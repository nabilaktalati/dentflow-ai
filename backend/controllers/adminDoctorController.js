import mongoose from "mongoose";

import User from "../models/User.js";
import DoctorProfile from "../models/DoctorProfile.js";

import { USER_ROLES } from "../constants/roles.js";
import cloudinary from '../config/cloudinary.js'
import {
  createDoctorSchema,
  updateDoctorProfileSchema,
} from "../validators/adminDoctorValidators.js";

import {
  generateTemporaryPassword,
  hashPassword,
} from "../services/passwordService.js";

export const createDoctor = async (req, res, next) => {
  let session;

  try {
    // 1. Gelen doktor bilgilerini doğrula
    const validationResult = createDoctorSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Doktor bilgileri geçersiz.",
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const {
      firstName,
      lastName,
      email,
      title,
      bio,
      education,
      experienceYears,
      clinicName,
      location,
      profileImageUrl,
      displayOrder,
    } = validationResult.data;

    // 2. Aynı e-posta adresi daha önce kullanılmış mı?
    const existingUser = await User.findOne({
      email,
    }).lean();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Bu e-posta adresiyle kayıtlı bir hesap bulunmaktadır.",
      });
    }

    // 3. Güvenli geçici parola oluştur
    const temporaryPassword = generateTemporaryPassword();

    const passwordHash = await hashPassword(temporaryPassword);

    // 4. Transaction başlat
    session = await mongoose.startSession();

    let createdUser;
    let createdProfile;

    await session.withTransaction(async () => {
      // Kullanıcı hesabını oluştur
      const users = await User.create(
        [
          {
            email,
            passwordHash,

            role: USER_ROLES.DOCTOR,

            // Doktor hesabı ADMIN tarafından
            // oluşturulduğu için direkt aktif.
            isEmailVerified: true,
            status: "ACTIVE",

            // İlk girişte parola değiştirilecek.
            mustChangePassword: true,
          },
        ],
        {
          session,
        },
      );

      createdUser = users[0];

      // Doktor profilini oluştur
      const profiles = await DoctorProfile.create(
        [
          {
            user: createdUser._id,

            firstName,
            lastName,
            title,
            bio,
            education,
            experienceYears,
            clinicName,
            location,
            profileImageUrl,
            displayOrder,

            isActive: true,
          },
        ],
        {
          session,
        },
      );

      createdProfile = profiles[0];
    });

    // 5. Temporary password yalnızca
    // oluşturma cevabında bir kez gönderilir.
    return res.status(201).json({
      success: true,

      message: "Doktor hesabı başarıyla oluşturuldu.",

      doctor: {
        id: createdUser._id.toString(),

        email: createdUser.email,

        role: createdUser.role,

        status: createdUser.status,

        isEmailVerified: createdUser.isEmailVerified,

        mustChangePassword: createdUser.mustChangePassword,

        profile: {
          id: createdProfile._id.toString(),

          firstName: createdProfile.firstName,

          lastName: createdProfile.lastName,

          title: createdProfile.title,

          clinicName: createdProfile.clinicName,

          location: createdProfile.location,

          experienceYears: createdProfile.experienceYears,

          isActive: createdProfile.isActive,
        },
      },

      temporaryPassword,
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const getDoctors = async (req, res, next) => {
  try {
    const profiles = await DoctorProfile.find()
      .populate({
        path: "user",
        select: [
          "email",
          "role",
          "status",
          "isEmailVerified",
          "mustChangePassword",
        ].join(" "),
      })
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    const doctors = profiles
      .filter(
        (profile) => profile.user && profile.user.role === USER_ROLES.DOCTOR,
      )
      .map((profile) => ({
        id: profile.user._id.toString(),

        profileId: profile._id.toString(),

        firstName: profile.firstName,

        lastName: profile.lastName,

        title: profile.title,

        bio: profile.bio,

        education: profile.education,

        email: profile.user.email,

        experienceYears: profile.experienceYears,

        displayOrder: profile.displayOrder,

        clinicName: profile.clinicName,

        location: profile.location,

        profileImageUrl: profile.profileImageUrl,
        cv: {
  fileName:
    profile.cv?.fileName || '',

  uploadedAt:
    profile.cv?.uploadedAt || null,
},

        accountStatus: profile.user.status,

        isActive: profile.isActive,

        isEmailVerified: profile.user.isEmailVerified,

        mustChangePassword: Boolean(profile.user.mustChangePassword),

        createdAt: profile.createdAt,
      }));

    return res.status(200).json({
      success: true,

      data: {
        doctors,
      },
    });
  } catch (error) {
    return next(error);
  }
};
export const updateDoctorProfile = async (req, res, next) => {
  try {
    const validationResult = updateDoctorProfileSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Doktor profil bilgileri geçersiz.",
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const doctorUserId = req.params.doctorId;

    const user = await User.findOne({
      _id: doctorUserId,
      role: USER_ROLES.DOCTOR,
    }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Doktor hesabı bulunamadı.",
      });
    }

    const profile = await DoctorProfile.findOneAndUpdate(
      {
        user: doctorUserId,
      },
      {
        $set: validationResult.data,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doktor profili bulunamadı.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doktor profili başarıyla güncellendi.",
      data: {
        doctor: {
          id: user._id.toString(),

          profileId: profile._id.toString(),

          email: user.email,

          firstName: profile.firstName,

          lastName: profile.lastName,

          title: profile.title,

          bio: profile.bio,

          education: profile.education,

          experienceYears: profile.experienceYears,

          clinicName: profile.clinicName,

          location: profile.location,

          profileImageUrl: profile.profileImageUrl,

          isActive: profile.isActive,

          displayOrder: profile.displayOrder,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};
export const uploadDoctorProfileImage = async (
  req,
  res,
  next,
) => {
  try {
    const doctorUserId =
      req.params.doctorId

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          'Profil fotoğrafı seçilmelidir.',
      })
    }


    // Doktor hesabı gerçekten var mı?
    const user =
      await User.findOne({
        _id: doctorUserId,
        role: USER_ROLES.DOCTOR,
      }).lean()

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          'Doktor hesabı bulunamadı.',
      })
    }


    // DoctorProfile mevcut mu?
    const existingProfile =
      await DoctorProfile.findOne({
        user: doctorUserId,
      })

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message:
          'Doktor profili bulunamadı.',
      })
    }


    // Buffer -> Cloudinary
    const uploadResult =
      await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  'dentflow/doctors',

                public_id:
                  `doctor-${doctorUserId}`,

                resource_type:
                  'image',

                overwrite: true,

                invalidate: true,

                transformation: [
                  {
                    width: 800,
                    height: 800,
                    crop: 'fill',
                    gravity: 'auto',
                    quality: 'auto',
                  },
                ],
              },

              (
                error,
                result,
              ) => {
                if (error) {
                  reject(error)
                  return
                }

                resolve(result)
              },
            )

          uploadStream.end(
            req.file.buffer,
          )
        },
      )


    // MongoDB profil URL'sini güncelle
    existingProfile.profileImageUrl =
      uploadResult.secure_url

    await existingProfile.save()


    return res.status(200).json({
      success: true,

      message:
        'Profil fotoğrafı başarıyla güncellendi.',

      data: {
        doctor: {
          id:
            user._id.toString(),

          profileId:
            existingProfile
              ._id
              .toString(),

          profileImageUrl:
            existingProfile
              .profileImageUrl,
        },
      },
    })
  } catch (error) {
    return next(error)
  }
}
export const uploadDoctorCv = async (
  req,
  res,
  next,
) => {
  try {
    const doctorUserId =
      req.params.doctorId

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          'CV dosyası seçilmelidir.',
      })
    }


    const user =
      await User.findOne({
        _id: doctorUserId,
        role: USER_ROLES.DOCTOR,
      }).lean()

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          'Doktor hesabı bulunamadı.',
      })
    }


    const profile =
      await DoctorProfile.findOne({
        user: doctorUserId,
      })

    if (!profile) {
      return res.status(404).json({
        success: false,
        message:
          'Doktor profili bulunamadı.',
      })
    }


    const uploadResult =
      await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  'dentflow/doctors/cv',

                public_id:
                  `doctor-${doctorUserId}-cv`,

                resource_type:
                  'raw',

                type:
                  'authenticated',

                overwrite: true,

                invalidate: true,
              },

              (
                error,
                result,
              ) => {
                if (error) {
                  reject(error)
                  return
                }

                resolve(result)
              },
            )

          uploadStream.end(
            req.file.buffer,
          )
        },
      )


    profile.cv = {
      fileName:
        req.file.originalname,

      publicId:
        uploadResult.public_id,

      resourceType:
        uploadResult.resource_type,

      uploadedAt:
        new Date(),
    }

    await profile.save()


    return res.status(200).json({
      success: true,

      message:
        'CV başarıyla yüklendi.',

      data: {
        cv: {
          fileName:
            profile.cv.fileName,

          uploadedAt:
            profile.cv.uploadedAt,
        },
      },
    })
  } catch (error) {
    return next(error)
  }
}
export const deleteDoctor = async (
  req,
  res,
  next,
) => {
  try {
    const doctorUserId =
      req.params.doctorId

    const user =
      await User.findOne({
        _id: doctorUserId,
        role: USER_ROLES.DOCTOR,
      })

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          'Doktor hesabı bulunamadı.',
      })
    }

    const profile =
      await DoctorProfile.findOne({
        user: doctorUserId,
      })

    if (!profile) {
      return res.status(404).json({
        success: false,
        message:
          'Doktor profili bulunamadı.',
      })
    }

    // Profil fotoğrafını Cloudinary'den sil
    if (profile.profileImageUrl) {
      try {
        await cloudinary.uploader.destroy(
          `dentflow/doctors/doctor-${doctorUserId}`,
          {
            resource_type: 'image',
          },
        )
      } catch {
        // Fotoğraf silinemese bile doktor silme işlemini durdurma.
      }
    }

    // CV varsa Cloudinary'den sil
    if (profile.cv?.publicId) {
      try {
        await cloudinary.uploader.destroy(
          profile.cv.publicId,
          {
            resource_type:
              profile.cv.resourceType ||
              'raw',

            type: 'authenticated',
          },
        )
      } catch {
        // CV temizleme hatası ana işlemi engellemez.
      }
    }

    await DoctorProfile.deleteOne({
      _id: profile._id,
    })

    await User.deleteOne({
      _id: doctorUserId,
    })

    return res.status(200).json({
      success: true,
      message:
        'Doktor hesabı başarıyla silindi.',
    })
  } catch (error) {
    return next(error)
  }
}