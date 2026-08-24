export const intelligenceActions = [
  {
    id: 'appointment',
    label: 'Randevu Onayı',
    shortLabel: 'Randevu',
    eyebrow: 'Otomasyon',
    result: 'Hasta bilgilendirildi',
    detail:
      'Yeni randevu doğrulandıktan sonra onay bilgisi otomatik olarak hastaya iletilir.',
    telemetry: [
      'Randevu doğrulandı',
      'Hasta bilgisi eşleşti',
      'Onay akışı tamamlandı',
    ],
  },
  {
    id: 'reminder',
    label: 'Akıllı Hatırlatma',
    shortLabel: 'Hatırlatma',
    eyebrow: 'n8n Akışı',
    result: 'Mesaj planlandı',
    detail:
      'Yaklaşan randevular kontrol edilir ve uygun zamanda otomatik hatırlatma süreci başlatılır.',
    telemetry: [
      'Randevu zamanı kontrol edildi',
      'İletişim bilgisi doğrulandı',
      'Hatırlatma planlandı',
    ],
  },
  {
    id: 'invoice',
    label: 'Fatura Otomasyonu',
    shortLabel: 'Fatura',
    eyebrow: 'Finans',
    result: 'Fatura akışı hazır',
    detail:
      'Tamamlanan hizmet bilgileri faturalandırma sürecine aktarılır ve ödeme durumu takip edilir.',
    telemetry: [
      'Hizmet tamamlandı',
      'Fatura verisi oluşturuldu',
      'Ödeme takibi başlatıldı',
    ],
  },
  {
    id: 'followup',
    label: 'Hasta Takibi',
    shortLabel: 'Takip',
    eyebrow: 'Otomasyon',
    result: 'Takip planlandı',
    detail:
      'Ziyaret sonrasında gerekli bilgilendirme ve takip işlemleri hasta akışına göre planlanır.',
    telemetry: [
      'Ziyaret tamamlandı',
      'Takip kuralı bulundu',
      'İletişim planlandı',
    ],
  },
  {
    id: 'analysis',
    label: 'Yoğunluk Analizi',
    shortLabel: 'Analiz',
    eyebrow: 'DentFlow Intelligence',
    result: 'Öneri hazırlandı',
    detail:
      'Klinik takvimi analiz edilerek yoğun saatler ve potansiyel planlama sorunları yöneticiye sunulur.',
    telemetry: [
      '12 randevu analiz edildi',
      '2 yoğun zaman aralığı bulundu',
      'Yönetici önerisi oluşturuldu',
    ],
  },
]