"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnonSession = createAnonSession;
const crypto_1 = require("crypto");
const TEXT_COLORS = [
    '#111827',
    '#1f2937',
    '#0f172a',
    '#172554',
    '#3f1d0b',
];
const BG_COLORS = [
    '#fef3c7',
    '#dbeafe',
    '#dcfce7',
    '#fce7f3',
    '#e0e7ff',
];
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function createAnonSession() {
    const uuid = (0, crypto_1.randomUUID)().slice(0, 8);
    return {
        anon_id: `anon-${uuid}`,
        anon_text_color: pick(TEXT_COLORS),
        anon_background_color: pick(BG_COLORS),
    };
}
//# sourceMappingURL=anon.js.map