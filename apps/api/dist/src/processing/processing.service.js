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
var ProcessingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const uploads_service_1 = require("../uploads/uploads.service");
const assemble_plan_1 = require("./assemble-plan");
const s3_1 = require("../s3/s3");
const fs = __importStar(require("fs/promises"));
const fsSync = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
let ProcessingService = ProcessingService_1 = class ProcessingService {
    prisma;
    uploads;
    config;
    logger = new common_1.Logger(ProcessingService_1.name);
    constructor(prisma, uploads, config) {
        this.prisma = prisma;
        this.uploads = uploads;
        this.config = config;
    }
    async processStreamToPast(streamUuid) {
        const stream = await this.prisma.stream.findUnique({ where: { uuid: streamUuid } });
        if (!stream)
            return;
        const clipUrls = stream.fileUrls ?? [];
        const streamLengthMb = Number(this.config.get('STREAM_LENGTH') ?? 250);
        const clipSizesMb = await Promise.all(clipUrls.map(async (url) => {
            const key = this.uploads.extractKeyFromUrl(url);
            if (!key)
                return 0;
            const localPath = this.uploads.getLocalPathFromKey(key);
            if (fsSync.existsSync(localPath)) {
                const st = await fs.stat(localPath);
                return st.size / (1024 * 1024);
            }
            const bucket = this.config.get('STORJ_BUCKET');
            if (!bucket)
                return 0;
            const head = await s3_1.s3.headObject({ Bucket: bucket, Key: key }).promise();
            return (head.ContentLength ?? 0) / (1024 * 1024);
        }));
        const plan = (0, assemble_plan_1.buildAssemblePlan)({
            streamUuid,
            clipUrls,
            clipSizesMb,
            streamLengthMb,
        });
        const assembledUrls = [];
        const tmpRoot = path.join('/tmp', 'easystream-processing', streamUuid, `${Date.now()}`);
        await fs.mkdir(tmpRoot, { recursive: true });
        for (const group of plan.groups) {
            const partKey = this.uploads.makeKey(`streams/${streamUuid}/assembled`, '.webm');
            const outPath = path.join(tmpRoot, `part-${group.partIndex}.webm`);
            const concatListPath = path.join(tmpRoot, `concat-${group.partIndex}.txt`);
            const inputs = [];
            for (const url of group.clipUrls) {
                const key = this.uploads.extractKeyFromUrl(url);
                if (!key)
                    continue;
                const localPath = this.uploads.getLocalPathFromKey(key);
                if (fsSync.existsSync(localPath)) {
                    inputs.push(localPath);
                    continue;
                }
                const bucket = this.config.get('STORJ_BUCKET');
                if (!bucket)
                    continue;
                const dlPath = path.join(tmpRoot, path.basename(key));
                await new Promise((resolve, reject) => {
                    const rs = s3_1.s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
                    const ws = fsSync.createWriteStream(dlPath);
                    rs.on('error', reject);
                    ws.on('error', reject);
                    ws.on('finish', () => resolve());
                    rs.pipe(ws);
                });
                inputs.push(dlPath);
            }
            if (inputs.length === 0)
                continue;
            const concatList = inputs.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n') + '\n';
            await fs.writeFile(concatListPath, concatList);
            await this.runFfmpegConcat(concatListPath, outPath);
            const uploaded = await this.uploads.putFile({
                key: partKey,
                contentType: 'video/webm',
                filePath: outPath,
            });
            assembledUrls.push(uploaded.url);
        }
        await this.deleteClipsBestEffort(clipUrls);
        await this.prisma.stream.update({
            where: { uuid: streamUuid },
            data: {
                status: 'past',
                fileUrls: assembledUrls,
            },
        });
    }
    async runFfmpegConcat(listPath, outPath) {
        await new Promise((resolve, reject) => {
            const p = (0, child_process_1.spawn)('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outPath], {
                stdio: ['ignore', 'pipe', 'pipe'],
            });
            let stderr = '';
            p.stderr.on('data', (d) => (stderr += d.toString()));
            p.on('error', reject);
            p.on('close', (code) => {
                if (code === 0)
                    resolve();
                else
                    reject(new Error(`ffmpeg failed (${code}): ${stderr.slice(-2000)}`));
            });
        });
    }
    async deleteClipsBestEffort(urls) {
        const bucket = this.config.get('STORJ_BUCKET');
        const endpoint = this.config.get('STORJ_ENDPOINT');
        const accessKey = this.config.get('STORJ_SECRET_ACCESS_ID');
        const secretKey = this.config.get('STORJ_SECRET_ACCESS_KEY');
        const keys = [];
        for (const url of urls) {
            const key = this.uploads.extractKeyFromUrl(url);
            if (key)
                keys.push(key);
        }
        for (const key of keys) {
            const p = this.uploads.getLocalPathFromKey(key);
            if (fsSync.existsSync(p)) {
                try {
                    await fs.unlink(p);
                }
                catch {
                }
            }
        }
        if (bucket && endpoint && accessKey && secretKey && keys.length > 0) {
            try {
                await s3_1.s3
                    .deleteObjects({
                    Bucket: bucket,
                    Delete: { Objects: keys.map((Key) => ({ Key })) },
                })
                    .promise();
            }
            catch (e) {
                this.logger.warn(`Failed deleting clips from s3: ${e?.message ?? e}`);
            }
        }
    }
};
exports.ProcessingService = ProcessingService;
exports.ProcessingService = ProcessingService = ProcessingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        uploads_service_1.UploadsService,
        config_1.ConfigService])
], ProcessingService);
//# sourceMappingURL=processing.service.js.map