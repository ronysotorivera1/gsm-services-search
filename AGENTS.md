# Base44 imported-app notes

- **App**: React 18 + Vite 6 SPA ("IdeaSpark"); frontend-only repo — all data/auth lives on a Base44-hosted backend via `@base44/sdk` (see `src/api/base44Client.js`, `src/lib/app-params.js`).
- **Run**: `docker compose -f docker-compose.base44.yml up -d --build` → web on host port 3000 (bind-mounted source, `npm install` + `vite dev` at startup, polling HMR).
- **Backend identity** comes from `VITE_BASE44_APP_ID` + `VITE_BASE44_APP_BASE_URL`, delivered as secrets via `/run/base44/app.env` (never hardcode). Without them the dev server boots but `/api` calls fail — get both from the app's local-development settings page in Base44 (they were requested via set_secrets; values were not supplied yet as of 2026-09-03). The Vite plugin also supports `base44 dev` / `base44 dev --remote` as alternatives.
- **vite.config.js** sets `server.host: true` + `allowedHosts: true` so the preview's changing proxy hostname is accepted — do not remove.
- **Verify**: `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns the app, and `/src/main.jsx` serves unhashed source (confirms live-reload wiring, not a prebuilt bundle).
