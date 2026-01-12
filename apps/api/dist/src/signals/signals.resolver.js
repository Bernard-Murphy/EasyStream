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
exports.SignalsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const signal_types_1 = require("./signal.types");
const signals_service_1 = require("./signals.service");
const graphql_pubsub_1 = require("../common/graphql-pubsub");
let SignalsResolver = class SignalsResolver {
    signals;
    constructor(signals) {
        this.signals = signals;
    }
    async sendSignal(streamUuid, toPeerId, fromPeerId, payload) {
        return await this.signals.sendSignal({ streamUuid, toPeerId, fromPeerId, payload });
    }
    signalReceived(streamUuid, peerId) {
        return graphql_pubsub_1.pubsub.asyncIterableIterator(graphql_pubsub_1.TOPIC_SIGNAL_RECEIVED);
    }
};
exports.SignalsResolver = SignalsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('streamUuid')),
    __param(1, (0, graphql_1.Args)('toPeerId')),
    __param(2, (0, graphql_1.Args)('fromPeerId')),
    __param(3, (0, graphql_1.Args)('payload')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], SignalsResolver.prototype, "sendSignal", null);
__decorate([
    (0, graphql_1.Subscription)(() => signal_types_1.SignalMessage, {
        filter: (payload, variables) => payload.signalReceived.toPeerId === variables.peerId &&
            payload.signalReceived.streamUuid === variables.streamUuid,
    }),
    __param(0, (0, graphql_1.Args)('streamUuid')),
    __param(1, (0, graphql_1.Args)('peerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SignalsResolver.prototype, "signalReceived", null);
exports.SignalsResolver = SignalsResolver = __decorate([
    (0, graphql_1.Resolver)(() => signal_types_1.SignalMessage),
    __metadata("design:paramtypes", [signals_service_1.SignalsService])
], SignalsResolver);
//# sourceMappingURL=signals.resolver.js.map