import React, { useEffect, useMemo, useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import { fetchStaff } from '../services/staffApi'

const AUDIT_KEY = 'es_audit_img'

const CITY_COORDS = {
  Chennai: [13.0827, 80.2707], Mumbai: [19.076, 72.8777], Delhi: [28.7041, 77.1025],
  Bangalore: [12.9716, 77.5946], Hyderabad: [17.385, 78.4867], Kolkata: [22.5726, 88.3639],
  Pune: [18.5204, 73.8567], Ahmedabad: [23.0225, 72.5714], Jaipur: [26.9124, 75.7873],
  Surat: [21.1702, 72.8311],
}

export default function Insights() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [auditImg] = useState(() => localStorage.getItem(AUDIT_KEY) || '')
  const mapRef = useRef(null)
  const mapInst = useRef(null)

  useEffect(() => {
    fetchStaff().then(setStaff).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    if (!staff.length) return null
    const salaries = staff.map(p => Number(p.salary || 0)).filter(Boolean)
    const avg = salaries.length ? Math.round(salaries.reduce((s, v) => s + v, 0) / salaries.length) : 0
    const cityMap = {}
    staff.forEach(p => {
      const c = p.city || 'Unknown'
      if (!cityMap[c]) cityMap[c] = { total: 0, count: 0 }
      cityMap[c].total += Number(p.salary || 0)
      cityMap[c].count++
    })
    const cityStats = Object.entries(cityMap)
      .map(([city, d]) => ({ city, avg: Math.round(d.total / d.count), count: d.count }))
      .sort((a, b) => b.avg - a.avg)
    return { total: staff.length, avg, cities: [...new Set(staff.map(p => p.city))].length, topCity: cityStats[0]?.city || '—', cityStats }
  }, [staff])

  useEffect(() => {
    if (!stats || !mapRef.current || mapInst.current) return
    let cancelled = false
    import('leaflet').then(mod => {
      if (cancelled || mapInst.current) return
      const L = mod.default
      const map = L.map(mapRef.current, { center: [20.5937, 78.9629], zoom: 5 })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;border-radius:50%;background:#2D6A4F;border:3px solid #fff;box-shadow:0 2px 6px rgba(45,106,79,.4)"></div>`,
        iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -12],
      })
      stats.cityStats.forEach(({ city, avg, count }) => {
        const coords = CITY_COORDS[city]
        if (!coords) return
        L.marker(coords, { icon }).addTo(map).bindPopup(
          `<div style="font-family:Inter,sans-serif;padding:2px"><strong>${city}</strong><br/><span style="color:#2D6A4F;font-family:monospace;font-size:11px">₹${avg.toLocaleString()} avg</span><br/><span style="color:#7A7A7A;font-size:11px">${count} employees</span></div>`
        )
      })
      mapInst.current = map
    })
    return () => { cancelled = true; if (mapInst.current) { mapInst.current.remove(); mapInst.current = null } }
  }, [stats])

  return (
    <div className="min-h-screen bg-bg">
      <TopBar />
      <main className="fade max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-mono text-[#2D6A4F] uppercase tracking-widest mb-1">Overview</p>
          <h1 className="font-head text-4xl font-bold text-body">Insights</h1>
        </div>

        {loading && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">{Array.from({length:4}).map((_,i)=><div key={i} className="h-24 rounded-2xl bg-paper border border-border"/>)}</div>}
        {!loading && error && <div className="card p-5 border-red-200 bg-red-50"><p className="text-red-700 text-sm font-mono">⚠ {error}</p></div>}

        {!loading && !error && stats && <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Staff',    value: stats.total.toLocaleString(), bg: '#D8F3DC', accent: '#2D6A4F' },
              { label: 'Cities',         value: stats.cities,                 bg: '#F0F9FF', accent: '#0C4A6E' },
              { label: 'Avg Salary',     value: `₹${stats.avg.toLocaleString()}`, bg: '#FEF3C7', accent: '#92400E' },
              { label: 'Top City',       value: stats.topCity,                bg: '#D8F3DC', accent: '#2D6A4F' },
            ].map(k => (
              <div key={k.label} className="rounded-2xl p-5 border" style={{ background: k.bg, borderColor: k.accent + '40' }}>
                <p className="font-head text-2xl font-bold text-body">{k.value}</p>
                <p className="text-xs font-mono uppercase tracking-widest mt-1.5" style={{ color: k.accent }}>{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-head font-semibold text-body">Latest Audit Image</h2>
                <p className="text-xs font-mono text-soft mt-0.5">Photo + signature merge</p>
              </div>
              <div className="p-4">
                {auditImg
                  ? <img src={auditImg} alt="Audit" className="w-full max-h-72 rounded-xl border border-border object-contain" />
                  : <div className="h-64 flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-paper text-center">
                      <div><p className="font-head text-lg text-soft">No audit image yet</p><p className="text-sm text-muted mt-1">Capture a photo from a staff profile</p></div>
                    </div>
                }
              </div>
            </div>

            <SalaryChart data={stats.cityStats} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <CountChart data={stats.cityStats} />
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-head font-semibold text-body">City Map</h2>
                <p className="text-xs font-mono text-soft mt-0.5">Hardcoded lat/lng per city</p>
              </div>
              <div ref={mapRef} style={{ height: 360 }} />
            </div>
          </div>
        </>}
      </main>
    </div>
  )
}

function SalaryChart({ data }) {
  const top = data.slice(0, 8)
  const max = Math.max(...top.map(d => d.avg))
  const W = 520, H = 280, pad = { t: 20, r: 16, b: 64, l: 68 }
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b
  const bW = Math.floor(cW / top.length) - 6
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((max / 4) * i))

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-head font-semibold text-body">Avg Salary by City</h2>
        <p className="text-xs font-mono text-soft mt-0.5">Raw SVG — no Chart.js or D3</p>
      </div>
      <div className="p-4 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 300 }}>
          {ticks.map((v, i) => {
            const y = pad.t + cH - (v / max) * cH
            return <g key={i}>
              <line x1={pad.l} y1={y} x2={pad.l + cW} y2={y} stroke="#E5DED0" strokeWidth="1" strokeDasharray="4 3" />
              <text x={pad.l - 6} y={y + 4} textAnchor="end" fill="#B0A898" fontSize="10" fontFamily="Fira Code, monospace">{v >= 1000 ? `${Math.round(v/1000)}k` : v}</text>
            </g>
          })}
          {top.map((d, i) => {
            const bH = Math.max(2, (d.avg / max) * cH)
            const x = pad.l + i * (cW / top.length) + 3
            const y = pad.t + cH - bH
            return <g key={d.city}>
              <rect x={x} y={y} width={bW} height={bH} rx="4" fill={`rgba(45,106,79,${0.4 + 0.6 * (d.avg / max)})`} />
              <text x={x + bW/2} y={y - 5} textAnchor="middle" fill="#2D6A4F" fontSize="9" fontFamily="Fira Code, monospace">{d.avg >= 1000 ? `${Math.round(d.avg/1000)}k` : d.avg}</text>
              <text x={x + bW/2} y={pad.t + cH + 16} textAnchor="middle" fill="#7A7A7A" fontSize="9" transform={`rotate(-35,${x+bW/2},${pad.t+cH+16})`}>{d.city}</text>
            </g>
          })}
          <line x1={pad.l} y1={pad.t + cH} x2={pad.l + cW} y2={pad.t + cH} stroke="#C4B9A8" strokeWidth="1.5" />
          <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + cH} stroke="#C4B9A8" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}

function CountChart({ data }) {
  const top = data.slice(0, 6)
  const max = Math.max(...top.map(d => d.count))
  const bH = 28, gap = 10, lP = 82, rP = 16, W = 480
  const gW = W - lP - rP
  const H = top.length * (bH + gap) + 16

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-head font-semibold text-body">Headcount by City</h2>
        <p className="text-xs font-mono text-soft mt-0.5">Raw SVG — no Chart.js or D3</p>
      </div>
      <div className="p-4 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H + 16}`} width="100%" style={{ minWidth: 280 }}>
          {top.map((d, i) => {
            const y = 8 + i * (bH + gap)
            const cW2 = Math.max(4, (d.count / max) * gW)
            return <g key={d.city}>
              <text x={lP - 8} y={y + bH/2 + 4} textAnchor="end" fill="#4A4A4A" fontSize="11">{d.city}</text>
              <rect x={lP} y={y} width={gW} height={bH} rx="6" fill="#F5F0E8" />
              <rect x={lP} y={y} width={cW2} height={bH} rx="6" fill={`rgba(82,183,136,${0.35 + 0.65*(d.count/max)})`} />
              <text x={lP + cW2 + 6} y={y + bH/2 + 4} fill="#52B788" fontSize="11" fontFamily="Fira Code, monospace">{d.count}</text>
            </g>
          })}
        </svg>
      </div>
    </div>
  )
}
