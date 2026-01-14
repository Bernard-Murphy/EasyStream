-- Add host token to Stream (allows streamer/host to end their own stream without moderator JWT)
ALTER TABLE "Stream" ADD COLUMN "host_token" TEXT;

-- Add last_seen timestamp for pruning stale StreamPositions
ALTER TABLE "StreamPosition" ADD COLUMN "last_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Unique host_token when present
CREATE UNIQUE INDEX "Stream_host_token_key" ON "Stream"("host_token");


