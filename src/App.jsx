import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SessionProvider } from './components/SessionProvider'
import GuardedRoute from './components/GuardedRoute'
import SignIn from './pages/SignIn'
import StaffDirectory from './pages/StaffDirectory'
import StaffProfile from './pages/StaffProfile'
import Insights from './pages/Insights'

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"       element={<SignIn />} />
          <Route path="/list"        element={<GuardedRoute><StaffDirectory /></GuardedRoute>} />
          <Route path="/details/:id" element={<GuardedRoute><StaffProfile /></GuardedRoute>} />
          <Route path="/analytics"   element={<GuardedRoute><Insights /></GuardedRoute>} />
          <Route path="*"            element={<Navigate to="/list" replace />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}
