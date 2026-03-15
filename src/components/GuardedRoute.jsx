import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from './SessionProvider'

export default function GuardedRoute({ children }) {
  const { session } = useSession()
  const location = useLocation()
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
