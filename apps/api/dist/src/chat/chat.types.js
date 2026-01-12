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
exports.ChatMessage = void 0;
const graphql_1 = require("@nestjs/graphql");
let ChatMessage = class ChatMessage {
    id;
    uuid;
    create_date;
    anon_id;
    anon_text_color;
    anon_background_color;
    name;
    message;
    removed;
    stream_id;
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ChatMessage.prototype, "uuid", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime),
    __metadata("design:type", Date)
], ChatMessage.prototype, "create_date", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ChatMessage.prototype, "anon_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ChatMessage.prototype, "anon_text_color", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ChatMessage.prototype, "anon_background_color", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ChatMessage.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ChatMessage.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "removed", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ChatMessage.prototype, "stream_id", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, graphql_1.ObjectType)()
], ChatMessage);
//# sourceMappingURL=chat.types.js.map