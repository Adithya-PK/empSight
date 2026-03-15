# empSight

empSight is an employee management dashboard where you can browse your entire workforce, search and filter by name or city, click into any employee to capture their photo and get them to sign digitally, then merge both into a single audit image. The analytics page shows salary distribution by city, headcount charts, and a live map.

## Screens

| Route | Page |
|---|---|
| `/login` | Sign in |
| `/list` | Searchable staff directory |
| `/details/:id` | Camera capture + signature + audit image export |
| `/analytics` | KPI stats, salary chart, headcount chart, city map |

## Credentials
```
username: testuser
password: Test123
```

## Stack

- React 18 + Vite + Tailwind CSS
- React Router v6
- HTML5 Canvas + Camera API
- Raw SVG charts — no Chart.js or D3
- Leaflet map

## Run
```bash
npm install
npm run dev
```

## Technical Notes

- Virtualized table — only visible rows are in the DOM at any time
- Audit image — photo and signature merged into one PNG using Canvas drawImage
- Intentional bug: stale closure in `useEffect` in `StaffDirectory.jsx` (documented per assignment requirement)
