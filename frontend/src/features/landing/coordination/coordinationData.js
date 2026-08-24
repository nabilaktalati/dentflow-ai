export const patientCase = {
  name: 'Merve Yılmaz',
  age: '34 yaş',
  appointment: '24 Ağustos · 14:30',
  service: 'Diş Temizliği',
  doctor: 'Uzm. Dr. Elif Kaya',
}

export const handoffSteps = [
  {
    id: '01',
    role: 'Resepsiyon',
    title: 'Hasta karşılandı',
    status: 'Giriş tamamlandı',
    detail:
      'Randevu doğrulandı ve hastanın kliniğe geliş durumu sistem üzerinden güncellendi.',
    time: '14:22',
  },
  {
    id: '02',
    role: 'Doktor',
    title: 'Muayene başladı',
    status: 'Doktora aktarıldı',
    detail:
      'Hasta bilgileri ve randevu geçmişi doktora güvenli şekilde aktarıldı.',
    time: '14:31',
  },
  {
    id: '03',
    role: 'Tedavi',
    title: 'Klinik kayıt açıldı',
    status: 'Tedavi süreci aktif',
    detail:
      'Uygulanan hizmetler ve ziyaret bilgileri aynı hasta kaydı altında güncelleniyor.',
    time: '14:38',
  },
  {
    id: '04',
    role: 'Yönetim',
    title: 'Finans süreci hazır',
    status: 'Fatura oluşturuluyor',
    detail:
      'Tamamlanan hizmetler otomatik olarak faturalandırma sürecine aktarılıyor.',
    time: '15:04',
  },
  {
    id: '05',
    role: 'Otomasyon',
    title: 'Takip planlandı',
    status: 'Hatırlatma hazır',
    detail:
      'Ziyaret sonrası bilgilendirme ve takip mesajları otomasyon sistemine aktarılıyor.',
    time: '15:06',
  },
]