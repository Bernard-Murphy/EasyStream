"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAssemblePlan = buildAssemblePlan;
function buildAssemblePlan(req) {
    const groups = [];
    let current = [];
    let total = 0;
    let partIndex = 0;
    for (let i = 0; i < req.clipUrls.length; i++) {
        const url = req.clipUrls[i];
        const mb = req.clipSizesMb[i] ?? 0;
        if (current.length > 0 && total + mb > req.streamLengthMb) {
            groups.push({ partIndex, clipUrls: current, totalMb: total });
            partIndex += 1;
            current = [];
            total = 0;
        }
        current.push(url);
        total += mb;
    }
    if (current.length > 0) {
        groups.push({ partIndex, clipUrls: current, totalMb: total });
    }
    return { streamUuid: req.streamUuid, groups };
}
//# sourceMappingURL=assemble-plan.js.map