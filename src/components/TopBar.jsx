import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSession } from './SessionProvider'

export default function TopBar() {
  const { session, signOut } = useSession()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5DED0]"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/list" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M12 2s-1 5-4 8-6 4-6 4 1-5 4-8 6-4 6-4z" fill="white" fillOpacity=".9"/>
              <path d="M2 13l4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-head font-bold text-[15px] text-body">empSight</span>
        </NavLink>

        <nav className="flex gap-1">
          {[{ to: '/list', label: 'Directory' }, { to: '/analytics', label: 'Insights' }].map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ` +
                (isActive ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'text-[#7A7A7A] hover:text-body hover:bg-[#F5F0E8]')
              }>{l.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs font-mono text-muted">{session?.username}</span>
          <button onClick={() => { signOut(); navigate('/login') }} className="btn-outline py-1.5 px-3 text-xs">
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
