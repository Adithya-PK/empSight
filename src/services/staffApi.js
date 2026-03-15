const BASE = 'https://backend.jotish.in/backend_dev'

function extractRows(r) {
  if (Array.isArray(r)) return r
  if (Array.isArray(r?.TABLE_DATA?.data)) return r.TABLE_DATA.data
  for (const k of ['data', 'employees', 'result', 'records']) if (Array.isArray(r?.[k])) return r[k]
  if (r && typeof r === 'object') {
    for (const v of Object.values(r)) {
      if (Array.isArray(v)) return v
      if (v && typeof v === 'object') for (const n of Object.values(v)) if (Array.isArray(n)) return n
    }
  }
  return []
}

function normalize(raw, i) {
  if (Array.isArray(raw)) {
    return {
      id:         i + 1,
      name:       raw[0] || 'Unknown',
      department: raw[1] || 'General',
      city:       raw[2] || 'Unknown',
      email:      `${String(raw[0] || '').toLowerCase().replace(/\s+/g, '.')}@company.com`,
      salary:     Number(String(raw[5] || '0').replace(/[^0-9]/g, '')) || 0,
      raw,
    }
  }
  return {
    id:         raw.id || raw.ID || i + 1,
    name:       raw.name || raw.Name || 'Unknown',
    email:      raw.email || raw.Email || '—',
    city:       raw.city || raw.City || 'Unknown',
    salary:     Number(raw.salary || raw.Salary || 0) || 0,
    department: raw.department || raw.Department || 'General',
    raw,
  }
}

export async function fetchStaff() {
  const res = await fetch(`${BASE}/gettabledata.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test', password: '123456' }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const text = await res.text()
  let parsed
  try { parsed = JSON.parse(text) } catch { throw new Error('Invalid JSON') }
  return extractRows(parsed).map(normalize)
}