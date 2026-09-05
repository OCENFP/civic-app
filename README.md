# Know Your Rights AI

A civic-education app that helps people understand and exercise their rights in
real-world situations — AI Q&A grounded in constitutional/legal data, branching
training scenarios, lessons, and a leaderboard.

## Stack

- **Frontend / API:** Next.js 16 (App Router) + React 19, plain JavaScript
- **Auth & DB:** Supabase (`@supabase/supabase-js`)
- **AI:** OpenAI (chat + embeddings)
- **Payments:** Stripe
- **Backend service:** a separate Python/FastAPI app in `backend/` (civic data:
  representatives, bills, votes)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:3000
```

The app builds and runs without any secrets configured — Supabase falls back to
a non-functional placeholder client (with a console warning) and AI/Stripe
routes only fail when actually called. Set the variables in `.env.local` to make
those features work.

### Environment variables

See `.env.example`. `NEXT_PUBLIC_*` values are inlined into the browser bundle at
build time; the rest are server-only.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `OPENAI_API_KEY` | AI Q&A, embeddings, scenario generation |
| `STRIPE_SECRET_KEY` | Pro subscription checkout |

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Routes

- `/` — ask a rights question
- `/learn` — lessons
- `/train` — branching training scenarios
- `/chat` — AI chat (protected)
- `/dashboard`, `/profile` — progress (protected)
- `/leaderboard` — top users
- `/login`, `/signup` — auth
- `/admin` — scenario generator
- `/api/*` — ask, auth, embeddings, laws, progress, generate, stripe, voice, daily

## Python backend (`backend/`)

```bash
cd backend
python3 -m venv venv
venv/bin/pip install -r requirements.txt
OPENAI_API_KEY=... ./start.sh   # uvicorn on port 10000
```

Boots and serves without an OpenAI key (`/health` reports `openai_configured:false`).
