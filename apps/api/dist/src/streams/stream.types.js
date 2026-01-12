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
exports.Stream = exports.StreamStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
var StreamStatus;
(function (StreamStatus) {
    StreamStatus["live"] = "live";
    StreamStatus["processing"] = "processing";
    StreamStatus["past"] = "past";
})(StreamStatus || (exports.StreamStatus = StreamStatus = {}));
(0, graphql_1.registerEnumType)(StreamStatus, { name: 'StreamStatus' });
let Stream = class Stream {
    id;
    uuid;
    start_time;
    end_time;
    anon_id;
    anon_text_color;
    anon_background_color;
    title;
    description;
    status;
    removed;
    fileUrls;
    thumbnailUrl;
};
exports.Stream = Stream;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Stream.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Stream.prototype, "uuid", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime),
    __metadata("design:type", Date)
], Stream.prototype, "start_time", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Object)
], Stream.prototype, "end_time", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Stream.prototype, "anon_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Stream.prototype, "anon_text_color", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Stream.prototype, "anon_background_color", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Stream.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Stream.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => StreamStatus),
    __metadata("design:type", String)
], Stream.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Stream.prototype, "removed", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Stream.prototype, "fileUrls", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], Stream.prototype, "thumbnailUrl", void 0);
exports.Stream = Stream = __decorate([
    (0, graphql_1.ObjectType)()
], Stream);
//# sourceMappingURL=stream.types.js.map