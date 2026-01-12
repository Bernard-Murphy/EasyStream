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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const anon_1 = require("../common/anon");
const graphql_pubsub_1 = require("../common/graphql-pubsub");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listMessages(streamUuid) {
        const stream = await this.prisma.stream.findUnique({ where: { uuid: streamUuid } });
        if (!stream)
            throw new common_1.NotFoundException('Stream not found');
        return await this.prisma.chatMessage.findMany({
            where: { stream_id: stream.id, removed: false },
            orderBy: { create_date: 'asc' },
            take: 500,
        });
    }
    async sendMessage(input) {
        const stream = await this.prisma.stream.findUnique({
            where: { uuid: input.streamUuid },
        });
        if (!stream)
            throw new common_1.NotFoundException('Stream not found');
        const anon = input.anon ?? (0, anon_1.createAnonSession)();
        const msg = await this.prisma.chatMessage.create({
            data: {
                uuid: (0, crypto_1.randomUUID)(),
                create_date: new Date(),
                anon_id: anon.anon_id,
                anon_text_color: anon.anon_text_color,
                anon_background_color: anon.anon_background_color,
                name: input.name ?? null,
                message: input.message,
                removed: false,
                stream_id: stream.id,
            },
        });
        await graphql_pubsub_1.pubsub.publish(graphql_pubsub_1.TOPIC_CHAT_MESSAGE_ADDED, {
            chatMessageAdded: {
                streamUuid: input.streamUuid,
                message: msg,
            },
        });
        return msg;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map