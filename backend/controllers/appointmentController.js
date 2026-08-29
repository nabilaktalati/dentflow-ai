import PatientProfile from '../models/PatientProfile.js'
import Appointment from '../models/Appointment.js'

import {
  createAppointmentSchema,
} from '../validators/appointmentValidators.js'

import {
  createPatientAppointment,
} from '../services/bookingService.js'

import DoctorProfile from '../models/DoctorProfile.js'
export const createAppointment =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const patientUserId =
        req.auth.userId

      const result =
        createAppointmentSchema.safeParse(
          req.body,
        )

      if (!result.success) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Randevu bilgileri geçerli değil.',

            errors:
              result.error.issues.map(
                (issue) => ({
                  field:
                    issue.path.join(
                      '.',
                    ),

                  message:
                    issue.message,
                }),
              ),
          })
      }

      const {
        doctorId,
        date,
        startTime,
        patientNote,
      } = result.data

      const appointment =
        await createPatientAppointment({
          patientUserId,

          doctorProfileId:
            doctorId,

          date,
          startTime,
          patientNote,
        })

      return res
        .status(201)
        .json({
          success: true,

          message:
            'Randevunuz başarıyla oluşturuldu.',

          data: {
            appointment: {
              id:
                appointment._id,

              appointmentCode:
                appointment.appointmentCode,

              patient:
                appointment.patient,

              doctor:
                appointment.doctor,

              startAt:
                appointment.startAt,

              endAt:
                appointment.endAt,

              status:
                appointment.status,

              patientNote:
                appointment.patientNote,

              createdAt:
                appointment.createdAt,
            },
          },
        })
    } catch (error) {
      if (
        error.statusCode &&
        error.code
      ) {
        return res
          .status(
            error.statusCode,
          )
          .json({
            success: false,

            code:
              error.code,

            message:
              error.message,
          })
      }

      return next(error)
    }
  }


export const getMyAppointments =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const patientUserId =
        req.auth.userId

      /*
       * Oturum açmış kullanıcıya ait
       * hasta profilini bul.
       */
      const patientProfile =
        await PatientProfile.findOne({
          user:
            patientUserId,
        })
          .select('_id')
          .lean()

      if (!patientProfile) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Hasta profili bulunamadı.',
          })
      }

      /*
       * Hastanın gerçek randevularını getir.
       * DoctorProfile doğrudan populate edilir.
       */
      const appointments =
        await Appointment.find({
          patient:
            patientProfile._id,
        })
          .populate({
            path: 'doctor',

            select: [
              'firstName',
              'lastName',
              'title',
              'clinicName',
              'location',
              'profileImageUrl',
            ].join(' '),
          })
          .sort({
            startAt: 1,
          })
          .lean()

      const formattedAppointments =
        appointments.map(
          (appointment) => ({
            id:
              appointment._id.toString(),

            appointmentCode:
              appointment.appointmentCode,

            doctor:
              appointment.doctor
                ? {
                    id:
                      appointment.doctor._id.toString(),

                    firstName:
                      appointment.doctor.firstName,

                    lastName:
                      appointment.doctor.lastName,

                    name:
                      `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,

                    title:
                      appointment.doctor.title,

                    clinicName:
                      appointment.doctor.clinicName,

                    location:
                      appointment.doctor.location,

                    profileImageUrl:
                      appointment.doctor.profileImageUrl,
                  }
                : null,

            startAt:
              appointment.startAt,

            endAt:
              appointment.endAt,

            status:
              appointment.status,

            patientNote:
              appointment.patientNote,

            createdAt:
              appointment.createdAt,
          }),
        )

      return res
        .status(200)
        .json({
          success: true,

          data: {
            appointments:
              formattedAppointments,
          },
        })
    } catch (error) {
      return next(error)
    }
  }
  export const getDoctorAppointments =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const doctorUserId =
        req.auth.userId

      const doctorProfile =
        await DoctorProfile.findOne({
          user: doctorUserId,
          isActive: true,
        })
          .select('_id')
          .lean()

      if (!doctorProfile) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Doktor profili bulunamadı.',
          })
      }

      const appointments =
        await Appointment.find({
          doctor:
            doctorProfile._id,
        })
          .populate({
            path: 'patient',
            select:
              'firstName lastName phone',
          })
          .sort({
            startAt: 1,
          })
          .lean()

      const formattedAppointments =
        appointments.map(
          (appointment) => ({
            id:
              appointment._id.toString(),

            appointmentCode:
              appointment.appointmentCode,

            patient:
              appointment.patient
                ? {
                    id:
                      appointment.patient._id.toString(),

                    firstName:
                      appointment.patient.firstName,

                    lastName:
                      appointment.patient.lastName,

                    name:
                      `${appointment.patient.firstName} ${appointment.patient.lastName}`,

                    phone:
                      appointment.patient.phone,
                  }
                : null,

            startAt:
              appointment.startAt,

            endAt:
              appointment.endAt,

            status:
              appointment.status,

            patientNote:
              appointment.patientNote,

            createdAt:
              appointment.createdAt,
          }),
        )

      return res
        .status(200)
        .json({
          success: true,

          data: {
            appointments:
              formattedAppointments,
          },
        })
    } catch (error) {
      return next(error)
    }
  }