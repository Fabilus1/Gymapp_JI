# IronLog

Personal hypertrophy tracker — exercise library, auto-progression suggestions, recovery tracking, and body weight charts. Single-user PWA, works offline, installable to your phone's home screen.

## Stack

- React + TypeScript + Vite
- `vite-plugin-pwa` for the manifest + service worker (offline caching, installability)
- IndexedDB (via [`idb`](https://github.com/jakearchibald/idb)) for local storage, with full JSON export/import as a manual backup

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # type-checks then builds to dist/
npm run preview # serve the production build locally
```

## Data & backups

All data (settings, sessions, body weight, recovery log) lives in IndexedDB on-device — nothing is sent to a server. Use **Settings → Export data** regularly to download a JSON backup, and **Import data** to restore it (e.g. after switching phones).
