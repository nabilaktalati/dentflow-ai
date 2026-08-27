import {
  Navigate,
} from 'react-router'

import {
  useAuth,
} from '../context/authContext.js'


export default function RoleRoute({
  allowedRoles,
  children,
}) {
  const {
    user,
  } = useAuth()

  if (
    !user ||
    !allowedRoles.includes(
      user.role,
    )
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return children
}