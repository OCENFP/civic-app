# civic-app (Know Your Rights AI / TheFreedomPartyUSA)

Civic education platform: learn rights, train on branching scenarios, ask an
AI grounded in constitutional data.

## Layout

- `src/` — main Next.js 16 app (App Router, JS not TS). Pages in `src/app`,
  API routes in `src/app/api/*/route.js`, shared clients in `src/lib`,
  client-side logic in `src/engine`, static data in `src/data`.
- `backend/` — FastAPI civic-data API (run from `backend/`: `./start.sh`, port 10000).
- `data_pipeline/` — Congress.gov → SQLite scripts (need `CONGRESS_API_KEY`).
- `frontend/` — secondary Next.js scaffold; `frontend/mobile/` — Expo app
  (each has its own package.json; `frontend/tsconfig.json` excludes `mobile`).

## Commands

- Web: `npm install`, `npm run dev`, `npm run build`, `npx eslint src --ext .js,.jsx`
- Backend: `cd backend && pip install -r requirements.txt && ./start.sh`
- Mobile: `cd frontend/mobile && npm install && npx expo start`
- CI mirrors: web lint+build, python compile+import (`.github/workflows/ci.yml`)

## Conventions and constraints

- The app must build with NO env vars: `src/lib/{supabase,openai,stripe}.js`
  fall back to placeholders — keep new clients build-safe the same way.
- API identity comes ONLY from the Supabase access token via
  `src/lib/serverAuth.js` (`getUserFromRequest`) — never trust a
  client-supplied userId. Client calls attach it with `authHeaders()` from
  `src/lib/auth.js`.
- Server routes must never authenticate on the shared module-scope supabase
  client; use `createRequestClient()` per request.
- OpenAI-spending routes go through `src/lib/rateLimit.js` and cap input length.
- Progress persists to the Supabase `progress` table and localStorage
  (`src/engine/storage.js` + `useProgress` hook); Q&A history to `history`.
  There is no `users` table.
- `backend/main.py` calls `load_dotenv()` BEFORE importing services (they
  read env at import time) — keep that ordering.
