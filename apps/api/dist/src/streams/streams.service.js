"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const anon_1 = require("../common/anon");
const graphql_pubsub_1 = require("../common/graphql-pubsub");
let StreamsService = class StreamsService {
    prisma;
    limits;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.limits = {
            directViewerLimit: Number(config.get('DIRECT_VIEWER_LIMIT') ?? 4),
            childStreamerLimit: Number(config.get('CHILD_STREAMER_LIMIT') ?? 2),
            childViewerLimit: Number(config.get('CHILD_VIEWER_LIMIT') ?? 4),
        };
    }
    async getByUuid(uuid) {
        const stream = await this.prisma.stream.findUnique({ where: { uuid } });
        if (!stream)
            throw new common_1.NotFoundException('Stream not found');
        return stream;
    }
    async listLive(sort, search) {
        const where = {
            status: 'live',
            removed: false,
            ...(search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const streams = await this.prisma.stream.findMany({
            where,
            orderBy: { start_time: 'desc' },
            take: 100,
        });
        if (sort === 'recent')
            return streams;
        const withCounts = await Promise.all(streams.map(async (s) => {
            const viewers = await this.prisma.streamPosition.count({
                where: { stream_id: s.id, NOT: { stage: 0 } },
            });
            return { stream: s, viewers };
        }));
        return withCounts.sort((a, b) => b.viewers - a.viewers).map((x) => x.stream);
    }
    async listPast(sort, search) {
        const where = {
            status: 'past',
            removed: false,
            ...(search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        return await this.prisma.stream.findMany({
            where,
            orderBy: { end_time: 'desc' },
            take: 200,
        });
    }
    async createStream(input) {
        const anon = input.anon ?? (0, anon_1.createAnonSession)();
        const uuid = (0, crypto_1.randomUUID)();
        const stream = await this.prisma.stream.create({
            data: {
                uuid,
                start_time: new Date(),
                end_time: null,
                anon_id: anon.anon_id,
                anon_text_color: anon.anon_text_color,
                anon_background_color: anon.anon_background_color,
                title: input.title,
                description: input.description,
                status: 'live',
                removed: false,
                fileUrls: [],
                thumbnailUrl: input.thumbnailUrl ?? null,
            },
        });
        await this.prisma.streamPosition.create({
            data: {
                stream_id: stream.id,
                stage: 0,
                peer_id: `streamer-${stream.uuid}`,
                parents: [],
                children: [],
            },
        });
        await graphql_pubsub_1.pubsub.publish(graphql_pubsub_1.TOPIC_STREAM_UPDATED, { streamUpdated: stream });
        await this.publishHierarchy(stream.id, stream.uuid);
        return stream;
    }
    async endStream(uuid) {
        const stream = await this.getByUuid(uuid);
        const updated = await this.prisma.stream.update({
            where: { id: stream.id },
            data: {
                status: 'processing',
                end_time: new Date(),
            },
        });
        await graphql_pubsub_1.pubsub.publish(graphql_pubsub_1.TOPIC_STREAM_UPDATED, { streamUpdated: updated });
        return updated;
    }
    async markPast(uuid, fileUrls) {
        const stream = await this.getByUuid(uuid);
        const updated = await this.prisma.stream.update({
            where: { id: stream.id },
            data: {
                status: 'past',
                fileUrls,
            },
        });
        await graphql_pubsub_1.pubsub.publish(graphql_pubsub_1.TOPIC_STREAM_UPDATED, { streamUpdated: updated });
        return updated;
    }
    async setThumbnail(uuid, thumbnailUrl) {
        const stream = await this.getByUuid(uuid);
        const updated = await this.prisma.stream.update({
            where: { id: stream.id },
            data: {
                thumbnailUrl,
            },
        });
        await graphql_pubsub_1.pubsub.publish(graphql_pubsub_1.TOPIC_STREAM_UPDATED, { streamUpdated: updated });
        return updated;
    }
    async joinStream(uuid, peerId) {
        const stream = await this.getByUuid(uuid);
        const created = await this.prisma.streamPosition.upsert({
            where: { stream_id_peer_id: { stream_id: stream.id, peer_id: peerId } },
            update: {},
            create: {
                stream_id: stream.id,
                stage: 999,
                peer_id: peerId,
                parents: [],
                children: [],
            },
        });
        await this.recomputeHierarchy(stream.id);
        await this.publishHierarchy(stream.id, stream.uuid);
        return created;
    }
    async leaveStream(uuid, peerId) {
        const stream = await this.getByUuid(uuid);
        await this.prisma.streamPosition.deleteMany({
            where: { stream_id: stream.id, peer_id: peerId, NOT: { stage: 0 } },
        });
        await this.recomputeHierarchy(stream.id);
        await this.publishHierarchy(stream.id, stream.uuid);
        return true;
    }
    async getPositions(uuid) {
        const stream = await this.getByUuid(uuid);
        return await this.prisma.streamPosition.findMany({
            where: { stream_id: stream.id },
            orderBy: [{ stage: 'asc' }, { id: 'asc' }],
        });
    }
    async publishHierarchy(streamId, streamUuid) {
        const positions = await this.prisma.streamPosition.findMany({
            where: { stream_id: streamId },
            orderBy: [{ stage: 'asc' }, { id: 'asc' }],
        });
        await graphql_pubsub_1.pubsub.publish(graphql_pubsub_1.TOPIC_HIERARCHY_UPDATED, {
            hierarchyUpdated: {
                streamUuid,
                positions,
            },
        });
    }
    async recomputeHierarchy(streamId) {
        const positions = await this.prisma.streamPosition.findMany({
            where: { stream_id: streamId },
            orderBy: [{ stage: 'asc' }, { id: 'asc' }],
        });
        const streamer = positions.find((p) => p.stage === 0);
        if (!streamer)
            return;
        const viewers = positions.filter((p) => p.stage !== 0);
        const viewerPeerIds = viewers.map((v) => v.peer_id);
        const newState = new Map();
        for (const peerId of viewerPeerIds) {
            newState.set(peerId, { stage: 999, parents: [], children: [] });
        }
        let streamerChildren = [];
        const stage1 = viewerPeerIds.slice(0, this.limits.directViewerLimit);
        for (const v of stage1) {
            newState.get(v).stage = 1;
            newState.get(v).parents = [streamer.peer_id];
        }
        streamerChildren = stage1.slice();
        let remaining = viewerPeerIds.slice(stage1.length);
        let stage = 2;
        const childrenCount = (peerId) => (peerId === streamer.peer_id
            ? streamerChildren.length
            : newState.get(peerId)?.children.length ?? 0);
        while (remaining.length > 0) {
            const stageViewers = [];
            const candidateParents = [
                ...stage1,
                ...Array.from(newState.entries())
                    .filter(([id, s]) => s.stage >= 1 && s.stage < stage)
                    .map(([id]) => id),
            ].filter((v, idx, arr) => arr.indexOf(v) === idx);
            const availableParents = candidateParents.filter((p) => childrenCount(p) < this.limits.childViewerLimit);
            if (availableParents.length === 0) {
                for (const v of remaining) {
                    newState.get(v).stage = stage;
                    newState.get(v).parents = [];
                    stageViewers.push(v);
                }
                remaining = [];
                break;
            }
            while (remaining.length > 0) {
                const viewer = remaining[0];
                const parents = availableParents
                    .slice()
                    .sort((a, b) => childrenCount(a) - childrenCount(b))
                    .slice(0, this.limits.childStreamerLimit);
                if (parents.length === 0)
                    break;
                newState.get(viewer).stage = stage;
                newState.get(viewer).parents = parents;
                stageViewers.push(viewer);
                remaining = remaining.slice(1);
                for (const p of parents) {
                    if (p === streamer.peer_id) {
                        streamerChildren.push(viewer);
                    }
                    else {
                        newState.get(p).children.push(viewer);
                    }
                }
                for (let i = availableParents.length - 1; i >= 0; i--) {
                    if (childrenCount(availableParents[i]) >= this.limits.childViewerLimit) {
                        availableParents.splice(i, 1);
                    }
                }
            }
            stage += 1;
        }
        await this.prisma.streamPosition.update({
            where: { id: streamer.id },
            data: { children: streamerChildren, parents: [] },
        });
        await Promise.all(viewerPeerIds.map(async (peerId) => {
            const row = viewers.find((v) => v.peer_id === peerId);
            if (!row)
                return;
            const s = newState.get(peerId);
            await this.prisma.streamPosition.update({
                where: { id: row.id },
                data: { stage: s.stage, parents: s.parents, children: s.children },
            });
        }));
    }
};
exports.StreamsService = StreamsService;
exports.StreamsService = StreamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], StreamsService);
//# sourceMappingURL=streams.service.js.map