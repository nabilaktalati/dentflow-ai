export const patientFlow = [
  {
    id: '01',
    label: 'Randevu',
    description: 'Akıllı planlama',
    detail:
      'Doktor müsaitliği ve tedavi süresi kontrol edilerek uygun zaman otomatik olarak belirlenir.',
    status: 'Canlı müsaitlik',
    signal: '14:30 · Onaylandı',
  },
  {
    id: '02',
    label: 'Ziyaret',
    description: 'Hasta karşılama',
    detail:
      'Hasta kliniğe geldiğinde randevu durumu güncellenir ve ziyaret süreci tek akıştan yönetilir.',
    status: 'Hasta kabulü',
    signal: 'Hasta geldi',
  },
  {
    id: '03',
    label: 'Tedavi',
    description: 'Klinik süreç',
    detail:
      'Doktor, hastanın ziyaret geçmişine ve ilgili tedavi bilgilerine güvenli şekilde erişebilir.',
    status: 'Klinik kayıt',
    signal: 'Kayıt güncellendi',
  },
  {
    id: '04',
    label: 'Fatura',
    description: 'Otomatik finans',
    detail:
      'Tamamlanan hizmetler faturalandırma sürecine aktarılır ve ödeme durumu sistem üzerinden takip edilir.',
    status: 'Fatura akışı',
    signal: '₺2.450 · Ödendi',
  },
  {
    id: '05',
    label: 'Takip',
    description: 'Hatırlatma & iletişim',
    detail:
      'Randevu sonrası takip, bildirim ve otomasyon süreçleri hastanın durumuna göre devam eder.',
    status: 'Otomatik takip',
    signal: 'Hatırlatma gönderildi',
  },
]