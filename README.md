# Know Your Rights AI — TheFreedomPartyUSA

Civic education for real-world application: learn your rights, train on
branching real-world scenarios, and ask an AI assistant grounded in
constitutional source material.

## Repository layout

| Path | What it is |
|---|---|
| `src/` | Main Next.js web app (App Router) |
| `backend/` | FastAPI civic-data API (representatives, bills, votes, lobbying, rights Q&A) |
| `data_pipeline/` | Scripts that pull Congress.gov data into a local SQLite DB |
| `frontend/` | Secondary Next.js starter (untouched scaffold) |
| `frontend/mobile/` | Expo (React Native) starter app |

## Web app (Next.js)

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

Lint:

```bash
npx eslint src --ext .js,.jsx
```

The app builds and runs without any env vars; auth, AI answers, and
payments activate once the corresponding keys are set in `.env.local`
(see `.env.example`).

### Routes

- `/` — quick Ask AI
- `/learn` — courses and lessons
- `/train` — branching scenario trainer (XP, streaks, sounds, share)
- `/leaderboard` — top users by XP (Supabase `users` table)
- `/login`, `/signup` — Supabase auth (email/password + Google OAuth)
- `/dashboard`, `/chat`, `/profile` — protected (require login)
- `/civic` — representatives, bill search, recent votes (needs the FastAPI
  backend; set `NEXT_PUBLIC_BACKEND_URL`, default `http://localhost:10000`)
- `/onboarding` — first-run flow; `/admin` — scenario generator (login required)
- API: `/api/ask`, `/api/auth`, `/api/daily`, `/api/embeddings`,
  `/api/generate`, `/api/laws?state=texas`, `/api/progress`,
  `/api/stripe`, `/api/voice`

### Supabase setup

Run `supabase/schema.sql` against your project (SQL editor or
`supabase db push`) — it creates both tables below with row-level
security (public anonymized leaderboard reads, owner-only writes).

### Supabase tables used

- `history` (`user_id`, `question`, `answer`) — Q&A history
- `progress` (`user_id` unique, `xp`, `streak`, `updated_at`) — training progress; also drives the leaderboard (anonymized)

Authenticated API calls (`/api/progress`, history saves in `/api/ask`) derive
identity from the Supabase access token in the `Authorization` header — never
from client-supplied IDs.

## Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
./start.sh                   # http://localhost:10000, docs at /docs
```

Env: `OPENAI_API_KEY` (rights Q&A), `GOOGLE_API_KEY` (representatives).
Endpoints: `/`, `/health`, `/ask?question=`, `/representatives?address=`,
`/bills?query=`, `/votes?query=`, `/lobbying?name=`.

## Data pipeline

```bash
export CONGRESS_API_KEY=your_key   # https://api.congress.gov/sign-up/
cd data_pipeline
python3 fetch_congress.py          # pull members into ../backend/freedomparty.db
python3 district_lookup.py         # look up reps by ZIP
```

## Mobile (Expo)

```bash
cd frontend/mobile
npm install
EXPO_PUBLIC_API_URL=http://<your-machine-ip>:3000 npx expo start
```

The home tab asks the web app's `/api/ask` endpoint. `EXPO_PUBLIC_API_URL`
must point at a reachable instance of the web app (a device can't reach
`localhost`); it defaults to `http://localhost:3000` for web preview.
