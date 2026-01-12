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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const streams_service_1 = require("./streams.service");
const stream_types_1 = require("./stream.types");
const graphql_pubsub_1 = require("../common/graphql-pubsub");
const position_types_1 = require("../positions/position.types");
const graphql_2 = require("@nestjs/graphql");
const processing_service_1 = require("../processing/processing.service");
const common_1 = require("@nestjs/common");
const gql_jwt_guard_1 = require("../auth/gql-jwt.guard");
let HierarchyUpdate = class HierarchyUpdate {
    streamUuid;
    positions;
};
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], HierarchyUpdate.prototype, "streamUuid", void 0);
__decorate([
    (0, graphql_2.Field)(() => [position_types_1.StreamPosition]),
    __metadata("design:type", Array)
], HierarchyUpdate.prototype, "positions", void 0);
HierarchyUpdate = __decorate([
    (0, graphql_2.ObjectType)()
], HierarchyUpdate);
let StreamsResolver = class StreamsResolver {
    streams;
    processing;
    constructor(streams, processing) {
        this.streams = streams;
        this.processing = processing;
    }
    async stream(uuid) {
        return await this.streams.getByUuid(uuid);
    }
    async liveStreams(sort, search) {
        return await this.streams.listLive(sort ?? 'viewers', search);
    }
    async pastStreams(search) {
        return await this.streams.listPast('recent', search);
    }
    async createStream(title, description, thumbnailUrl, anon_id, anon_text_color, anon_background_color) {
        const anon = anon_id && anon_text_color && anon_background_color
            ? { anon_id, anon_text_color, anon_background_color }
            : undefined;
        return await this.streams.createStream({ title, description, thumbnailUrl, anon });
    }
    async joinStream(uuid, peerId) {
        await this.streams.joinStream(uuid, peerId);
        return true;
    }
    async leaveStream(uuid, peerId) {
        return await this.streams.leaveStream(uuid, peerId);
    }
    async streamPositions(uuid) {
        return await this.streams.getPositions(uuid);
    }
    async endStream(uuid) {
        const updated = await this.streams.endStream(uuid);
        this.processing
            .processStreamToPast(uuid)
            .catch(() => {
        });
        return updated;
    }
    async markPast(uuid, fileUrls) {
        return await this.streams.markPast(uuid, fileUrls);
    }
    async setStreamThumbnail(uuid, thumbnailUrl) {
        return await this.streams.setThumbnail(uuid, thumbnailUrl ?? null);
    }
    streamUpdated(uuid) {
        return graphql_pubsub_1.pubsub.asyncIterableIterator(graphql_pubsub_1.TOPIC_STREAM_UPDATED);
    }
    hierarchyUpdated(uuid) {
        return graphql_pubsub_1.pubsub.asyncIterableIterator(graphql_pubsub_1.TOPIC_HIERARCHY_UPDATED);
    }
};
exports.StreamsResolver = StreamsResolver;
__decorate([
    (0, graphql_1.Query)(() => stream_types_1.Stream),
    __param(0, (0, graphql_1.Args)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "stream", null);
__decorate([
    (0, graphql_1.Query)(() => [stream_types_1.Stream]),
    __param(0, (0, graphql_1.Args)('sort', { nullable: true })),
    __param(1, (0, graphql_1.Args)('search', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "liveStreams", null);
__decorate([
    (0, graphql_1.Query)(() => [stream_types_1.Stream]),
    __param(0, (0, graphql_1.Args)('search', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "pastStreams", null);
__decorate([
    (0, graphql_1.Mutation)(() => stream_types_1.Stream),
    __param(0, (0, graphql_1.Args)('title')),
    __param(1, (0, graphql_1.Args)('description')),
    __param(2, (0, graphql_1.Args)('thumbnailUrl', { nullable: true })),
    __param(3, (0, graphql_1.Args)('anon_id', { nullable: true })),
    __param(4, (0, graphql_1.Args)('anon_text_color', { nullable: true })),
    __param(5, (0, graphql_1.Args)('anon_background_color', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "createStream", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('uuid')),
    __param(1, (0, graphql_1.Args)('peerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "joinStream", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('uuid')),
    __param(1, (0, graphql_1.Args)('peerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "leaveStream", null);
__decorate([
    (0, graphql_1.Query)(() => [position_types_1.StreamPosition]),
    __param(0, (0, graphql_1.Args)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "streamPositions", null);
__decorate([
    (0, graphql_1.Mutation)(() => stream_types_1.Stream),
    (0, common_1.UseGuards)(gql_jwt_guard_1.GqlJwtGuard),
    __param(0, (0, graphql_1.Args)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "endStream", null);
__decorate([
    (0, graphql_1.Mutation)(() => stream_types_1.Stream),
    (0, common_1.UseGuards)(gql_jwt_guard_1.GqlJwtGuard),
    __param(0, (0, graphql_1.Args)('uuid')),
    __param(1, (0, graphql_1.Args)('fileUrls', { type: () => [String] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "markPast", null);
__decorate([
    (0, graphql_1.Mutation)(() => stream_types_1.Stream),
    __param(0, (0, graphql_1.Args)('uuid')),
    __param(1, (0, graphql_1.Args)('thumbnailUrl', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StreamsResolver.prototype, "setStreamThumbnail", null);
__decorate([
    (0, graphql_1.Subscription)(() => stream_types_1.Stream, {
        filter: (payload, variables) => payload.streamUpdated.uuid === variables.uuid,
    }),
    __param(0, (0, graphql_1.Args)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StreamsResolver.prototype, "streamUpdated", null);
__decorate([
    (0, graphql_1.Subscription)(() => HierarchyUpdate, {
        filter: (payload, variables) => payload.hierarchyUpdated.streamUuid === variables.uuid,
    }),
    __param(0, (0, graphql_1.Args)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StreamsResolver.prototype, "hierarchyUpdated", null);
exports.StreamsResolver = StreamsResolver = __decorate([
    (0, graphql_1.Resolver)(() => stream_types_1.Stream),
    __metadata("design:paramtypes", [streams_service_1.StreamsService,
        processing_service_1.ProcessingService])
], StreamsResolver);
//# sourceMappingURL=streams.resolver.js.map