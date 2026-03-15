import React, { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)

export function SessionProvider({ children }) {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('es_session')) } catch { return null }
  })
  const [error, setError] = useState('')

  useEffect(() => {
    session
      ? localStorage.setItem('es_session', JSON.stringify(session))
      : localStorage.removeItem('es_session')
  }, [session])

  function signIn(username, password) {
    setError('')
    if (username === 'testuser' && password === 'Test123') {
      setSession({ username, at: Date.now() })
      return true
    }
    setError('Incorrect username or password')
    return false
  }

  return (
    <Ctx.Provider value={{ session, error, setError, signIn, signOut: () => setSession(null) }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSession() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSession outside provider')
  return ctx
}
