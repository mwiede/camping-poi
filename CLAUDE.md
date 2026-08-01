# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server (localhost:5173/camping-poi/)
npm run build      # Production build → dist/
npm test           # Run Vitest tests
npm run deploy     # Build + deploy to GitHub Pages (mwiede.github.io/camping-poi)
```

## Architecture

Single-page React app (Vite + React 18) that shows water dump spots for campers on a Leaflet map. Data comes from the park4night API.

**API proxy strategy** — park4night blocks direct browser requests, so a CORS proxy is needed:
- **Dev:** Vite dev proxy (`vite.config.js` → `server.proxy`) handles `/services` → `https://park4night.com` transparently via relative paths
- **Prod:** Cloud Run proxy at `https://proxy-dk3f2my3aa-uc.a.run.app` prefixes the full URL

The switch lives in `src/App.jsx` via `import.meta.env.DEV`.

**Data flow** — map center changes trigger a re-fetch (debounced by rounding to 1 decimal place). The park4night response has a `lieux` array; each item is filtered by `eau_noire` (black water) and `eau_usee` (grey water) string flags (`'1'` = present).

**CORS proxy source** (`cors-proxy/functions/index.js`) — Firebase Cloud Function using `cors-anywhere`, whitelisted to `https://mwiede.github.io` only.

**Key files:**
- `src/App.jsx` — all state, fetch logic, map setup
- `src/MyMarker.jsx` — renders a colored Leaflet marker with a popup and native maps navigation button
- `src/LocateControl.js` — wraps `leaflet.locatecontrol` as a React component
