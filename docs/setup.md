# Setup

This document describes the required setup and run commands for the ASHU GONDER backend auth system.

## Stack

- Node.js + TypeScript
- Express
- cors
- cookie-parser
- PostgreSQL
- Drizzle ORM
- Drizzle Kit
- Brevo email
- JWT authentication

## Required Environment

Define these in [`.env`](C:/Users/Hp/Videos/ASHU_GONDER/server/src/.env):

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ASHUGONDER
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email
BREVO_SENDER_NAME=ASHUGONDER
FRONTEND_ORIGIN=http://localhost:3000
```

## Database Notes

- Schema lives in:
  - [`server/src/lib/db/schema`](C:/Users/Hp/Videos/ASHU_GONDER/server/src/lib/db/schema)
- Drizzle config:
  - [`server/drizzle.config.ts`](C:/Users/Hp/Videos/ASHU_GONDER/server/drizzle.config.ts)
- Database bootstrap:
  - [`server/src/lib/db/index.ts`](C:/Users/Hp/Videos/ASHU_GONDER/server/src/lib/db/index.ts)

## Install

### Backend

```bash
cd C:\Users\Hp\Videos\ASHU_GONDER\server
npm install
```

### Frontend

```bash
cd C:\Users\Hp\Videos\ASHU_GONDER\client
npm install
```

## Drizzle Commands

From [`server`](C:/Users/Hp/Videos/ASHU_GONDER/server):

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Run

### Backend

```bash
cd C:\Users\Hp\Videos\ASHU_GONDER\server
npm run dev
```

### Frontend

Create frontend env:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

Then run:

```bash
cd C:\Users\Hp\Videos\ASHU_GONDER\client
npm run dev
```

## Seed Admin

From [`server`](C:/Users/Hp/Videos/ASHU_GONDER/server):

```bash
npm run seed:admin
```

Seeded admin:

- email: `getabalewkemaw@gmail.com`
- password: `1234GECH@@`
- role: `ADMIN`

## Operational Notes

- If a route returns unexpected `404` on port `4000`, stop any stale process using that port and restart the backend.
- Drizzle Studio is the easiest way to inspect data during development.
- Backend build:
  - `npm run build`
- Frontend checks:
  - `npm run lint`
  - `npm run build`
