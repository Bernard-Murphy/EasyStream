"use strict";
/**
 * EasyStream Lambda - Assemble uploaded clips into larger stream files.
 *
 * - Download clips from Storj (S3 compatible)
 * - Concatenate them in order into parts of max STREAM_LENGTH_MB (by total clip size)
 * - Upload assembled parts back to Storj
 * - Delete original clips
 *
 * Notes:
 * - This lambda expects ffmpeg to be available in the runtime (either baked in or via a Lambda Layer).
 *   You can override with FFMPEG_PATH env var (default: "ffmpeg").
 * - Storj is used via AWS SDK v2 with the provided config requirement (no forcePathStyle/signatureVersion).
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
exports.buildAssemblePlan = buildAssemblePlan;
exports.handler = handler;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs = __importStar(require("fs/promises"));
const fsSync = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
const child_process_1 = require("child_process");
aws_sdk_1.default.config.update({
    region: process.env.REGION || 'us-east-1',
});
exports.s3 = new aws_sdk_1.default.S3({
    endpoint: process.env.STORJ_ENDPOINT,
    credentials: {
        accessKeyId: process.env.STORJ_SECRET_ACCESS_ID,
        secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY,
    },
}); // do not use s3ForcePathStyle or signatureVersion
function buildAssemblePlan(req) {
    const clipKeys = req.clipKeys ?? [];
    const clipSizesMb = req.clipSizesMb ?? [];
    const streamLengthMb = req.streamLengthMb ?? Number(process.env.STREAM_LENGTH ?? 250);
    const groups = [];
    let current = [];
    let total = 0;
    let partIndex = 0;
    for (let i = 0; i < clipKeys.length; i++) {
        const key = clipKeys[i];
        const mb = clipSizesMb[i] ?? 0;
        if (current.length > 0 && total + mb > streamLengthMb) {
            groups.push({ partIndex, clipKeys: current, totalMb: total });
            partIndex += 1;
            current = [];
            total = 0;
        }
        current.push(key);
        total += mb;
    }
    if (current.length > 0) {
        groups.push({ partIndex, clipKeys: current, totalMb: total });
    }
    return { streamUuid: req.streamUuid, groups };
}
function requireEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env var: ${name}`);
    return v;
}
function extractKeyFromUrl(url) {
    // For Storj: ${STORJ_ENDPOINT}/${STORJ_BUCKET}/${key}
    const endpoint = process.env.STORJ_ENDPOINT;
    const bucket = process.env.STORJ_BUCKET;
    if (!endpoint || !bucket)
        return null;
    const base = `${endpoint.replace(/\/$/, '')}/${bucket}/`;
    if (!url.startsWith(base))
        return null;
    return url.slice(base.length);
}
async function headSizeMb(bucket, key) {
    const head = await exports.s3.headObject({ Bucket: bucket, Key: key }).promise();
    return (head.ContentLength ?? 0) / (1024 * 1024);
}
async function downloadToFile(bucket, key, outPath) {
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await new Promise((resolve, reject) => {
        const rs = exports.s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
        const ws = fsSync.createWriteStream(outPath);
        rs.on('error', reject);
        ws.on('error', reject);
        ws.on('finish', () => resolve());
        rs.pipe(ws);
    });
}
async function uploadFile(bucket, key, filePath) {
    await exports.s3
        .upload({
        Bucket: bucket,
        Key: key,
        Body: fsSync.createReadStream(filePath),
        ContentType: 'video/webm',
    })
        .promise();
}
async function runFfmpegConcat(listPath, outPath) {
    const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    await new Promise((resolve, reject) => {
        const p = (0, child_process_1.spawn)(ffmpegPath, ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outPath], { stdio: ['ignore', 'pipe', 'pipe'] });
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
// AWS Lambda handler
async function handler(event) {
    const bucket = requireEnv('STORJ_BUCKET');
    const clipKeys = event.clipKeys ??
        (event.clipUrls ?? [])
            .map((u) => extractKeyFromUrl(u))
            .filter((k) => !!k);
    if (clipKeys.length === 0) {
        return {
            streamUuid: event.streamUuid,
            assembled: [],
            deletedClipKeys: [],
            plan: { streamUuid: event.streamUuid, groups: [] },
        };
    }
    const clipSizesMb = event.clipSizesMb && event.clipSizesMb.length === clipKeys.length
        ? event.clipSizesMb
        : await Promise.all(clipKeys.map((k) => headSizeMb(bucket, k)));
    const plan = buildAssemblePlan({
        ...event,
        clipKeys,
        clipSizesMb,
        streamLengthMb: event.streamLengthMb ?? Number(process.env.STREAM_LENGTH ?? 250),
    });
    const outputPrefix = event.outputPrefix ?? `streams/${event.streamUuid}/assembled`;
    const tmpRoot = path.join('/tmp', 'easystream-lambda', event.streamUuid, `${Date.now()}`);
    await fs.mkdir(tmpRoot, { recursive: true });
    const assembled = [];
    for (const group of plan.groups) {
        const partKey = `${outputPrefix}/${group.partIndex}-${(0, crypto_1.randomUUID)()}.webm`;
        const outPath = path.join(tmpRoot, `part-${group.partIndex}.webm`);
        const listPath = path.join(tmpRoot, `concat-${group.partIndex}.txt`);
        const localInputs = [];
        for (const key of group.clipKeys) {
            const localPath = path.join(tmpRoot, 'clips', key.replace(/\//g, '_'));
            await downloadToFile(bucket, key, localPath);
            localInputs.push(localPath);
        }
        const concatList = localInputs.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n') + '\n';
        await fs.writeFile(listPath, concatList);
        await runFfmpegConcat(listPath, outPath);
        await uploadFile(bucket, partKey, outPath);
        const endpoint = requireEnv('STORJ_ENDPOINT').replace(/\/$/, '');
        const url = `${endpoint}/${bucket}/${partKey}`;
        assembled.push({ partIndex: group.partIndex, key: partKey, url, totalMb: group.totalMb });
    }
    const deletedClipKeys = [];
    if (event.deleteClips !== false) {
        const toDelete = clipKeys.map((Key) => ({ Key }));
        // delete in batches of 1000
        for (let i = 0; i < toDelete.length; i += 1000) {
            const batch = toDelete.slice(i, i + 1000);
            await exports.s3.deleteObjects({ Bucket: bucket, Delete: { Objects: batch } }).promise();
        }
        deletedClipKeys.push(...clipKeys);
    }
    return { streamUuid: event.streamUuid, assembled, deletedClipKeys, plan };
}
