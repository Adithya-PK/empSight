# empSight

Employee intelligence dashboard — React + Vite + Tailwind.

## Screens

- `/login` — sign in
- `/list` — virtualized staff directory with search
- `/details/:id` — camera capture, signature, audit image merge
- `/analytics` — KPI cards, SVG salary/count charts, Leaflet map

## Credentials

```
username: testuser
password: Test123
```

## API

```
POST https://backend.jotish.in/backend_dev/gettabledata.php
{ "username": "test", "password": "123456" }
```

## Virtualization Math

`src/utils/scrollEngine.js`

```js
visibleCount = Math.ceil(containerH / ROW_H)
start = Math.max(0, Math.floor(scrollTop / ROW_H) - BUFFER)
end   = Math.min(total, start + visibleCount + BUFFER * 2)
slideY = start * ROW_H        // translateY offset for rendered rows
totalH = total * ROW_H        // spacer height so scrollbar is correct
```

Only visible rows + a buffer are in the DOM. A spacer div keeps the full scroll height.

## Image Merge

`src/utils/photoComposer.js`

1. Off-screen canvas created at photo resolution
2. `drawImage(photoCanvas)` paints the photo background
3. Semi-transparent band drawn at bottom 30%
4. `drawImage(sigCanvas)` scales signature into the band
5. `canvas.toDataURL('image/png')` exports the merged PNG
6. Saved to `localStorage` so Insights page can display it

## Intentional Bug

**File:** `src/pages/StaffDirectory.jsx`  
**Type:** Stale closure — `loadData` is defined inside `useEffect` with an empty dependency array `[]`. If the component later depended on any changing props or state inside that closure, the effect would never re-run and would read stale values.

## Run

```bash
npm install
npm run dev
```
