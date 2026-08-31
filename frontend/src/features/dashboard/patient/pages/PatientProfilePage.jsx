import {
  useEffect,
  useState,
} from 'react'

import {
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import {
  motion,
} from 'motion/react'

import {
  getMyPatientProfile,
  updateMyPatientProfile,
} from '../api/patientProfileApi.js'


export default function PatientProfilePage() {
  const [
    profile,
    setProfile,
  ] = useState(null)

  const [
    address,
    setAddress,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')


  useEffect(() => {
    getMyPatientProfile()
      .then((data) => {
        setProfile(data)

        setAddress(
          data?.address || '',
        )
      })
      .catch(
        (requestError) => {
          setError(
            requestError.message ||
              'Profil bilgileri yüklenemedi.',
          )
        },
      )
      .finally(() => {
        setLoading(false)
      })
  }, [])


  const handleSubmit =
    async (event) => {
      event.preventDefault()

      const normalizedAddress =
        address.trim()

      if (
        normalizedAddress.length <
        5
      ) {
        setError(
          'Lütfen geçerli bir adres girin.',
        )

        return
      }


      try {
        setSaving(true)
        setError('')
        setSuccess('')

        const updatedProfile =
          await updateMyPatientProfile({
            address:
              normalizedAddress,
          })

        setProfile((current) => ({
          ...current,
          ...updatedProfile,
        }))

        setAddress(
          updatedProfile?.address ||
            normalizedAddress,
        )

        setSuccess(
          'Profil bilgileriniz başarıyla güncellendi.',
        )
      } catch (
        requestError
      ) {
        setError(
          requestError.message ||
            'Profil bilgileri güncellenemedi.',
        )
      } finally {
        setSaving(false)
      }
    }


  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 lg:px-8">
        <div className="rounded-[24px] border border-[#E6E7F0] bg-white p-7 text-sm text-[#7B8399] shadow-sm">
          Profil bilgileri yükleniyor...
        </div>
      </div>
    )
  }


  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#625BF6]">
          Hasta Paneli
        </p>

        <h1 className="mt-2 text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#101828] sm:text-[42px]">
          Profilim
        </h1>

        <p className="mt-3 max-w-[680px] text-[14px] leading-6 text-[#6F7A8E]">
          Hesap bilgilerinizi görüntüleyin ve ödeme işlemlerinde kullanılacak adresinizi yönetin.
        </p>
      </motion.div>


      <div className="mt-7 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.05,
          }}
          className="overflow-hidden rounded-[26px] border border-[#E5E6EF] bg-white shadow-[0_16px_45px_rgba(36,38,80,0.05)]"
        >
          <div className="h-[3px] bg-gradient-to-r from-[#615FFF] via-[#7770FF] to-[#54B8FF]" />

          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-[18px] bg-[#F1F0FF] text-[#615FFF]">
                <UserRound
                  size={23}
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8D94A7]">
                  Hasta Profili
                </p>

                <h2 className="mt-1 text-[20px] font-bold text-[#202235]">
                  {profile?.fullName ||
                    `${profile?.firstName || ''} ${profile?.lastName || ''}`}
                </h2>
              </div>
            </div>


            <div className="mt-6 space-y-3">
              <ProfileRow
                icon={Mail}
                label="E-posta"
                value={
                  profile?.email ||
                  'Belirtilmedi'
                }
              />

              <ProfileRow
                icon={Phone}
                label="Telefon"
                value={
                  profile?.phone ||
                  'Belirtilmedi'
                }
              />

              <ProfileRow
                icon={ShieldCheck}
                label="Hesap Durumu"
                value={
                  profile?.accountStatus ===
                  'ACTIVE'
                    ? 'Aktif'
                    : profile?.accountStatus ||
                      'Belirtilmedi'
                }
              />

              <ProfileRow
                icon={CheckCircle2}
                label="E-posta Doğrulama"
                value={
                  profile?.isEmailVerified
                    ? 'Doğrulandı'
                    : 'Doğrulanmadı'
                }
              />
            </div>
          </div>
        </motion.section>


        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.1,
          }}
          className="overflow-hidden rounded-[26px] border border-[#E5E6EF] bg-white shadow-[0_16px_45px_rgba(36,38,80,0.05)]"
        >
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-[15px] bg-[#F3F2FF] text-[#615FFF]">
                <MapPin
                  size={19}
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#817CF4]">
                  Profil Bilgisi
                </p>

                <h2 className="mt-1 text-[18px] font-bold text-[#202235]">
                  Fatura Adresi
                </h2>
              </div>
            </div>


            <form
              onSubmit={
                handleSubmit
              }
              className="mt-6"
            >
              <label
                htmlFor="patient-address"
                className="text-[11px] font-bold text-[#44495D]"
              >
                Adres
              </label>

              <div className="relative mt-2.5">
                <MapPin
                  size={17}
                  className="absolute left-4 top-4 text-[#716CF1]"
                />

                <textarea
                  id="patient-address"
                  value={
                    address
                  }
                  onChange={(
                    event,
                  ) => {
                    setAddress(
                      event.target.value,
                    )

                    if (error) {
                      setError('')
                    }

                    if (success) {
                      setSuccess('')
                    }
                  }}
                  disabled={
                    saving
                  }
                  rows={5}
                  maxLength={400}
                  placeholder="Mahalle, cadde, bina no, ilçe ve şehir"
                  className="w-full resize-none rounded-[17px] border border-[#DFE1EA] bg-[#FAFAFD] py-3.5 pl-11 pr-4 text-[13px] leading-6 text-[#34384D] outline-none transition placeholder:text-[#A8ADBC] focus:border-[#8580F5] focus:bg-white focus:ring-4 focus:ring-[#615FFF]/10 disabled:opacity-60"
                />
              </div>

              <p className="mt-2 text-[10px] leading-5 text-[#9298AA]">
                Bu adres ödeme işlemlerinde güvenli ödeme sağlayıcısına iletilir.
              </p>


              {error && (
                <div className="mt-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] font-medium text-rose-700">
                  {error}
                </div>
              )}


              {success && (
                <div className="mt-4 flex items-center gap-2 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] font-medium text-emerald-700">
                  <CheckCircle2
                    size={15}
                  />

                  {success}
                </div>
              )}


              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#5F5BEA] px-6 text-[12px] font-bold text-white shadow-[0_10px_24px_rgba(95,91,234,0.22)] transition hover:bg-[#5551DE] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save
                    size={16}
                  />

                  {saving
                    ? 'Kaydediliyor...'
                    : 'Adresi Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </motion.section>
      </div>
    </div>
  )
}


function ProfileRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3 rounded-[15px] border border-[#ECECF3] bg-[#FAFAFD] px-4 py-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-white text-[#6964EC] shadow-sm">
        <Icon
          size={16}
        />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9AA0B2]">
          {label}
        </p>

        <p className="mt-1 truncate text-[12px] font-semibold text-[#4B5268]">
          {value}
        </p>
      </div>
    </div>
  )
}