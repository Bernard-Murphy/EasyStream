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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const s3_1 = require("../s3/s3");
const fs = __importStar(require("fs/promises"));
const fsSync = __importStar(require("fs"));
const path = __importStar(require("path"));
let UploadsService = class UploadsService {
    config;
    constructor(config) {
        this.config = config;
    }
    makeKey(prefix, ext) {
        return `${prefix}/${Date.now()}-${(0, crypto_1.randomUUID)()}${ext}`;
    }
    async putBuffer(params) {
        const bucket = this.config.get('STORJ_BUCKET');
        const endpoint = this.config.get('STORJ_ENDPOINT');
        const accessKey = this.config.get('STORJ_SECRET_ACCESS_ID');
        const secretKey = this.config.get('STORJ_SECRET_ACCESS_KEY');
        if (bucket && endpoint && accessKey && secretKey) {
            await s3_1.s3
                .putObject({
                Bucket: bucket,
                Key: params.key,
                Body: params.body,
                ContentType: params.contentType,
            })
                .promise();
            const url = `${endpoint.replace(/\/$/, '')}/${bucket}/${params.key}`;
            return { url, key: params.key };
        }
        const root = '/tmp/easystream-uploads';
        const filePath = path.join(root, params.key);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, params.body);
        const url = `http://localhost:${this.config.get('API_PORT') ?? 4000}/uploads/${params.key}`;
        return { url, key: params.key };
    }
    async putFile(params) {
        const bucket = this.config.get('STORJ_BUCKET');
        const endpoint = this.config.get('STORJ_ENDPOINT');
        const accessKey = this.config.get('STORJ_SECRET_ACCESS_ID');
        const secretKey = this.config.get('STORJ_SECRET_ACCESS_KEY');
        if (bucket && endpoint && accessKey && secretKey) {
            await s3_1.s3
                .upload({
                Bucket: bucket,
                Key: params.key,
                Body: fsSync.createReadStream(params.filePath),
                ContentType: params.contentType,
            })
                .promise();
            const url = `${endpoint.replace(/\/$/, '')}/${bucket}/${params.key}`;
            return { url, key: params.key };
        }
        const root = '/tmp/easystream-uploads';
        const outPath = path.join(root, params.key);
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.copyFile(params.filePath, outPath);
        const url = `http://localhost:${this.config.get('API_PORT') ?? 4000}/uploads/${params.key}`;
        return { url, key: params.key };
    }
    getLocalPathFromKey(key) {
        return path.join('/tmp/easystream-uploads', key);
    }
    extractKeyFromUrl(url) {
        const marker = '/uploads/';
        const idx = url.indexOf(marker);
        if (idx >= 0)
            return url.slice(idx + marker.length);
        const endpoint = this.config.get('STORJ_ENDPOINT');
        const bucket = this.config.get('STORJ_BUCKET');
        if (endpoint && bucket) {
            const base = `${endpoint.replace(/\/$/, '')}/${bucket}/`;
            if (url.startsWith(base))
                return url.slice(base.length);
        }
        return null;
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map