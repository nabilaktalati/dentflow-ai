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
      src: dejaVuSansBold,
      fontWeight: 600,
    },
    {
      src: dejaVuSansBold,
      fontWeight: 700,
    },
  ],
})


const styles =
  StyleSheet.create({
    page: {
      fontFamily:
        'DejaVu Sans',

      paddingTop: 26,
      paddingHorizontal: 32,
      paddingBottom: 24,

      fontSize: 8.5,

      color: '#172033',

      backgroundColor:
        '#FFFFFF',
    },

    topLine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,

      height: 4,

      backgroundColor:
        '#625BF6',
    },

    header: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      paddingBottom: 18,

      borderBottomWidth: 1,

      borderBottomColor:
        '#E6E8F0',
    },

    brand: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    brandMark: {
      width: 38,
      height: 38,

      borderRadius: 10,

      borderWidth: 1,

      borderColor:
        '#DCDDFE',

      backgroundColor:
        '#F5F4FF',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 10,
    },

    brandName: {
      fontSize: 13,

      fontWeight: 700,

      color: '#111827',
    },

    brandSub: {
      marginTop: 3,

      fontSize: 5.8,

      color: '#8B93A7',
    },

    rightHeader: {
      alignItems: 'flex-end',
    },

    eyebrow: {
      fontSize: 5.8,

      fontWeight: 700,

      letterSpacing: 1.3,

      color: '#625BF6',
    },

    invoiceNumber: {
      marginTop: 5,

      fontSize: 8,

      fontWeight: 700,

      color: '#172033',
    },

    smallText: {
      marginTop: 3,

      fontSize: 6,

      color: '#9AA1B2',
    },

    hero: {
      marginTop: 20,

      padding: 18,

      borderRadius: 12,

      backgroundColor:
        '#F7F7FD',
    },

    heroTop: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'flex-start',
    },

    title: {
      marginTop: 5,

      fontSize: 20,

      fontWeight: 700,

      color: '#101828',
    },

    patientLabel: {
      marginTop: 14,

      fontSize: 5.5,

      fontWeight: 700,

      letterSpacing: 1,

      color: '#9AA1B2',
    },

    patientName: {
      marginTop: 4,

      fontSize: 9,

      fontWeight: 700,
    },

    amountBox: {
      paddingVertical: 9,

      paddingHorizontal: 12,

      borderRadius: 9,

      backgroundColor:
        '#EEEDFF',

      alignItems: 'flex-end',
    },

    amountLabel: {
      fontSize: 5.4,

      fontWeight: 700,

      letterSpacing: 1,

      color: '#7773DE',
    },

    amount: {
      marginTop: 5,

      fontSize: 14,

      fontWeight: 700,

      color: '#5956F5',
    },

    section: {
      marginTop: 18,
    },

    sectionTitle: {
      marginBottom: 8,

      paddingLeft: 7,

      borderLeftWidth: 2.5,

      borderLeftColor:
        '#625BF6',

      fontSize: 6,

      fontWeight: 700,

      letterSpacing: 1,

      color: '#7B8399',
    },

    infoGrid: {
      flexDirection: 'row',

      gap: 8,
    },

    infoBox: {
      flex: 1,

      minHeight: 54,

      padding: 10,

      borderRadius: 9,

      borderWidth: 1,

      borderColor:
        '#E6E8F0',
    },

    infoLabel: {
      fontSize: 5.3,

      fontWeight: 700,

      letterSpacing: 0.8,

      color: '#9AA1B2',
    },

    infoValue: {
      marginTop: 6,

      fontSize: 7.5,

      fontWeight: 600,

      color: '#263149',
    },

    detailBox: {
      marginTop: 8,

      padding: 12,

      borderRadius: 9,

      borderWidth: 1,

      borderColor:
        '#E6E8F0',
    },

    detailLabel: {
      fontSize: 5.5,

      fontWeight: 700,

      letterSpacing: 0.8,

      color: '#625BF6',
    },

    detailValue: {
      marginTop: 6,

      fontSize: 7.4,

      lineHeight: 1.5,

      color: '#344054',
    },

    paymentBox: {
      marginTop: 18,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      padding: 13,

      borderRadius: 10,

      backgroundColor:
        '#F7F7FD',
    },

    paymentValue: {
      marginTop: 5,

      fontSize: 8,

      fontWeight: 700,

      color: '#625BF6',
    },

    footer: {
      marginTop: 'auto',

      paddingTop: 12,

      borderTopWidth: 1,

      borderTopColor:
        '#E6E8F0',

      flexDirection: 'row',

      justifyContent:
        'space-between',
    },

    footerText: {
      fontSize: 5.5,

      color: '#9AA1B2',
    },

    footerBrand: {
      fontSize: 5.5,

      fontWeight: 700,

      color: '#625BF6',
    },
  })


const formatDate = (
  value,
) => {
  if (!value) {
    return 'Belirtilmedi'
  }

  return new Intl.DateTimeFormat(
    'tr-TR',
    {
      timeZone:
        'Europe/Istanbul',

      day: '2-digit',

      month: 'long',

      year: 'numeric',
    },
  ).format(
    new Date(value),
  )
}


const formatAmount = (
  value,
) =>
  new Intl.NumberFormat(
    'tr-TR',
    {
      style: 'currency',

      currency: 'TRY',
    },
  ).format(
    Number(value || 0),
  )


const statusLabel = {
  PENDING: 'Ödeme Bekliyor',
  PAID: 'Ödendi',
  CANCELLED: 'İptal Edildi',
}


function PdfLogoMark() {
  return (
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
  )
}


export default function PatientInvoicePdf({
  invoice,
}) {
  return (
    <Document>
      <Page
        size="A4"
        style={
          styles.page
        }
        wrap={false}
      >
        <View
          style={
            styles.topLine
          }
        />


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
              <PdfLogoMark />
            </View>

            <View>
              <View
                style={{
                  flexDirection:
                    'row',

                  alignItems:
                    'center',
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
                      color:
                        '#5956F5',

                      marginLeft: 3,
                    },
                  ]}
                >
                  AI
                </Text>
              </View>

              <Text
                style={
                  styles.brandSub
                }
              >
                Akıllı Klinik Yönetimi
              </Text>
            </View>
          </View>


          <View
            style={
              styles.rightHeader
            }
          >
            <Text
              style={
                styles.eyebrow
              }
            >
              HASTA FATURA BELGESİ
            </Text>

            <Text
              style={
                styles.invoiceNumber
              }
            >
              {invoice.invoiceNumber}
            </Text>

            <Text
              style={
                styles.smallText
              }
            >
              {formatDate(
                invoice.issuedAt,
              )}
            </Text>
          </View>
        </View>


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
                  styles.eyebrow
                }
              >
                DİJİTAL FATURA DOSYASI
              </Text>

              <Text
                style={
                  styles.title
                }
              >
                Fatura Özeti
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
                {invoice.patient
                  ?.name ||
                  'Belirtilmedi'}
              </Text>
            </View>


            <View
              style={
                styles.amountBox
              }
            >
              <Text
                style={
                  styles.amountLabel
                }
              >
                TOPLAM TUTAR
              </Text>

              <Text
                style={
                  styles.amount
                }
              >
                {formatAmount(
                  invoice.amount,
                )}
              </Text>
            </View>
          </View>
        </View>


        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            FATURA BİLGİLERİ
          </Text>

          <View
            style={
              styles.infoGrid
            }
          >
            <View
              style={
                styles.infoBox
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                FATURA NO
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {invoice.invoiceNumber}
              </Text>
            </View>

            <View
              style={
                styles.infoBox
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                FATURA TARİHİ
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {formatDate(
                  invoice.issuedAt,
                )}
              </Text>
            </View>

            <View
              style={
                styles.infoBox
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                SON ÖDEME
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {formatDate(
                  invoice.dueDate,
                )}
              </Text>
            </View>
          </View>
        </View>


        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            KLİNİK VE RANDEVU
          </Text>

          <View
            style={
              styles.infoGrid
            }
          >
            <View
              style={
                styles.infoBox
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                KLİNİK
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {invoice.doctor
                  ?.clinicName ||
                  'Belirtilmedi'}
              </Text>
            </View>

            <View
              style={
                styles.infoBox
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                DOKTOR
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {invoice.doctor
                  ?.name ||
                  'Belirtilmedi'}
              </Text>
            </View>

            <View
              style={
                styles.infoBox
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                RANDEVU KODU
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {invoice.appointment
                  ?.appointmentCode ||
                  'Belirtilmedi'}
              </Text>
            </View>
          </View>
        </View>


        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            HİZMET DETAYI
          </Text>

          <View
            style={
              styles.detailBox
            }
          >
            <Text
              style={
                styles.detailLabel
              }
            >
              FATURA AÇIKLAMASI
            </Text>

            <Text
              style={
                styles.detailValue
              }
            >
              {invoice.description}
            </Text>
          </View>

          <View
            style={
              styles.detailBox
            }
          >
            <Text
              style={
                styles.detailLabel
              }
            >
              TEŞHİS
            </Text>

            <Text
              style={
                styles.detailValue
              }
            >
              {invoice.treatment
                ?.diagnosis ||
                'Belirtilmedi'}
            </Text>
          </View>

          <View
            style={
              styles.detailBox
            }
          >
            <Text
              style={
                styles.detailLabel
              }
            >
              TEDAVİ PLANI
            </Text>

            <Text
              style={
                styles.detailValue
              }
            >
              {invoice.treatment
                ?.treatmentPlan ||
                'Belirtilmedi'}
            </Text>
          </View>
        </View>


        <View
          style={
            styles.paymentBox
          }
        >
          <View>
            <Text
              style={
                styles.infoLabel
              }
            >
              ÖDEME DURUMU
            </Text>

            <Text
              style={
                styles.paymentValue
              }
            >
              {statusLabel[
                invoice.status
              ] ||
                invoice.status}
            </Text>
          </View>

          <View
            style={{
              alignItems:
                'flex-end',
            }}
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              TOPLAM
            </Text>

            <Text
              style={
                styles.paymentValue
              }
            >
              {formatAmount(
                invoice.amount,
              )}
            </Text>
          </View>
        </View>


        <View
          style={
            styles.footer
          }
        >
          <Text
            style={
              styles.footerText
            }
          >
            Bu belge DentFlow AI sistemi üzerinden oluşturulmuştur.
          </Text>

          <Text
            style={
              styles.footerBrand
            }
          >
            DentFlow AI · Akıllı Klinik Yönetimi
          </Text>
        </View>
      </Page>
    </Document>
  )
}