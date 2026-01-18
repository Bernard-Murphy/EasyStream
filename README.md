# EasyStream

Monorepo:

- `apps/api`: NestJS + GraphQL + Prisma + Postgres (JWT for moderators)
- `apps/web`: Next.js + React/TS + Tailwind
- `lambda/assemble-stream`: stream assembly Lambda scaffold

## How it Works

EasyStream uses a **waterfall peer-to-peer architecture** to distribute live streams efficiently without overwhelming the broadcaster:

### Stream Distribution

1. **Streamer (Stage 0)**: The host broadcasts their video/audio and records clips locally. When a clip reaches `CLIP_LENGTH` MB (default 50), it's uploaded to storage.

2. **Direct Viewers (Stage 1)**: The first `DIRECT_VIEWER_LIMIT` viewers (default 4) connect directly to the streamer via WebRTC and receive the stream as a primary source.

3. **Relayed Viewers (Stage 2+)**: Additional viewers connect to `CHILD_STREAMER_LIMIT` parents (default 2) from higher stages. Each parent can relay to up to `CHILD_VIEWER_LIMIT` children (default 4).
   - **Primary + Backup**: Viewers use one parent as their primary stream source and others as backups for redundancy.
   - **Automatic Failover**: If a parent disconnects, viewers instantly switch to their backup stream and request a new connection.

### Example Hierarchy

With defaults (`DIRECT_VIEWER_LIMIT=4`, `CHILD_STREAMER_LIMIT=2`, `CHILD_VIEWER_LIMIT=4`):

```
Streamer (stage 0)
├─ Viewer 1-4 (stage 1, direct connection)
│  ├─ Viewer 5 (stage 2, connects to 2 stage-1 viewers)
│  ├─ Viewer 6 (stage 2)
│  └─ ... up to 8 stage-2 viewers
└─ Stage 3, 4, 5... (each viewer relays to 4 children)
```

### Lifecycle

- **Join**: Viewers call `joinStream(uuid, peerId)`. The server recomputes the hierarchy and publishes updates via GraphQL subscriptions.
- **Signaling**: WebRTC offers/answers/ICE candidates are exchanged through GraphQL mutations/subscriptions.
- **Heartbeat**: Every 10s, viewers send `heartbeatStream()` to stay active. The server prunes stale peers after `STALE_PEER_SECONDS` (default 30s).
- **End Stream**: The host (or moderator) ends the stream, triggering processing: clips are assembled into `STREAM_LENGTH` MB files (default 250) and stored for replay.

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

# 1) install deps
npm install

# 2) start Postgres (host port 5433)
docker compose up -d postgres

# 3) migrate + seed moderator user (default: admin / change_me)
DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run prisma:migrate
DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' MOD_USERNAME=admin MOD_PASSWORD=change_me npm --workspace apps/api run seed
```

If you pulled recent changes, re-run migrations (new columns: `Stream.host_token`, `StreamPosition.last_seen`):

```bash
DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run prisma:migrate
```

### Run in dev

Option A (recommended: separate terminals):

```bash
API_PORT=4000 JWT_SECRET=dev_only_change_me DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run start:dev
```

```bash
npm --workspace apps/web run dev -- --port 3000
```

Option B (single command, runs both workspaces in parallel):

```bash
npm run dev
```

### Build + run in prod

```bash

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
docker compose up -d postgres
```

Run migrations + seed moderator:

```bash
DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run prisma:migrate
DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' MOD_USERNAME=admin MOD_PASSWORD=change_me npm --workspace apps/api run seed
```

Start API + Web:

```bash
API_PORT=4000 JWT_SECRET=dev_only_change_me DATABASE_URL='postgresql://easystream:easystream@localhost:5433/easystream?schema=public' npm --workspace apps/api run start:dev
npm --workspace apps/web run dev -- --port 3000
```

## Notes

- Next dev uses `WATCHPACK_POLLING=true` to avoid Linux `ENOSPC` watcher limits.
- Storj S3 client scaffold lives at `apps/api/src/s3/s3.ts` (per your config requirements).
- Processing can run in two modes:
  - `ASSEMBLY_MODE=local` (default): API assembles clips using ffmpeg
  - `ASSEMBLY_MODE=lambda`: API invokes `ASSEMBLE_STREAM_LAMBDA_NAME` and falls back to local on failure
