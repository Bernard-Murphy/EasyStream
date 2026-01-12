# EasyStream

Monorepo:

- `apps/api`: NestJS + GraphQL + Prisma + Postgres (JWT for moderators)
- `apps/web`: Next.js + React/TS + Tailwind
- `lambda/assemble-stream`: stream assembly Lambda scaffold

## TL;DR (from scratch)

### Env

- Copy `config/env.example` into your preferred env loader (or export vars manually).
- Minimum required for local dev:
  - `DATABASE_URL=postgresql://easystream:easystream@localhost:5433/easystream?schema=public`
  - `JWT_SECRET=dev_only_change_me`
  - `API_PORT=4000`
  - `NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:4000/graphql`
  - `NEXT_PUBLIC_API_GRAPHQL_WS_URL=ws://localhost:4000/graphql`
  - `NEXT_PUBLIC_API_REST_URL=http://localhost:4000`

### One-time setup

```bash
cd /home/bernard/Documents/EasyStream

# 1) install deps
npm install

# 2) start Postgres (host port 5433)
docker compose up -d postgres

# 3) migrate + seed moderator user (default: admin / change_me)
DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run prisma:migrate
DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' MOD_USERNAME=admin MOD_PASSWORD=change_me npm --workspace apps/api run seed
```

### Run in dev

Option A (recommended: separate terminals):

```bash
cd /home/bernard/Documents/EasyStream
API_PORT=4000 JWT_SECRET=dev_only_change_me DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run start:dev
```

```bash
cd /home/bernard/Documents/EasyStream
npm --workspace apps/web run dev -- --port 3000
```

Option B (single command, runs both workspaces in parallel):

```bash
cd /home/bernard/Documents/EasyStream
npm run dev
```

### Build + run in prod

```bash
cd /home/bernard/Documents/EasyStream

# Build all
npm run build

# API (prod)
API_PORT=4000 JWT_SECRET=prod_change_me DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run start:prod

# Web (prod)
npm --workspace apps/web run start -- --port 3000
```

## Local dev

Start Postgres (mapped to host **5433**):

```bash
cd /home/bernard/Documents/EasyStream
docker compose up -d postgres
```

Run migrations + seed moderator:

```bash
cd /home/bernard/Documents/EasyStream
DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run prisma:migrate
DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' MOD_USERNAME=admin MOD_PASSWORD=change_me npm --workspace apps/api run seed
```

Start API + Web:

```bash
cd /home/bernard/Documents/EasyStream
API_PORT=4000 JWT_SECRET=dev_only_change_me DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run start:dev
npm --workspace apps/web run dev -- --port 3000
```

## Notes

- Next dev uses `WATCHPACK_POLLING=true` to avoid Linux `ENOSPC` watcher limits.
- Storj S3 client scaffold lives at `apps/api/src/s3/s3.ts` (per your config requirements).
