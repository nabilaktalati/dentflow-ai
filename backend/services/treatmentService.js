import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";
import TreatmentRecord from "../models/TreatmentRecord.js";
import PatientProfile from "../models/PatientProfile.js";
import { APPOINTMENT_STATUSES } from "../constants/appointment.js";
import Invoice from "../models/Invoice.js";
const createTreatmentError = (message, statusCode, code) => {
  const error = new Error(message);

  error.statusCode = statusCode;

  error.code = code;

  return error;
};

export const createDoctorTreatmentRecord = async ({
  doctorUserId,
  appointmentId,
  diagnosis,
  treatmentPlan,
  doctorNotes,
  status,
  nextVisitDate,
}) => {
  /*
   * Oturum açan kullanıcının
   * doktor profilini bul.
   */
  const doctorProfile = await DoctorProfile.findOne({
    user: doctorUserId,

    isActive: true,
  })
    .select("_id")
    .lean();

  if (!doctorProfile) {
    throw createTreatmentError(
      "Doktor profili bulunamadı.",
      404,
      "DOCTOR_PROFILE_NOT_FOUND",
    );
  }

  /*
   * Doktor yalnızca kendi
   * randevusuna kayıt ekleyebilir.
   */
  const appointment = await Appointment.findOne({
    _id: appointmentId,

    doctor: doctorProfile._id,
  })
    .select("_id patient doctor startAt status")
    .lean();

  if (!appointment) {
    throw createTreatmentError(
      "Randevu bulunamadı veya bu randevu size ait değil.",
      404,
      "APPOINTMENT_NOT_FOUND",
    );
  }

  if (appointment.status === APPOINTMENT_STATUSES.CANCELLED) {
    throw createTreatmentError(
      "İptal edilmiş bir randevu için tedavi kaydı oluşturulamaz.",
      409,
      "CANCELLED_APPOINTMENT",
    );
  }

  /*
   * Aynı randevu için yalnızca
   * bir tedavi kaydı oluşturulur.
   */
  const existingRecord = await TreatmentRecord.findOne({
    appointment: appointment._id,
  })
    .select("_id")
    .lean();

  if (existingRecord) {
    throw createTreatmentError(
      "Bu randevu için zaten bir tedavi kaydı oluşturulmuş.",
      409,
      "TREATMENT_RECORD_ALREADY_EXISTS",
    );
  }

  let parsedNextVisitDate = null;

  if (nextVisitDate) {
    parsedNextVisitDate = new Date(nextVisitDate);

    if (parsedNextVisitDate <= appointment.startAt) {
      throw createTreatmentError(
        "Sonraki kontrol tarihi randevu tarihinden sonra olmalıdır.",
        400,
        "INVALID_NEXT_VISIT_DATE",
      );
    }
  }

  try {
    const treatmentRecord = await TreatmentRecord.create({
      patient: appointment.patient,

      doctor: appointment.doctor,

      appointment: appointment._id,

      visitDate: appointment.startAt,

      diagnosis,

      treatmentPlan,

      doctorNotes,

      status,

      nextVisitDate: parsedNextVisitDate,
    });

    return treatmentRecord;
  } catch (error) {
    /*
     * Database seviyesindeki unique
     * appointment index'i de ikinci
     * kaydı engeller.
     */
    if (error?.code === 11000) {
      throw createTreatmentError(
        "Bu randevu için zaten bir tedavi kaydı oluşturulmuş.",
        409,
        "TREATMENT_RECORD_ALREADY_EXISTS",
      );
    }

    throw error;
  }
};

export const getPatientTreatmentRecords = async ({ patientUserId }) => {
  const patientProfile = await PatientProfile.findOne({
    user: patientUserId,
  })
    .select("_id firstName lastName phone dateOfBirth")
    .lean();

  if (!patientProfile) {
    throw createTreatmentError(
      "Hasta profili bulunamadı.",
      404,
      "PATIENT_PROFILE_NOT_FOUND",
    );
  }

  const records = await TreatmentRecord.find({
    patient: patientProfile._id,
  })
    .populate({
      path: "doctor",
      select: "firstName lastName title clinicName profileImageUrl",
    })

    .populate({
      path: "appointment",
      select: "appointmentCode startAt endAt status",
    })
    .sort({
      visitDate: -1,
    })
    .lean();
const invoices =
  await Invoice.find({
    treatmentRecord: {
      $in:
        records.map(
          (record) =>
            record._id,
        ),
    },

    status: {
      $ne: 'CANCELLED',
    },
  })
    .select(
      'treatmentRecord',
    )
    .lean()


const invoicedTreatmentIds =
  new Set(
    invoices.map(
      (invoice) =>
        invoice.treatmentRecord.toString(),
    ),
  )
  return records.map((record) => ({
    id: record._id,
    
    patient: {
      id: patientProfile._id,

      firstName: patientProfile.firstName,

      lastName: patientProfile.lastName,

      name: `${patientProfile.firstName} ${patientProfile.lastName}`,

      phone: patientProfile.phone,

      dateOfBirth: patientProfile.dateOfBirth,
    },
    visitDate: record.visitDate,

    diagnosis: record.diagnosis,

    treatmentPlan: record.treatmentPlan,

    doctorNotes: record.doctorNotes,

    status: record.status,

    nextVisitDate: record.nextVisitDate,
    
    doctor: record.doctor
      ? {
          id: record.doctor._id,

          firstName: record.doctor.firstName,

          lastName: record.doctor.lastName,

          name: `${record.doctor.firstName} ${record.doctor.lastName}`,

          title: record.doctor.title,

          clinicName: record.doctor.clinicName,

          profileImageUrl: record.doctor.profileImageUrl,
        }
      : null,

    appointment: record.appointment
      ? {
          id: record.appointment._id,

          appointmentCode: record.appointment.appointmentCode,

          startAt: record.appointment.startAt,

          endAt: record.appointment.endAt,

          status: record.appointment.status,
        }
      : null,

    createdAt: record.createdAt,

    updatedAt: record.updatedAt,
  }));
};
export const getDoctorTreatmentRecords =
  async ({
    doctorUserId,
  }) => {
    const doctorProfile =
      await DoctorProfile.findOne({
        user: doctorUserId,
        isActive: true,
      })
        .select(
          '_id firstName lastName title clinicName',
        )
        .lean()

    if (!doctorProfile) {
      throw createTreatmentError(
        'Doktor profili bulunamadı.',
        404,
        'DOCTOR_PROFILE_NOT_FOUND',
      )
    }


    const records =
      await TreatmentRecord.find({
        doctor:
          doctorProfile._id,
      })
        .populate({
          path: 'patient',

          select:
            'firstName lastName phone dateOfBirth',
        })
        .populate({
          path: 'appointment',

          select:
            'appointmentCode startAt endAt status',
        })
        .sort({
          visitDate: -1,
        })
        .lean()
const invoices =
  await Invoice.find({
    treatmentRecord: {
      $in:
        records.map(
          (record) =>
            record._id,
        ),
    },

    status: {
      $ne: 'CANCELLED',
    },
  })
    .select(
      'treatmentRecord',
    )
    .lean()


const invoicedTreatmentIds =
  new Set(
    invoices.map(
      (invoice) =>
        invoice.treatmentRecord.toString(),
    ),
  )

    return records.map(
      (record) => ({
        id:
          record._id,
hasInvoice:
  invoicedTreatmentIds.has(
    record._id.toString(),
  ),
        patient:
          record.patient
            ? {
                id:
                  record.patient._id,

                firstName:
                  record.patient.firstName,

                lastName:
                  record.patient.lastName,

                name:
                  `${record.patient.firstName} ${record.patient.lastName}`,

                phone:
                  record.patient.phone,

                dateOfBirth:
                  record.patient.dateOfBirth,
              }
            : null,

        doctor: {
          id:
            doctorProfile._id,

          firstName:
            doctorProfile.firstName,

          lastName:
            doctorProfile.lastName,

          name:
            `${doctorProfile.firstName} ${doctorProfile.lastName}`,

          title:
            doctorProfile.title,

          clinicName:
            doctorProfile.clinicName,
        },

        appointment:
          record.appointment
            ? {
                id:
                  record.appointment._id,

                appointmentCode:
                  record.appointment.appointmentCode,

                startAt:
                  record.appointment.startAt,

                endAt:
                  record.appointment.endAt,

                status:
                  record.appointment.status,
              }
            : null,

        visitDate:
          record.visitDate,

        diagnosis:
          record.diagnosis,

        treatmentPlan:
          record.treatmentPlan,

        doctorNotes:
          record.doctorNotes,

        status:
          record.status,

        nextVisitDate:
          record.nextVisitDate,

        createdAt:
          record.createdAt,

        updatedAt:
          record.updatedAt,
      }),
    )
  }