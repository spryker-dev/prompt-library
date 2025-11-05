"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonicalNameUtils = void 0;
exports.ensureFqn = ensureFqn;
exports.canonFqn = canonFqn;
exports.canonMethod = canonMethod;
exports.canonKey = canonKey;
function ensureFqn(name) {
    const s = String(name || '');
    return s.startsWith('\\') ? s : '\\' + s;
}
function canonFqn(name) {
    const raw = String(name || '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
    const noTrailing = raw.replace(/\\+$/, '');
    const withLeading = noTrailing.startsWith('\\') ? noTrailing : '\\' + noTrailing;
    return withLeading.replace(/\\\\+/g, '\\').toLowerCase();
}
function canonMethod(methodName) {
    return String(methodName || '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, '')
        .replace(/\(\)$/, '')
        .trim()
        .toLowerCase();
}
function canonKey(fqn, method) {
    return `${canonFqn(fqn)}::${canonMethod(method)}`;
}
class CanonicalNameUtils {
}
exports.CanonicalNameUtils = CanonicalNameUtils;
CanonicalNameUtils.ensureFqn = ensureFqn;
CanonicalNameUtils.canonFqn = canonFqn;
CanonicalNameUtils.canonMethod = canonMethod;
CanonicalNameUtils.canonKey = canonKey;
//# sourceMappingURL=canonical.js.map