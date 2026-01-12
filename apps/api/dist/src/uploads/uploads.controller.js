"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const path = __importStar(require("path"));
const multer_1 = require("multer");
const uploads_service_1 = require("./uploads.service");
const prisma_service_1 = require("../prisma/prisma.service");
let UploadsController = class UploadsController {
    config;
    uploads;
    prisma;
    constructor(config, uploads, prisma) {
        this.config = config;
        this.uploads = uploads;
        this.prisma = prisma;
    }
    async uploadClip(req, file) {
        if (!file)
            throw new common_1.BadRequestException('Missing file');
        const streamUuid = req.query.streamUuid ??
            req.body?.streamUuid;
        if (!streamUuid)
            throw new common_1.BadRequestException('Missing streamUuid');
        const ext = path.extname(file.originalname) || '.webm';
        const key = this.uploads.makeKey(`streams/${streamUuid}/clips`, ext);
        const uploaded = await this.uploads.putBuffer({
            key,
            contentType: file.mimetype || 'video/webm',
            body: file.buffer,
        });
        const s = await this.prisma.stream.findUnique({ where: { uuid: streamUuid } });
        if (s) {
            await this.prisma.stream.update({
                where: { id: s.id },
                data: { fileUrls: { set: [...(s.fileUrls ?? []), uploaded.url] } },
            });
        }
        return uploaded;
    }
    async uploadThumbnail(req, file) {
        if (!file)
            throw new common_1.BadRequestException('Missing file');
        const streamUuid = req.query.streamUuid ??
            req.body?.streamUuid;
        if (!streamUuid)
            throw new common_1.BadRequestException('Missing streamUuid');
        const ext = path.extname(file.originalname) || '.jpg';
        const key = this.uploads.makeKey(`streams/${streamUuid}/thumbnails`, ext);
        return await this.uploads.putBuffer({
            key,
            contentType: file.mimetype || 'image/jpeg',
            body: file.buffer,
        });
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('clip'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 1024 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadClip", null);
__decorate([
    (0, common_1.Post)('thumbnail'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 20 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadThumbnail", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        uploads_service_1.UploadsService,
        prisma_service_1.PrismaService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map