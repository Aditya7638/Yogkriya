# 🌿 YogKriya

**Ancient Wisdom. Modern Strength.**

A full-stack wellness platform combining traditional Indian yoga and wellness practices with modern fitness, nutrition, personalised routines, and progress tracking.

---

## Features

- **Yoga Library** — 11+ curated asanas with video embeds, instructions, benefits, precautions
- **Ancient Wisdom** — 10 classical practices (Pranayama, Dhyana, Dinacharya, Abhyanga…) with traditional sources
- **Modern Fitness** — 15 gym exercises across all muscle groups
- **Nutrition** — Traditional Indian foods + structured meal plans
- **Personalised Routines** — Deterministic rule-based generator (AI-ready architecture)
- **Interactive Workout Session** — Timer, sets/reps tracker, rest timer, completion flow
- **Progress Dashboard** — Streaks, weekly charts, session history (Recharts)
- **Favorites** — Heart any exercise or practice
- **Auth** — JWT register/login/protected routes
- **Dark/Light mode**
- **Fully responsive** (mobile-first)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Framer Motion, Recharts |
| Backend | Python, FastAPI, SQLAlchemy, PostgreSQL, Pydantic, JWT |
| Database | PostgreSQL 16 |
| Dev | Docker Compose |

---

## Quick Start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

App runs at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

Demo account: `admin@yogkriya.com` / `admin123`

---

## Local Development

### Prerequisites
- Node 22+, Python 3.12+, PostgreSQL 16

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Create DB
createdb yogkriya
createuser yogkriya -P   # password: yogkriya

# Set env
cp ../.env.example .env  # edit DATABASE_URL

# Run
uvicorn app.main:app --reload

# Seed data (separate terminal)
python seed.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

```env
# Backend (.env)
DATABASE_URL=postgresql://yogkriya:yogkriya@localhost:5432/yogkriya
JWT_SECRET=your-long-random-secret
YOUTUBE_API_KEY=           # optional

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/yoga
GET    /api/yoga/{id}
GET    /api/practices
GET    /api/practices/{id}
GET    /api/exercises
GET    /api/exercises/{id}

GET    /api/nutrition/foods
GET    /api/nutrition/diet-plans

GET    /api/routines
POST   /api/routines/generate
GET    /api/routines/{id}
DELETE /api/routines/{id}
POST   /api/routines/{id}/exercises
DELETE /api/routines/{id}/exercises/{eid}

POST   /api/workouts
GET    /api/workouts

GET    /api/progress

GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/{id}

GET    /api/profile  (PUT)
GET    /api/search?q=
```

---

## Deployment

**Backend** → Render / Railway / Fly.io  
**Frontend** → Vercel / Netlify (set `VITE_API_URL` to your backend URL)  
**Database** → Neon / Supabase / Railway PostgreSQL

---

## Future Roadmap (not in MVP)
- AI routine generation (service slot already wired in `routine_service.py`)
- AI chatbot / progress analysis
- Achievements & gamification
- Admin CMS for content management
- Wearable / Apple Health integration
- Social features
