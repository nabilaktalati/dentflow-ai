export const doctorsAvailability = [
  {
    id: 'elif',
    name: 'Uzm. Dr. Elif Kaya',
    specialty: 'Periodontoloji',
    status: 'available',
    next: '14:30',
    schedule: [
      { start: 0, span: 2, type: 'busy', label: 'Tedavi' },
      { start: 2, span: 1, type: 'available', label: 'Müsait' },
      { start: 3, span: 1, type: 'break', label: 'Ara' },
      { start: 4, span: 2, type: 'available', label: 'Müsait' },
      { start: 6, span: 1, type: 'recommended', label: '14:30' },
      { start: 7, span: 1, type: 'busy', label: 'Randevu' },
    ],
  },
  {
    id: 'kerem',
    name: 'Dr. Kerem Arslan',
    specialty: 'Endodonti',
    status: 'busy',
    next: '15:00',
    schedule: [
      { start: 0, span: 1, type: 'available', label: 'Müsait' },
      { start: 1, span: 2, type: 'busy', label: 'Tedavi' },
      { start: 3, span: 1, type: 'available', label: 'Müsait' },
      { start: 4, span: 1, type: 'break', label: 'Ara' },
      { start: 5, span: 1, type: 'busy', label: 'Kontrol' },
      { start: 6, span: 2, type: 'available', label: 'Müsait' },
    ],
  },
  {
    id: 'selin',
    name: 'Dr. Selin Demir',
    specialty: 'Protetik Diş Tedavisi',
    status: 'available',
    next: '13:00',
    schedule: [
      { start: 0, span: 2, type: 'available', label: 'Müsait' },
      { start: 2, span: 2, type: 'busy', label: 'Tedavi' },
      { start: 4, span: 1, type: 'available', label: 'Müsait' },
      { start: 5, span: 1, type: 'busy', label: 'Kontrol' },
      { start: 6, span: 2, type: 'available', label: 'Müsait' },
    ],
  },
]

export const timeline = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
]