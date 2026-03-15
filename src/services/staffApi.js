const BASE = 'https://backend.jotish.in/backend_dev'

function pick(obj, keys, fb = '') {
  for (const k of keys) if (obj?.[k] != null && obj[k] !== '') return obj[k]
  return fb
}

function normalize(raw, i) {
  return {
    id:         pick(raw, ['id', 'ID', 'emp_id', 'employee_id'], i + 1),
    name:       pick(raw, ['name', 'Name', 'employee_name', 'full_name'], 'Unknown'),
    email:      pick(raw, ['email', 'Email', 'mail'], '—'),
    city:       pick(raw, ['city', 'City', 'location'], 'Unknown'),
    salary:     Number(pick(raw, ['salary', 'Salary', 'amount'], 0)) || 0,
    department: pick(raw, ['department', 'Department', 'dept'], 'General'),
    raw,
  }
}

function extractRows(r) {
  if (Array.isArray(r)) return r
  for (const k of ['data', 'employees', 'result', 'records']) if (Array.isArray(r?.[k])) return r[k]
  if (r && typeof r === 'object') {
    for (const v of Object.values(r)) {
      if (Array.isArray(v)) return v
      if (v && typeof v === 'object') for (const n of Object.values(v)) if (Array.isArray(n)) return n
    }
  }
  return []
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
