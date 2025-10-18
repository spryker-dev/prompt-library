"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyTypeExtractor = void 0;
const name_resolver_1 = require("../utils/name-resolver");
class PropertyTypeExtractor {
    static extractVarFqnFromDoc(text, currentNs, currentUses) {
        if (!text)
            return null;
        const match = text.match(/@var\s+([^\s*]+)/i);
        if (!match)
            return null;
        for (const part of match[1].split('|')) {
            const raw = part.replace(/\[\]$/, '').trim();
            if (!raw || /^(int|float|string|bool|array|iterable|callable|mixed|object|null)$/i.test(raw)) {
                continue;
            }
            const fake = raw.startsWith('\\')
                ? { kind: 'name', name: raw, resolution: 'fqn' }
                : { kind: 'name', name: raw, resolution: null };
            const fqn = name_resolver_1.NameResolver.resolveName(fake, currentNs, currentUses);
            if (fqn)
                return fqn;
        }
        return null;
    }
    static collectCommentText(node) {
        const chunks = [];
        if (Array.isArray(node.leadingComments)) {
            chunks.push(...node.leadingComments.map((c) => c.value || ''));
        }
        if (node.doc && typeof node.doc === 'string') {
            chunks.push(node.doc);
        }
        if (Array.isArray(node.comments)) {
            chunks.push(...node.comments.map((c) => c.value || ''));
        }
        return chunks.join('\n');
    }
}
exports.PropertyTypeExtractor = PropertyTypeExtractor;
//# sourceMappingURL=property-type-extractor.js.map