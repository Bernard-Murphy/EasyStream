"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamsModule = void 0;
const common_1 = require("@nestjs/common");
const streams_resolver_1 = require("./streams.resolver");
const streams_service_1 = require("./streams.service");
const processing_module_1 = require("../processing/processing.module");
const auth_module_1 = require("../auth/auth.module");
let StreamsModule = class StreamsModule {
};
exports.StreamsModule = StreamsModule;
exports.StreamsModule = StreamsModule = __decorate([
    (0, common_1.Module)({
        imports: [processing_module_1.ProcessingModule, auth_module_1.AuthModule],
        providers: [streams_resolver_1.StreamsResolver, streams_service_1.StreamsService],
        exports: [streams_service_1.StreamsService],
    })
], StreamsModule);
//# sourceMappingURL=streams.module.js.map