import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AuthContext,
} from './authContext.js'
import {
  changePasswordUser,
  getCurrentUser,
  logoutUser,
  refreshUserSession,
} from '../api/authApi.js'




/*
 * React StrictMode geliştirme ortamında
 * effect'leri birden fazla kez çalıştırabilir.
 *
 * Aynı anda iki refresh isteği gönderip
 * token rotation'ı bozmamak için
 * başlangıç isteğini paylaşıyoruz.
 */
let restoreSessionPromise = null


const restoreSessionFromServer =
  () => {
    if (restoreSessionPromise) {
      return restoreSessionPromise
    }

    restoreSessionPromise =
      (async () => {
        try {
          /*
           * Önce mevcut Access Token ile
           * kullanıcıyı almaya çalış.
           */
          const response =
            await getCurrentUser()

          return (
            response.data?.user ||
            null
          )
        } catch (error) {
          /*
           * 401 değilse refresh denemiyoruz.
           *
           * Örneğin hesap engelliyse
           * gereksiz token yenilemesi yapılmaz.
           */
          if (
            error?.status !== 401
          ) {
            return null
          }
        }

        try {
          /*
           * Access Token bitmiş olabilir.
           * Refresh Token ile oturumu yenile.
           */
          const response =
            await refreshUserSession()

          return (
            response.data?.user ||
            null
          )
        } catch {
          /*
           * Refresh de başarısızsa
           * aktif oturum yoktur.
           */
          return null
        }
      })().finally(() => {
        restoreSessionPromise =
          null
      })

    return restoreSessionPromise
  }


export const AuthProvider = ({
  children,
}) => {
  const [
    user,
    setUser,
  ] = useState(null)

  const [
    isAuthLoading,
    setIsAuthLoading,
  ] = useState(true)


  /*
   * Site ilk açıldığında
   * mevcut oturumu geri yükle.
   */
  useEffect(() => {
    let isMounted = true

    const bootstrapAuth =
      async () => {
        try {
          const restoredUser =
            await restoreSessionFromServer()

          if (isMounted) {
            setUser(
              restoredUser,
            )
          }
        } finally {
          if (isMounted) {
            setIsAuthLoading(false)
          }
        }
      }

    bootstrapAuth()

    return () => {
      isMounted = false
    }
  }, [])


  /*
   * Login başarılı olduğunda
   * kullanıcıyı React state'e yazacağız.
   */
  const completeLogin =
    useCallback(
      (authenticatedUser) => {
        setUser(
          authenticatedUser,
        )
      },
      [],
    )


  /*
   * İstenildiğinde Backend ile
   * kullanıcı durumunu tekrar eşitle.
   */
  const syncUser =
    useCallback(async () => {
      setIsAuthLoading(true)

      try {
        const restoredUser =
          await restoreSessionFromServer()

        setUser(
          restoredUser,
        )

        return restoredUser
      } finally {
        setIsAuthLoading(false)
      }
    }, [])

/*
 * Kullanıcı şifresini değiştirir.
 * Backend yeni kullanıcı durumunu döndürür
 * ve React state güncellenir.
 */
const changePassword =
  useCallback(
    async (payload) => {
      const response =
        await changePasswordUser(
          payload,
        )

      const updatedUser =
        response.data?.user ||
        null

      setUser(updatedUser)

      return updatedUser
    },
    [],
  )
  /*
   * Gerçek Logout:
   * Backend Session iptal edilir
   * ve React state temizlenir.
   */
  const logout =
    useCallback(async () => {
      try {
        await logoutUser()
      } finally {
        setUser(null)
      }
    }, [])


  const value =
  useMemo(
    () => ({
      user,

      isAuthenticated:
        Boolean(user),

      isAuthLoading,

      completeLogin,

      syncUser,

      changePassword,

      logout,
    }),
      [
  user,
  isAuthLoading,
  completeLogin,
  syncUser,
  changePassword,
  logout,
],
    )


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}


