# empSight

Employee intelligence dashboard built with React + Vite + Tailwind.

## Screens

| Route | Page |
|---|---|
| `/login` | Sign in |
| `/list` | Virtualized staff directory with search |
| `/details/:id` | Camera capture → signature → merged audit image |
| `/analytics` | KPI cards, SVG charts, Leaflet map |

## Credentials
```
username: testuser  
password: Test123
```

## Stack

- React 18 + Vite
- Tailwind CSS (no UI libraries)
- React Router v6
- HTML5 Canvas + Camera API
- Raw SVG charts (no Chart.js or D3)
- Leaflet

## Run
```bash
npm install
npm run dev
```

## Notes

- Custom virtualization — only visible rows render in the DOM
- Photo + signature merged into one PNG via Canvas API
- Intentional bug: stale closure in `useEffect` in `StaffDirectory.jsx`
