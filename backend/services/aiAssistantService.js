import {
  AI_ASSISTANT_ACTIONS,
  AI_CONFIRMATION_ACTIONS,
} from '../constants/aiAssistantActions.js'

import {
  checkAiAppointmentRequest,
} from './aiAppointmentService.js'
import {
  getPatientInvoices,
} from './invoiceService.js'
import {
  aiAssistantIntentSchema,
} from '../validators/aiAssistantValidators.js'
import {
  getPatientTreatmentRecords,
} from './treatmentService.js'
import {
  getMessageContacts,
} from './messageService.js'
const createAiAssistantError = (
  message,
  statusCode = 400,
  code = 'AI_ASSISTANT_ERROR',
) => {
  const error = new Error(message)

  error.statusCode = statusCode
  error.code = code

  return error
}


export const normalizeAssistantIntent = (
  rawIntent,
) => {
  if (
    !rawIntent ||
    typeof rawIntent !== 'object'
  ) {
    throw createAiAssistantError(
      'AI yanıtı geçerli bir işlem formatında değil.',
      500,
      'AI_INVALID_INTENT_RESPONSE',
    )
  }

  const normalizedAction =
    String(
      rawIntent.action || '',
    )
      .trim()
      .toUpperCase()

  const normalizedIntent = {
    action:
      normalizedAction,

    reply:
      String(
        rawIntent.reply ||
          'İşleminize devam edebilmem için ek bilgiye ihtiyacım var.',
      ).trim(),

    parameters:
      rawIntent.parameters &&
      typeof rawIntent.parameters ===
        'object' &&
      !Array.isArray(
        rawIntent.parameters,
      )
        ? rawIntent.parameters
        : {},

    missingFields:
      Array.isArray(
        rawIntent.missingFields,
      )
        ? rawIntent.missingFields.map(
            (item) =>
              String(item),
          )
        : [],

    requiresConfirmation:
      Boolean(
        rawIntent.requiresConfirmation,
      ),
  }

  const result =
    aiAssistantIntentSchema.safeParse(
      normalizedIntent,
    )

  if (!result.success) {
    console.error(
      'AI INTENT VALIDATION ERROR:',
      result.error.issues,
    )

    console.error(
      'AI RAW INTENT:',
      rawIntent,
    )

    throw createAiAssistantError(
      'AI yanıtı geçerli bir işlem formatında değil.',
      500,
      'AI_INVALID_INTENT_RESPONSE',
    )
  }

  const intent = result.data

  const mustConfirm =
    AI_CONFIRMATION_ACTIONS.includes(
      intent.action,
    )

  return {
    action:
      intent.action,

    reply:
      intent.reply,

    parameters:
      intent.parameters || {},

    missingFields:
      intent.missingFields || [],

    requiresConfirmation:
      mustConfirm ||
      intent.requiresConfirmation,
  }
}

export const createAssistantResult = ({
  action,
  reply,
  parameters = {},
  missingFields = [],
  requiresConfirmation = false,
  data = null,
}) => {
  return {
    action,
    reply,
    parameters,
    missingFields,
    requiresConfirmation,
    data,
  }
}


export const ensureCompleteIntent = (
  intent,
) => {
  if (
    intent.missingFields?.length > 0
  ) {
    return false
  }

  return true
}


export const ensureConfirmationRequired = (
  action,
) => {
  return AI_CONFIRMATION_ACTIONS.includes(
    action,
  )
}


export const processAssistantIntent =
  async ({
    intent,
    role,
    userId = null,
  }) => {

        /*
      /*
     * GERÇEK FATURA VERİLERİ
     */
    if (
      intent.action ===
      AI_ASSISTANT_ACTIONS.GET_INVOICES
    ) {
      const parameters =
        intent.parameters || {}

      if (
        role === 'GUEST' ||
        !userId
      ) {
        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .GET_INVOICES,

          reply:
            'Faturalarınızı görüntüleyebilmek için hesabınıza giriş yapmanız gerekiyor.',

          parameters: {
            ...parameters,
            requiresLogin: true,
          },

          missingFields: [],

          requiresConfirmation:
            false,
        })
      }

      const invoices =
        await getPatientInvoices({
          patientUserId:
            userId,
        })

      const requestedStatus =
        String(
          parameters.status || '',
        )
          .trim()
          .toUpperCase()

      const allowedStatuses = [
        'PENDING',
        'PAID',
        'CANCELLED',
      ]

      const filteredInvoices =
        allowedStatuses.includes(
          requestedStatus,
        )
          ? invoices.filter(
              (invoice) =>
                invoice.status ===
                requestedStatus,
            )
          : invoices

      if (
        filteredInvoices.length === 0
      ) {
        const emptyReply =
          requestedStatus === 'PENDING'
            ? 'Ödenmemiş faturanız bulunmuyor.'
            : requestedStatus === 'PAID'
              ? 'Ödenmiş faturanız bulunmuyor.'
              : 'Görüntülenecek fatura kaydınız bulunmuyor.'

        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .GET_INVOICES,

          reply:
            emptyReply,

          parameters: {
            ...parameters,
            requiresLogin: false,
          },

          missingFields: [],

          requiresConfirmation:
            false,

          data: {
            invoices: [],
            count: 0,
          },
        })
      }

      const totalAmount =
        filteredInvoices.reduce(
          (sum, invoice) =>
            sum +
            Number(
              invoice.amount || 0,
            ),
          0,
        )

      const statusText =
        requestedStatus === 'PENDING'
          ? 'ödenmemiş'
          : requestedStatus === 'PAID'
            ? 'ödenmiş'
            : ''

      const reply =
        statusText
          ? `${filteredInvoices.length} adet ${statusText} faturanız bulunuyor. Toplam tutar ${totalAmount.toLocaleString(
              'tr-TR',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )} TRY.`
          : `${filteredInvoices.length} adet fatura kaydınız bulunuyor.`

      return createAssistantResult({
        action:
          AI_ASSISTANT_ACTIONS
            .GET_INVOICES,

        reply,

        parameters: {
          ...parameters,
          requiresLogin: false,
        },

        missingFields: [],

        requiresConfirmation:
          false,

        data: {
          invoices:
            filteredInvoices,

          count:
            filteredInvoices.length,

          totalAmount,
        },
      })
    }


    /*
     * GERÇEK TEDAVİ KAYITLARI
     */
    if (
      intent.action ===
      AI_ASSISTANT_ACTIONS.GET_TREATMENTS
    ) {
      const parameters =
        intent.parameters || {}

      if (
        role === 'GUEST' ||
        !userId
      ) {
        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .GET_TREATMENTS,

          reply:
            'Tedavi kayıtlarınızı görüntüleyebilmek için hesabınıza giriş yapmanız gerekiyor.',

          parameters: {
            ...parameters,
            requiresLogin: true,
          },

          missingFields: [],

          requiresConfirmation:
            false,
        })
      }

      const treatments =
        await getPatientTreatmentRecords({
          patientUserId:
            userId,
        })

      if (
        treatments.length === 0
      ) {
        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .GET_TREATMENTS,

          reply:
            'Görüntülenecek tedavi kaydınız bulunmuyor.',

          parameters: {
            ...parameters,
            requiresLogin: false,
          },

          missingFields: [],

          requiresConfirmation:
            false,

          data: {
            treatments: [],
            count: 0,
          },
        })
      }

      return createAssistantResult({
        action:
          AI_ASSISTANT_ACTIONS
            .GET_TREATMENTS,

        reply:
          `${treatments.length} adet tedavi kaydınız bulunuyor.`,

        parameters: {
          ...parameters,
          requiresLogin: false,
        },

        missingFields: [],

        requiresConfirmation:
          false,

        data: {
          treatments,

          count:
            treatments.length,
        },
      })
    }
        /*
     * GERÇEK MESAJLAŞMA KİŞİLERİ
     */
    if (
      intent.action ===
      AI_ASSISTANT_ACTIONS.GET_MESSAGE_CONTACTS
    ) {
      const parameters =
        intent.parameters || {}

      if (
        role === 'GUEST' ||
        !userId
      ) {
        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .GET_MESSAGE_CONTACTS,

          reply:
            'Mesajlaşabileceğiniz doktorları görüntüleyebilmek için hesabınıza giriş yapmanız gerekiyor.',

          parameters: {
            ...parameters,
            requiresLogin: true,
          },

          missingFields: [],

          requiresConfirmation:
            false,
        })
      }

      const contacts =
        await getMessageContacts({
          userId,
          role,
        })

      if (
        contacts.length === 0
      ) {
        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .GET_MESSAGE_CONTACTS,

          reply:
            'Mesajlaşabileceğiniz bir doktor bulunmuyor.',

          parameters: {
            ...parameters,
            requiresLogin: false,
          },

          missingFields: [],

          requiresConfirmation:
            false,

          data: {
            contacts: [],
            count: 0,
          },
        })
      }

      return createAssistantResult({
        action:
          AI_ASSISTANT_ACTIONS
            .GET_MESSAGE_CONTACTS,

        reply:
          `${contacts.length} doktorla mesajlaşabilirsiniz.`,

        parameters: {
          ...parameters,
          requiresLogin: false,
        },

        missingFields: [],

        requiresConfirmation:
          false,

        data: {
          contacts,
          count:
            contacts.length,
        },
      })
    }
    /*
     * MESAJ GÖNDERME HAZIRLIĞI
     * Mesaj burada gönderilmez.
     * Önce kullanıcı onayı istenir.
     */
    if (
      intent.action ===
      AI_ASSISTANT_ACTIONS.SEND_MESSAGE
    ) {
      const parameters =
        intent.parameters || {}

      if (
        role === 'GUEST' ||
        !userId
      ) {
        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .SEND_MESSAGE,

          reply:
            'Doktorunuza mesaj gönderebilmek için hesabınıza giriş yapmanız gerekiyor.',

          parameters: {
            ...parameters,
            requiresLogin: true,
          },

          missingFields: [],

          requiresConfirmation:
            false,
        })
      }

      const doctorName =
        String(
          parameters.doctorName ||
          parameters.doctor ||
          '',
        ).trim()

      const content =
        String(
          parameters.content ||
          parameters.message ||
          '',
        ).trim()

      const missingFields = []

      if (!doctorName) {
        missingFields.push('doctor')
      }

      if (!content) {
        missingFields.push('content')
      }

      if (missingFields.length > 0) {
        let reply =
          'Mesaj gönderebilmem için doktor adı ve mesaj içeriğine ihtiyacım var.'

        if (
          missingFields.includes('doctor') &&
          !missingFields.includes('content')
        ) {
          reply =
            'Mesajı hangi doktora göndermek istiyorsunuz?'
        }

        if (
          missingFields.includes('content') &&
          !missingFields.includes('doctor')
        ) {
          reply =
            'Doktorunuza hangi mesajı göndermek istiyorsunuz?'
        }

        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .SEND_MESSAGE,

          reply,

          parameters: {
            ...parameters,
            doctor: doctorName,
            content,
          },

          missingFields,

          requiresConfirmation:
            false,
        })
      }

      const contacts =
        await getMessageContacts({
          userId,
          role,
        })

    const normalizeName =
  (value) =>
    String(value || '')
      .trim()
      .replace(
        /^["“”]+|["“”]+$/g,
        '',
      )
      .replace(
        /['’](ya|ye|a|e)$/i,
        '',
      )
      .toLocaleLowerCase('tr-TR')
      .replace(
        /^(dr\.?|doktor|diş hekimi)\s+/i,
        '',
      )
      .replace(/\s+/g, ' ')
      .trim()

      const requestedDoctor =
        normalizeName(doctorName)

      const matchingContacts =
        contacts.filter((contact) => {
          const fullName =
            `${contact.firstName || ''} ${contact.lastName || ''}`

          const normalizedFullName =
            normalizeName(fullName)

          return (
            normalizedFullName ===
              requestedDoctor ||
            normalizedFullName.includes(
              requestedDoctor,
            ) ||
            requestedDoctor.includes(
              normalizedFullName,
            )
          )
        })

      if (matchingContacts.length === 0) {
        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .SEND_MESSAGE,

          reply:
            `"${doctorName}" adlı doktora mesaj gönderme yetkiniz bulunmuyor veya doktor mesajlaşma listenizde değil.`,

          parameters: {
            doctor: doctorName,
            content,
          },

          missingFields: [
            'doctor',
          ],

          requiresConfirmation:
            false,
        })
      }

      if (matchingContacts.length > 1) {
        return createAssistantResult({
          action:
            AI_ASSISTANT_ACTIONS
              .SEND_MESSAGE,

          reply:
            'Bu isimle birden fazla doktor bulundu. Lütfen doktorun tam adını belirtin.',

          parameters: {
            doctor: doctorName,
            content,
          },

          missingFields: [
            'doctor',
          ],

          requiresConfirmation:
            false,
        })
      }

      const contact =
        matchingContacts[0]

      const resolvedDoctorName =
        `${contact.firstName} ${contact.lastName}`

      return createAssistantResult({
        action:
          AI_ASSISTANT_ACTIONS
            .SEND_MESSAGE,

        reply:
          `${resolvedDoctorName} adlı doktora aşağıdaki mesajı göndermek üzeresiniz. Göndermeden önce onayınız gerekiyor.`,

        parameters: {
          recipientId:
            contact.recipientId,

          doctor:
            resolvedDoctorName,

          content,

          requiresLogin:
            false,
        },

        missingFields: [],

        requiresConfirmation:
          true,

        data: {
          recipient: {
            recipientId:
              contact.recipientId,

            firstName:
              contact.firstName,

            lastName:
              contact.lastName,

            title:
              contact.title || '',
          },

          content,
        },
      })
    }

    const isAppointmentRequest = [
      AI_ASSISTANT_ACTIONS
        .CHECK_APPOINTMENT_AVAILABILITY,

      AI_ASSISTANT_ACTIONS
        .CREATE_APPOINTMENT,
    ].includes(intent.action)

    if (!isAppointmentRequest) {
      return intent
    }

    const parameters =
      intent.parameters || {}

    const doctorName =
      parameters.doctorName ||
      parameters.doctor ||
      ''

    const date =
      parameters.date || ''

    const time =
      parameters.time || ''

    const result =
      await checkAiAppointmentRequest({
        doctorName,
        date,
        time,
      })


    /*
     * Eksik bilgi
     */
    if (
      result.status ===
      'NEEDS_INFO'
    ) {
      let reply =
        'Randevu uygunluğunu kontrol edebilmem için bazı bilgilere ihtiyacım var.'

      if (
        result.missingFields.includes(
          'doctor',
        )
      ) {
        reply =
          'Hangi doktor için uygunluk kontrolü yapmak istiyorsunuz?'
      } else if (
        result.missingFields.includes(
          'date',
        )
      ) {
        reply =
          'Hangi tarih için randevu uygunluğunu kontrol etmek istiyorsunuz?'
      } else if (
        result.missingFields.includes(
          'time',
        )
      ) {
        reply =
          'Hangi saat için uygunluk kontrolü yapmak istiyorsunuz?'
      }

      return createAssistantResult({
        action:
          AI_ASSISTANT_ACTIONS
            .CHECK_APPOINTMENT_AVAILABILITY,

        reply,

        parameters,

        missingFields:
          result.missingFields,

        requiresConfirmation:
          false,
      })
    }


    /*
     * Doktor bulunamadı
     */
    if (
      result.status ===
      'DOCTOR_NOT_FOUND'
    ) {
      return createAssistantResult({
        action:
          AI_ASSISTANT_ACTIONS
            .CHECK_APPOINTMENT_AVAILABILITY,

        reply:
          `"${result.doctorName}" adına ait aktif bir doktor DentFlow sisteminde bulunamadı.`,

        parameters,

        missingFields: [
          'doctor',
        ],

        requiresConfirmation:
          false,
      })
    }


    /*
     * Aynı isimle birden fazla doktor
     */
    if (
      result.status ===
      'DOCTOR_AMBIGUOUS'
    ) {
      const doctorNames =
        result.doctors
          .map(
            (doctor) =>
              doctor.name,
          )
          .join(', ')

      return createAssistantResult({
        action:
          AI_ASSISTANT_ACTIONS
            .CHECK_APPOINTMENT_AVAILABILITY,

        reply:
          `Bu isimle birden fazla doktor bulundu: ${doctorNames}. Hangisini seçmek istediğinizi belirtir misiniz?`,

        parameters: {
          ...parameters,

          doctorOptions:
            result.doctors,
        },

        missingFields: [
          'doctor',
        ],

        requiresConfirmation:
          false,
      })
    }


    /*
     * Saat uygun değil
     */
    if (
      result.status ===
      'NOT_AVAILABLE'
    ) {
      const slots =
        result.availableSlots || []

      const alternativeText =
        slots.length > 0
          ? ` Aynı gün müsait saatler: ${slots
              .slice(0, 6)
              .join(', ')}.`
          : ' Bu tarihte kullanılabilir başka bir saat bulunmuyor.'

      return createAssistantResult({
        action:
          AI_ASSISTANT_ACTIONS
            .CHECK_APPOINTMENT_AVAILABILITY,

        reply:
          `${result.doctor?.name || 'Seçilen doktor'} için ${result.date} tarihinde ${result.time} saati müsait değil.${alternativeText}`,

        parameters: {
          ...parameters,

          doctorProfileId:
            result.doctor?.id,

          availableSlots:
            slots,
        },

        missingFields: [],

        requiresConfirmation:
          false,

        data: result,
      })
    }


    /*
     * Saat gerçekten uygun
     */
    if (
      result.status ===
      'AVAILABLE'
    ) {
      const isGuest =
        role === 'GUEST'

      return createAssistantResult({
        action:
          AI_ASSISTANT_ACTIONS
            .CHECK_APPOINTMENT_AVAILABILITY,

        reply: isGuest
          ? `${result.doctor.name} için ${result.date} tarihinde ${result.time} saati müsait. Randevu oluşturmak için hesabınıza giriş yapmanız gerekiyor.`
          : `${result.doctor.name} için ${result.date} tarihinde ${result.time} saati müsait.`,

        parameters: {
          ...parameters,

          doctor:
            result.doctor.name,

          doctorProfileId:
            result.doctorProfileId,

          date:
            result.date,

          time:
            result.time,

          requiresLogin:
            isGuest,
        },

        missingFields: [],

        requiresConfirmation:
          !isGuest,

        data: result,
      })
    }


    return intent
  }