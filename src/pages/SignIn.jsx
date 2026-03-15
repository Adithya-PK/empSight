import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSession } from '../components/SessionProvider'

export default function SignIn() {
  const { signIn, error, setError } = useSession()
  const navigate = useNavigate()
  const from = useLocation().state?.from?.pathname ?? '/list'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    const ok = signIn(username.trim(), password)
    setBusy(false)
    if (ok) navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex bg-paper">
      <div className="hidden lg:flex w-96 shrink-0 bg-[#2D6A4F] flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M12 2s-1 5-4 8-6 4-6 4 1-5 4-8 6-4 6-4z" fill="white" fillOpacity=".9"/>
              <path d="M2 13l4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-head font-bold text-white text-base">empSight</span>
        </div>
        <div>
          <p className="text-white/70 text-lg leading-relaxed font-sans mb-6">
            "Know your team.<br/>Understand your organisation."
          </p>
          <div className="flex gap-2">
            {['Directory', 'Analytics', 'Audit'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-mono">{t}</span>
            ))}
          </div>
        </div>
        <p className="text-white/25 text-xs font-mono">empSight · Employee Intelligence</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm fade">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M12 2s-1 5-4 8-6 4-6 4 1-5 4-8 6-4 6-4z" fill="white" fillOpacity=".9"/>
                <path d="M2 13l4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-head font-bold text-body text-base">empSight</span>
          </div>

          <h1 className="font-head text-3xl font-bold text-body mb-1">Welcome back</h1>
          <p className="text-soft text-sm mb-8">Sign in to your workspace</p>

          <div className="card p-7">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-soft mb-1.5 uppercase tracking-wider">Username</label>
                <input type="text" value={username} onChange={e => { setUsername(e.target.value); setError('') }}
                  placeholder="testuser" className="field" autoComplete="username" required />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-soft mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••" className="field pr-11" autoComplete="current-password" required />
                  <button type="button" onClick={() => setShow(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors" tabIndex={-1}>
                    {show
                      ? <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 2l12 12M6.5 5.5A3.5 3.5 0 0 1 8 5c3 0 5 3 5 3a9 9 0 0 1-1.5 1.8M4.2 9.8A9 9 0 0 1 3 8s2-3 5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      : <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><ellipse cx="8" cy="8" rx="6" ry="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.5" stroke="#dc2626" strokeWidth="1.5"/><path d="M7 4.5v3" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="9.5" r=".75" fill="#dc2626"/></svg>
                  <span className="text-red-700 text-xs">{error}</span>
                </div>
              )}

              <button type="submit" disabled={busy}
                className="btn-primary w-full mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
                {busy ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>
            <p className="text-center text-xs text-muted mt-5 font-mono">demo · testuser / Test123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
