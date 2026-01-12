"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({
    region: process.env.REGION || 'us-east-1',
});
exports.s3 = new aws_sdk_1.default.S3({
    endpoint: process.env.STORJ_ENDPOINT,
    credentials: {
        accessKeyId: process.env.STORJ_SECRET_ACCESS_ID,
        secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY,
    },
});
//# sourceMappingURL=s3.js.map