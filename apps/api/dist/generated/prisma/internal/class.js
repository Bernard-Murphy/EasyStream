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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.2.0",
    "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
    "activeProvider": "postgresql",
    "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nenum StreamStatus {\n  live\n  processing\n  past\n}\n\nmodel Stream {\n  id                    Int          @id @default(autoincrement())\n  uuid                  String       @unique\n  start_time            DateTime\n  end_time              DateTime?\n  anon_id               String\n  anon_text_color       String\n  anon_background_color String\n  title                 String\n  description           String\n  status                StreamStatus\n  removed               Boolean      @default(false)\n  fileUrls              String[]\n  thumbnailUrl          String?\n\n  positions    StreamPosition[]\n  chatMessages ChatMessage[]\n}\n\nmodel StreamPosition {\n  id        Int      @id @default(autoincrement())\n  stream_id Int\n  stage     Int // Streamer will be stage 0\n  peer_id   String\n  parents   String[]\n  children  String[]\n\n  stream Stream @relation(fields: [stream_id], references: [id], onDelete: Cascade)\n\n  @@unique([stream_id, peer_id])\n  @@index([stream_id, stage])\n}\n\nmodel ChatMessage {\n  id                    Int      @id @default(autoincrement())\n  uuid                  String   @unique\n  create_date           DateTime @default(now())\n  anon_id               String\n  anon_text_color       String\n  anon_background_color String\n  name                  String?\n  message               String\n  removed               Boolean  @default(false)\n  stream_id             Int\n\n  stream Stream @relation(fields: [stream_id], references: [id], onDelete: Cascade)\n\n  @@index([stream_id, create_date])\n}\n\nmodel User {\n  id            Int      @id @default(autoincrement())\n  username      String   @unique\n  email         String   @unique\n  create_date   DateTime @default(now())\n  password_hash String\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"Stream\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"uuid\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"start_time\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"end_time\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"anon_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"anon_text_color\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"anon_background_color\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"StreamStatus\"},{\"name\":\"removed\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"fileUrls\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"thumbnailUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"positions\",\"kind\":\"object\",\"type\":\"StreamPosition\",\"relationName\":\"StreamToStreamPosition\"},{\"name\":\"chatMessages\",\"kind\":\"object\",\"type\":\"ChatMessage\",\"relationName\":\"ChatMessageToStream\"}],\"dbName\":null},\"StreamPosition\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"stream_id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"stage\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"peer_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"parents\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"children\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stream\",\"kind\":\"object\",\"type\":\"Stream\",\"relationName\":\"StreamToStreamPosition\"}],\"dbName\":null},\"ChatMessage\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"uuid\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"create_date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"anon_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"anon_text_color\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"anon_background_color\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"message\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"removed\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"stream_id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"stream\",\"kind\":\"object\",\"type\":\"Stream\",\"relationName\":\"ChatMessageToStream\"}],\"dbName\":null},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"create_date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"password_hash\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.postgresql.mjs"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
    }
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map