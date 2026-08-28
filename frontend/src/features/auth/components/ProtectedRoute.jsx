import {
  Navigate,
  useLocation,
} from 'react-router'

import {
  useAuth,
} from '../context/authContext.js'


export default function ProtectedRoute({
  children,
}) {
  const location =
    useLocation()

const {
  user,
  isAuthenticated,
  isAuthLoading,
} = useAuth()

  /*
   * أثناء فحص /me أو /refresh
   * لا نحكم بسرعة أن المستخدم خارج.
   */
  if (isAuthLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#f7f8fc]">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#5B52F2]" />

          <p className="mt-4 text-sm text-slate-500">
            Oturum kontrol ediliyor...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }
if (
  user?.mustChangePassword &&
  location.pathname !==
    '/change-password'
) {
  return (
    <Navigate
      to="/change-password"
      replace
    />
  )
}
  return children
}