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
exports.ChatResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const chat_service_1 = require("./chat.service");
const chat_types_1 = require("./chat.types");
const graphql_pubsub_1 = require("../common/graphql-pubsub");
const graphql_2 = require("@nestjs/graphql");
let ChatMessageAddedPayload = class ChatMessageAddedPayload {
    streamUuid;
    message;
};
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], ChatMessageAddedPayload.prototype, "streamUuid", void 0);
__decorate([
    (0, graphql_2.Field)(() => chat_types_1.ChatMessage),
    __metadata("design:type", chat_types_1.ChatMessage)
], ChatMessageAddedPayload.prototype, "message", void 0);
ChatMessageAddedPayload = __decorate([
    (0, graphql_2.ObjectType)()
], ChatMessageAddedPayload);
let ChatResolver = class ChatResolver {
    chat;
    constructor(chat) {
        this.chat = chat;
    }
    async chatMessages(streamUuid) {
        return await this.chat.listMessages(streamUuid);
    }
    async sendChatMessage(streamUuid, message, name, anon_id, anon_text_color, anon_background_color) {
        const anon = anon_id && anon_text_color && anon_background_color
            ? { anon_id, anon_text_color, anon_background_color }
            : undefined;
        return await this.chat.sendMessage({
            streamUuid,
            message,
            name: name ?? null,
            anon,
        });
    }
    chatMessageAdded(streamUuid) {
        return graphql_pubsub_1.pubsub.asyncIterableIterator(graphql_pubsub_1.TOPIC_CHAT_MESSAGE_ADDED);
    }
};
exports.ChatResolver = ChatResolver;
__decorate([
    (0, graphql_1.Query)(() => [chat_types_1.ChatMessage]),
    __param(0, (0, graphql_1.Args)('streamUuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatResolver.prototype, "chatMessages", null);
__decorate([
    (0, graphql_1.Mutation)(() => chat_types_1.ChatMessage),
    __param(0, (0, graphql_1.Args)('streamUuid')),
    __param(1, (0, graphql_1.Args)('message')),
    __param(2, (0, graphql_1.Args)('name', { nullable: true })),
    __param(3, (0, graphql_1.Args)('anon_id', { nullable: true })),
    __param(4, (0, graphql_1.Args)('anon_text_color', { nullable: true })),
    __param(5, (0, graphql_1.Args)('anon_background_color', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ChatResolver.prototype, "sendChatMessage", null);
__decorate([
    (0, graphql_1.Subscription)(() => ChatMessageAddedPayload, {
        filter: (payload, variables) => payload.chatMessageAdded.streamUuid === variables.streamUuid,
    }),
    __param(0, (0, graphql_1.Args)('streamUuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatResolver.prototype, "chatMessageAdded", null);
exports.ChatResolver = ChatResolver = __decorate([
    (0, graphql_1.Resolver)(() => chat_types_1.ChatMessage),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatResolver);
//# sourceMappingURL=chat.resolver.js.map