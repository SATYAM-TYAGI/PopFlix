# PopFlix

Movie streaming website built for full stack assignment.

**Frontend:** React + Vite + Tailwind  
**Backend:** Node + Express + MongoDB  

## What it does

- Responsive UI (mobile + desktop)
- Movie listing from backend API
- Login / Signup with JWT
- My List (saved in browser localStorage)
- Movie detail page with trailer play

## Quick start

```bash
# backend
cd backend
npm install
cp .env.example .env   # fill mongo uri + jwt secret
npm start

# frontend (new terminal)
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:3000
npm run dev
```

Open `http://localhost:5173`

## Project structure

```
backend/     - API server, auth, movies data
frontend/    - React UI
```

## API routes

| Route | Method | Desc |
|-------|--------|------|
| `/api/movies` | GET | all movies |
| `/api/auth/signup` | POST | register user |
| `/api/auth/login` | POST | login, get token |
| `/api/auth/profile` | GET | user profile (needs token) |

## Change or add movies

Edit `backend/data/movies.js` and put poster images in `backend/data/images/`. Restart backend after changes.

### This Project was made for the completion of assignment of Idealoft Studio.