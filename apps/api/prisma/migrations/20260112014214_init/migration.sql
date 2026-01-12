-- CreateEnum
CREATE TYPE "StreamStatus" AS ENUM ('live', 'processing', 'past');

-- CreateTable
CREATE TABLE "Stream" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "anon_id" TEXT NOT NULL,
    "anon_text_color" TEXT NOT NULL,
    "anon_background_color" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StreamStatus" NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "fileUrls" TEXT[],
    "thumbnailUrl" TEXT,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamPosition" (
    "id" SERIAL NOT NULL,
    "stream_id" INTEGER NOT NULL,
    "stage" INTEGER NOT NULL,
    "peer_id" TEXT NOT NULL,
    "parents" TEXT[],
    "children" TEXT[],

    CONSTRAINT "StreamPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anon_id" TEXT NOT NULL,
    "anon_text_color" TEXT NOT NULL,
    "anon_background_color" TEXT NOT NULL,
    "name" TEXT,
    "message" TEXT NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "stream_id" INTEGER NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stream_uuid_key" ON "Stream"("uuid");

-- CreateIndex
CREATE INDEX "StreamPosition_stream_id_stage_idx" ON "StreamPosition"("stream_id", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "StreamPosition_stream_id_peer_id_key" ON "StreamPosition"("stream_id", "peer_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_uuid_key" ON "ChatMessage"("uuid");

-- CreateIndex
CREATE INDEX "ChatMessage_stream_id_create_date_idx" ON "ChatMessage"("stream_id", "create_date");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "StreamPosition" ADD CONSTRAINT "StreamPosition_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
