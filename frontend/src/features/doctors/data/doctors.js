import elifKaya from '../../../assets/Doctors/elif.png'
import mertAydin from '../../../assets/Doctors/mert.png'
import selinAras from '../../../assets/Doctors/selin.png'
import canDemir from '../../../assets/Doctors/can.png'

const doctors = [
  {
    id: 1,
    name: 'Dr. Elif Kaya',
    initials: 'EK',
    role: 'Diş Hekimi',
    image: elifKaya,
    education: 'İstanbul Üniversitesi Diş Hekimliği Fakültesi',
    experience: '7 Yıl',
    clinic: 'DentFlow Dental Clinic',
    location: 'İstanbul, Türkiye',
    description:
      'Hasta odaklı yaklaşımıyla ağız ve diş sağlığı kontrolleri, muayene ve tedavi süreçlerinde hizmet vermektedir.',
  },
  {
    id: 2,
    name: 'Dr. Mert Aydın',
    initials: 'MA',
    role: 'Diş Hekimi',
    image: mertAydin,
    education: 'Marmara Üniversitesi Diş Hekimliği Fakültesi',
    experience: '5 Yıl',
    clinic: 'DentFlow Dental Clinic',
    location: 'İstanbul, Türkiye',
    description:
      'Muayene, koruyucu bakım ve genel diş tedavi süreçlerinde hasta odaklı bir yaklaşım benimsemektedir.',
  },
  {
    id: 3,
    name: 'Dr. Selin Aras',
    initials: 'SA',
    role: 'Diş Hekimi',
    image: selinAras,
    education: 'Ege Üniversitesi Diş Hekimliği Fakültesi',
    experience: '6 Yıl',
    clinic: 'DentFlow Dental Clinic',
    location: 'İstanbul, Türkiye',
    description:
      'Hastaların ağız ve diş sağlığı süreçlerini düzenli takip ederek tedavi planlamasına destek olmaktadır.',
  },
  {
    id: 4,
    name: 'Dr. Can Demir',
    initials: 'CD',
    role: 'Diş Hekimi',
    image: canDemir,
    education: 'Ankara Üniversitesi Diş Hekimliği Fakültesi',
    experience: '8 Yıl',
    clinic: 'DentFlow Dental Clinic',
    location: 'İstanbul, Türkiye',
    description:
      'Genel diş hekimliği uygulamaları ve koruyucu ağız sağlığı süreçlerinde hizmet vermektedir.',
  },
]

export default doctors