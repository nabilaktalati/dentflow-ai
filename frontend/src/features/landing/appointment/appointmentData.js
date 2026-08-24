export const bookingFlow = [
  {
    id: '01',
    label: 'Hizmet',
    value: 'Diş Temizliği',
  },
  {
    id: '02',
    label: 'Doktor',
    value: 'Uzm. Dr. Elif Kaya',
  },
  {
    id: '03',
    label: 'Tarih',
    value: '24 Ağustos',
  },
  {
    id: '04',
    label: 'Saat',
    value: '14:30',
  },
  {
    id: '05',
    label: 'Onay',
    value: 'Hazır',
  },
]

export const timeSlots = [
  {
    time: '09:30',
    status: 'available',
    result: 'Uygun',
    note: 'Sabah müsaitliği',
  },
  {
    time: '10:15',
    status: 'busy',
    result: 'Dolu',
    note: 'Mevcut randevu',
  },
  {
    time: '11:00',
    status: 'available',
    result: 'Uygun',
    note: 'Takvime uygun',
  },
  {
    time: '13:45',
    status: 'busy',
    result: 'Dolu',
    note: 'Mevcut randevu',
  },
  {
    time: '14:30',
    status: 'recommended',
    result: 'En uygun',
    note: 'Önerilen zaman',
  },
  {
    time: '15:15',
    status: 'available',
    result: 'Uygun',
    note: 'Takvime uygun',
  },
]

export const bookingChecks = [
  'Doktor bu saatte müsait',
  'Tedavi süresi takvime uyuyor',
  'Çakışan başka randevu yok',
]