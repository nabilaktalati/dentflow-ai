import {
  Document,
  Font,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer'

import dejaVuSansRegular from 'dejavu-fonts-ttf/ttf/DejaVuSans.ttf?url'
import dejaVuSansBold from 'dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf?url'


Font.register({
  family: 'DejaVu Sans',

  fonts: [
    {
      src: dejaVuSansRegular,
      fontWeight: 400,
    },
    {
      src: dejaVuSansRegular,
      fontWeight: 500,
    },
    {
      src: dejaVuSansBold,
      fontWeight: 600,
    },
    {
      src: dejaVuSansBold,
      fontWeight: 700,
    },
  ],
})

const statusMeta = {
  PLANNED: {
    label: 'Planlandı',
    color: '#B7791F',
    backgroundColor: '#FFF8E7',
  },

  IN_PROGRESS: {
    label: 'Devam Ediyor',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },

  COMPLETED: {
    label: 'Tamamlandı',
    color: '#047857',
    backgroundColor: '#ECFDF5',
  },
}


const formatDate = (
  value,
) => {
  if (!value) {
    return 'Belirtilmedi'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Belirtilmedi'
  }

  return new Intl.DateTimeFormat(
    'tr-TR',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  ).format(date)
}


const styles =
  StyleSheet.create({
    page: {
      fontFamily: 'DejaVu Sans',
      fontSize: 9,
      color: '#172033',
      backgroundColor: '#FFFFFF',

      paddingTop: 26,
      paddingRight: 34,
      paddingBottom: 42,
      paddingLeft: 34,
    },


    accent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,

      height: 5,

      backgroundColor: '#6366F1',
    },


    header: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      paddingBottom: 16,

      borderBottomWidth: 1,

      borderBottomColor:
        '#E9EAF1',
    },


    brand: {
      flexDirection: 'row',
      alignItems: 'center',
    },


    brandMark: {
      width: 36,
      height: 36,

      borderRadius: 10,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: '#EEF2FF',

      borderWidth: 1,

      borderColor: '#D9DEFF',

      marginRight: 10,
    },


    brandMarkText: {
      fontSize: 15,
      fontWeight: 700,

      color: '#5B5FEF',
    },


    brandName: {
      fontSize: 14,
      fontWeight: 700,

      color: '#111827',
    },


    brandSubtitle: {
      marginTop: 2,

      fontSize: 7,

      color: '#8B91A3',
    },


    headerRight: {
      alignItems: 'flex-end',
    },


    reportType: {
      fontSize: 7,
      fontWeight: 700,

      letterSpacing: 1,

      color: '#6366F1',
    },


    reportCode: {
      marginTop: 5,

      fontSize: 8,
      fontWeight: 600,

      color: '#31384B',
    },


    reportDate: {
      marginTop: 3,

      fontSize: 7,

      color: '#969BAB',
    },


    hero: {
      marginTop: 18,
      marginBottom: 15,

      padding: 16,

      borderRadius: 14,

      backgroundColor: '#F7F7FC',
    },


    heroTop: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'flex-start',
    },


    heroEyebrow: {
      fontSize: 7,

      fontWeight: 700,

      letterSpacing: 1,

      color: '#6366F1',
    },


    heroTitle: {
      marginTop: 5,

      fontSize: 21,

      fontWeight: 700,

      color: '#101828',
    },


    patientLabel: {
      marginTop: 9,

      fontSize: 7,

      color: '#8E94A6',
    },


    patientName: {
      marginTop: 3,

      fontSize: 10,

      fontWeight: 600,

      color: '#303648',
    },


    statusBadge: {
  borderRadius: 20,

  paddingVertical: 7,
  paddingHorizontal: 12,

  fontSize: 8,

  fontWeight: 700,

  borderWidth: 1,
},


    quickInfo: {
      flexDirection: 'row',

      marginTop: 13,

      paddingTop: 12,

      borderTopWidth: 1,

      borderTopColor: '#E3E5EE',
    },


    quickInfoItem: {
      flex: 1,
    },


    quickInfoBorder: {
      borderLeftWidth: 1,

      borderLeftColor: '#E3E5EE',

      paddingLeft: 12,
      marginLeft: 12,
    },


    label: {
      fontSize: 6.5,

      fontWeight: 700,

      letterSpacing: 0.7,

      color: '#969CAD',
    },


    value: {
      marginTop: 4,

      fontSize: 8.5,

      fontWeight: 600,

      color: '#252B3D',
    },


    section: {
      marginBottom: 13,
    },


    sectionTitleRow: {
      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 8,
    },


    sectionLine: {
      width: 3,
      height: 12,

      borderRadius: 2,

      backgroundColor: '#6366F1',

      marginRight: 7,
    },


    sectionTitle: {
      fontSize: 7,

      fontWeight: 700,

      letterSpacing: 0.9,

      color: '#737A8E',
    },


    infoGrid: {
      flexDirection: 'row',
    },


    infoCard: {
      flex: 1,

      minHeight: 58,

      padding: 10,

      borderWidth: 1,

      borderColor: '#E8EAF0',

      borderRadius: 10,
    },


    infoCardMargin: {
      marginRight: 7,
    },


    infoValue: {
      marginTop: 5,

      fontSize: 8,

      fontWeight: 600,

      color: '#252B3B',

      lineHeight: 1.4,
    },


    textCard: {
      paddingTop: 11,
      paddingRight: 12,
      paddingBottom: 11,
      paddingLeft: 12,

      marginBottom: 7,

      borderWidth: 1,

      borderColor: '#E7E9F0',

      borderRadius: 10,

      backgroundColor: '#FFFFFF',
    },


    noteCard: {
      borderColor: '#DADDFE',

      backgroundColor: '#F7F7FF',
    },


    textCardHeader: {
      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 7,
    },


    cardDot: {
      width: 4,
      height: 14,

      borderRadius: 2,

      backgroundColor: '#6366F1',

      marginRight: 7,
    },


    violetDot: {
      backgroundColor: '#8B5CF6',
    },


    cardTitle: {
      fontSize: 7,

      fontWeight: 700,

      letterSpacing: 0.8,

      color: '#6F7689',
    },


    noteTitle: {
      color: '#5559D9',
    },


    cardText: {
      fontSize: 8.5,

      lineHeight: 1.55,

      color: '#313749',
    },


    clinicBand: {
      flexDirection: 'row',

      padding: 11,

      borderRadius: 11,

      backgroundColor: '#F5F6F9',
    },


    clinicItem: {
      flex: 1,
    },


    clinicBorder: {
      borderLeftWidth: 1,

      borderLeftColor: '#E0E3EA',

      paddingLeft: 10,
      marginLeft: 10,
    },


    footer: {
      position: 'absolute',

      left: 34,
      right: 34,
      bottom: 17,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      paddingTop: 8,

      borderTopWidth: 1,

      borderTopColor: '#E8EAF0',
    },


    footerText: {
      fontSize: 6.5,

      color: '#959BAC',
    },


    footerBrand: {
      fontSize: 6.5,

      fontWeight: 600,

      color: '#6366F1',
    },
  })


function TreatmentPdfReport({
  treatment,
}) {
  if (!treatment) {
    return null
  }


  const patient =
    treatment.patient

  const doctor =
    treatment.doctor

  const appointment =
    treatment.appointment


  const status =
    statusMeta[
      treatment.status
    ] || {
      label:
        treatment.status ||
        'Belirtilmedi',

      color: '#475569',

      backgroundColor:
        '#F1F5F9',
    }


  const reportDate =
    formatDate(
      new Date(),
    )


  return (
    <Document
      title="DentFlow AI - Hasta Tedavi Raporu"
      author="DentFlow AI"
      subject="Hasta Tedavi Raporu"
      creator="DentFlow AI"
    >
      <Page
        size="A4"
        style={
          styles.page
        }
        wrap={false}
      >
        <View
          style={
            styles.accent
          }
        />


        {/* HEADER */}
        <View
          style={
            styles.header
          }
        >
          <View
            style={
              styles.brand
            }
          >
          <View
  style={
    styles.brandMark
  }
>
  <Svg
    width={22}
    height={22}
    viewBox="0 0 40 40"
  >
    <Path
      d="M12 8C14.5 5.5 17.5 5 20 7C22.5 5 25.5 5.5 28 8C31 11 30.5 16 28.5 20C26.5 24 25.5 31 23 33C21.6 34.2 20.8 29.5 20 26C19.2 29.5 18.4 34.2 17 33C14.5 31 13.5 24 11.5 20C9.5 16 9 11 12 8Z"
      stroke="#5956F5"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
</View>

            <View>
             <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
  }}
>
  <Text
    style={
      styles.brandName
    }
  >
    DentFlow
  </Text>

  <Text
    style={[
      styles.brandName,
      {
        color: '#5956F5',
        marginLeft: 3,
      },
    ]}
  >
    AI
  </Text>
</View>

              <Text
                style={
                  styles.brandSubtitle
                }
              >
                Akıllı Klinik Yönetimi
              </Text>
            </View>
          </View>


          <View
            style={
              styles.headerRight
            }
          >
            <Text
              style={
                styles.reportType
              }
            >
              HASTA TEDAVİ RAPORU
            </Text>

            <Text
              style={
                styles.reportCode
              }
            >
              {appointment
                ?.appointmentCode ||
                'Kod belirtilmedi'}
            </Text>

            <Text
              style={
                styles.reportDate
              }
            >
              {reportDate}
            </Text>
          </View>
        </View>


        {/* HERO */}
        <View
          style={
            styles.hero
          }
        >
          <View
            style={
              styles.heroTop
            }
          >
            <View>
              <Text
                style={
                  styles.heroEyebrow
                }
              >
                DİJİTAL TEDAVİ DOSYASI
              </Text>

              <Text
                style={
                  styles.heroTitle
                }
              >
                Tedavi Raporu
              </Text>

              <Text
                style={
                  styles.patientLabel
                }
              >
                HASTA
              </Text>

              <Text
                style={
                  styles.patientName
                }
              >
                {patient?.name ||
                  'Belirtilmedi'}
              </Text>
            </View>


            <Text
              style={[
                styles.statusBadge,
                {
  color:
    status.color,

  backgroundColor:
    status.backgroundColor,

  borderColor:
    status.color,
},
              ]}
            >
              {status.label}
            </Text>
          </View>


          <View
            style={
              styles.quickInfo
            }
          >
            <View
              style={
                styles.quickInfoItem
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                ZİYARET TARİHİ
              </Text>

              <Text
                style={
                  styles.value
                }
              >
                {formatDate(
                  treatment
                    .visitDate,
                )}
              </Text>
            </View>


            <View
              style={[
                styles.quickInfoItem,
                styles.quickInfoBorder,
              ]}
            >
              <Text
                style={
                  styles.label
                }
              >
                DOKTOR
              </Text>

              <Text
                style={
                  styles.value
                }
              >
                {doctor?.name ||
                  'Belirtilmedi'}
              </Text>
            </View>


            <View
              style={[
                styles.quickInfoItem,
                styles.quickInfoBorder,
              ]}
            >
              <Text
                style={
                  styles.label
                }
              >
                SONRAKİ KONTROL
              </Text>

              <Text
                style={
                  styles.value
                }
              >
                {formatDate(
                  treatment
                    .nextVisitDate,
                )}
              </Text>
            </View>
          </View>
        </View>


        {/* PATIENT */}
        <View
          style={
            styles.section
          }
        >
          <View
            style={
              styles.sectionTitleRow
            }
          >
            <View
              style={
                styles.sectionLine
              }
            />

            <Text
              style={
                styles.sectionTitle
              }
            >
              HASTA VE RANDEVU BİLGİLERİ
            </Text>
          </View>


          <View
            style={
              styles.infoGrid
            }
          >
            <View
              style={[
                styles.infoCard,
                styles.infoCardMargin,
              ]}
            >
              <Text
                style={
                  styles.label
                }
              >
                TELEFON
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {patient?.phone ||
                  'Belirtilmedi'}
              </Text>
            </View>


            <View
              style={[
                styles.infoCard,
                styles.infoCardMargin,
              ]}
            >
              <Text
                style={
                  styles.label
                }
              >
                DOĞUM TARİHİ
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {formatDate(
                  patient
                    ?.dateOfBirth,
                )}
              </Text>
            </View>


            <View
              style={
                styles.infoCard
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                RANDEVU KODU
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {appointment
                  ?.appointmentCode ||
                  'Belirtilmedi'}
              </Text>
            </View>
          </View>
        </View>


        {/* MEDICAL */}
        <View
          style={
            styles.section
          }
        >
          <View
            style={
              styles.sectionTitleRow
            }
          >
            <View
              style={
                styles.sectionLine
              }
            />

            <Text
              style={
                styles.sectionTitle
              }
            >
              KLİNİK DEĞERLENDİRME
            </Text>
          </View>


          <View
            style={
              styles.textCard
            }
          >
            <View
              style={
                styles.textCardHeader
              }
            >
              <View
                style={
                  styles.cardDot
                }
              />

              <Text
                style={
                  styles.cardTitle
                }
              >
                TEŞHİS
              </Text>
            </View>

            <Text
              style={
                styles.cardText
              }
            >
              {
                treatment.diagnosis
              }
            </Text>
          </View>


          <View
            style={
              styles.textCard
            }
          >
            <View
              style={
                styles.textCardHeader
              }
            >
              <View
                style={[
                  styles.cardDot,
                  styles.violetDot,
                ]}
              />

              <Text
                style={
                  styles.cardTitle
                }
              >
                TEDAVİ PLANI
              </Text>
            </View>

            <Text
              style={
                styles.cardText
              }
            >
              {
                treatment
                  .treatmentPlan
              }
            </Text>
          </View>


          {treatment
            .doctorNotes ? (
            <View
              style={[
                styles.textCard,
                styles.noteCard,
              ]}
            >
              <View
                style={
                  styles.textCardHeader
                }
              >
                <View
                  style={
                    styles.cardDot
                  }
                />

                <Text
                  style={[
                    styles.cardTitle,
                    styles.noteTitle,
                  ]}
                >
                  DOKTOR NOTU
                </Text>
              </View>

              <Text
                style={
                  styles.cardText
                }
              >
                {
                  treatment
                    .doctorNotes
                }
              </Text>
            </View>
          ) : null}
        </View>


        {/* CLINIC */}
        <View
          style={
            styles.section
          }
        >
          <View
            style={
              styles.sectionTitleRow
            }
          >
            <View
              style={
                styles.sectionLine
              }
            />

            <Text
              style={
                styles.sectionTitle
              }
            >
              KLİNİK BİLGİLERİ
            </Text>
          </View>


          <View
            style={
              styles.clinicBand
            }
          >
            <View
              style={
                styles.clinicItem
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                KLİNİK
              </Text>

              <Text
                style={
                  styles.value
                }
              >
                {doctor
                  ?.clinicName ||
                  'Belirtilmedi'}
              </Text>
            </View>


            <View
              style={[
                styles.clinicItem,
                styles.clinicBorder,
              ]}
            >
              <Text
                style={
                  styles.label
                }
              >
                DOKTOR
              </Text>

              <Text
                style={
                  styles.value
                }
              >
                {doctor?.name ||
                  'Belirtilmedi'}
              </Text>
            </View>


            <View
              style={[
                styles.clinicItem,
                styles.clinicBorder,
              ]}
            >
              <Text
                style={
                  styles.label
                }
              >
                TEDAVİ DURUMU
              </Text>

              <Text
                style={{
                  ...styles.value,

                  color:
                    status.color,
                }}
              >
                {status.label}
              </Text>
            </View>
          </View>
        </View>


        {/* FOOTER */}
        <View
          style={
            styles.footer
          }
          fixed
        >
          <Text
            style={
              styles.footerText
            }
          >
            Bu belge DentFlow AI
            sistemi üzerinden
            oluşturulmuştur.
          </Text>

          <Text
            style={
              styles.footerBrand
            }
          >
            DentFlow AI · Akıllı
            Klinik Yönetimi
          </Text>
        </View>
      </Page>
    </Document>
  )
}


export default TreatmentPdfReport