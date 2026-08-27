import {
  createContext,
  useContext,
} from 'react'

export const AuthContext =
  createContext(null)

export const useAuth = () => {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth, AuthProvider içinde kullanılmalıdır.',
    )
  }

  return context
}