import React, { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import StaffTable from '../components/StaffTable'
import { fetchStaff } from '../services/staffApi'

const COLUMNS = [
  { key: 'id',         label: 'ID',       render: v => <span className="font-mono text-xs text-muted bg-paper px-1.5 py-0.5 rounded">#{v}</span> },
  { key: 'name',       label: 'Name',     render: v => <span className="font-medium text-body text-sm">{v}</span> },
  { key: 'email',      label: 'Email',    render: v => <span className="text-xs font-mono text-soft">{v}</span> },
  { key: 'city',       label: 'Location', render: v => <CityPill city={v} /> },
  { key: 'salary',     label: 'Salary',   render: v => <span className="font-mono text-sm font-medium text-[#2D6A4F]">₹{Number(v).toLocaleString()}</span> },
  { key: 'department', label: 'Dept',     render: v => <span className="text-xs text-soft truncate">{v}</span> },
]

export default function StaffDirectory() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const rows = await fetchStaff()
        setStaff(Array.isArray(rows) ? rows : [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return staff
    return staff.filter(p =>
      [p.name, p.email, p.city, p.department].some(f => String(f ?? '').toLowerCase().includes(q))
    )
  }, [staff, query])

  return (
    <div className="min-h-screen bg-bg">
      <TopBar />
      <main className="fade max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <p className="text-xs font-mono text-[#2D6A4F] uppercase tracking-widest mb-1">empSight</p>
            <h1 className="font-head text-4xl font-bold text-body">Staff Directory</h1>
            {!loading && <p className="text-sm text-soft mt-1">{staff.length.toLocaleString()} employees</p>}
          </div>
          <div className="relative sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 9.5 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Filter by name, city, dept…" value={query}
              onChange={e => setQuery(e.target.value)} className="field pl-9 py-2.5 text-sm" />
          </div>
        </div>

        {loading && <Skeleton />}
        {!loading && error && <div className="card p-5 border-red-200 bg-red-50"><p className="text-red-700 text-sm font-mono">⚠ {error}</p></div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="card p-16 text-center"><p className="font-head text-xl text-soft">No results found</p></div>
        )}
        {!loading && !error && filtered.length > 0 && <StaffTable rows={filtered} columns={COLUMNS} />}
      </main>
    </div>
  )
}

function CityPill({ city }) {
  const map = { Chennai: 'bg-[#D8F3DC] text-[#2D6A4F]', Mumbai: 'bg-[#F0F9FF] text-[#0C4A6E]', Delhi: 'bg-[#FEF3C7] text-[#92400E]', Bangalore: 'bg-[#D8F3DC] text-[#2D6A4F]' }
  return <span className={`pill ${map[city] ?? 'bg-paper text-soft'}`}>{city ?? '—'}</span>
}

function Skeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-11 bg-paper" />
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex h-14 items-center gap-5 border-t border-border px-5">
          {[1, 2, 2, 1.5, 1.5, 2].map((w, j) => (
            <div key={j} className="h-3 rounded-full bg-paper" style={{ flex: w }} />
          ))}
        </div>
      ))}
    </div>
  )
}
