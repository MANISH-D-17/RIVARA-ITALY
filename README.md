# RIVARA-ITALY — Luxury Fashion E-Commerce Platform

Full-stack luxury fashion e-commerce application with customer storefront and admin dashboard.

## Stack
- **Frontend:** React + Vite + TailwindCSS + Framer Motion + Three.js
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Security:** JWT access/refresh, bcrypt, helmet, rate limiting, zod validation, mongo sanitize

## Structure
```
RIVARA-ITALY/
├── client/
│   ├── src/components
│   ├── src/pages
│   ├── src/layouts
│   ├── src/hooks
│   ├── src/services
│   └── src/assets
├── server/
│   ├── src/controllers
│   ├── src/models
│   ├── src/routes
│   ├── src/middleware
│   ├── src/utils
│   └── src/config
└── README.md
```

## Setup
```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

## Required environment values
- `MONGO_URI` uses Atlas URI provided in `server/.env.example`
- `GOOGLE_CLIENT_ID=520520671038-a9iijhl6qo3ok2nqavgea6m973nta5br.apps.googleusercontent.com`
- Admin email auto-elevated: `manishishaa17@gmail.com`

## Deploy
- Frontend: Vercel / Netlify (set `VITE_API_URL`)
- Backend: Render / Railway / VPS (set server env vars, open port)
- Enable CORS by configuring `CLIENT_URL`

### Vercel output directory fix
This repository uses a monorepo layout, so Vercel must read the client build output from `client/dist`. A `vercel.json` is included with:
- `buildCommand`: `npm run build --workspace client`
- `outputDirectory`: `client/dist`

