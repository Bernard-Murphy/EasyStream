"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_resolver_1 = require("./auth.resolver");
const auth_service_1 = require("./auth.service");
const gql_jwt_guard_1 = require("./gql-jwt.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET') ?? 'dev_only_change_me',
                    signOptions: { expiresIn: '7d' },
                }),
            }),
        ],
        providers: [auth_resolver_1.AuthResolver, auth_service_1.AuthService, gql_jwt_guard_1.GqlJwtGuard],
        exports: [jwt_1.JwtModule, gql_jwt_guard_1.GqlJwtGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map