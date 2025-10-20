"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyTypeExtractor = void 0;
const name_resolver_1 = require("../../utils/name-resolver");
const php_doc_patterns_1 = require("../constants/php-doc-patterns");
const PRIMITIVE_TYPES = /^(int|float|string|bool|array|iterable|callable|mixed|object|null)$/i;
class PropertyTypeExtractor {
    static extractVarFqnFromDoc(text, currentNamespace, currentUses) {
        if (!text)
            return null;
        const match = text.match(php_doc_patterns_1.PhpDocPattern.VAR_TYPE);
        if (!match)
            return null;
        return this.resolveFirstNonPrimitiveType(match[1], currentNamespace, currentUses);
    }
    static resolveFirstNonPrimitiveType(typeString, currentNamespace, currentUses) {
        for (const part of typeString.split('|')) {
            const cleanType = part.replace(/\[\]$/, '').trim();
            if (!cleanType || PRIMITIVE_TYPES.test(cleanType)) {
                continue;
            }
            const fqn = this.resolveSingleType(cleanType, currentNamespace, currentUses);
            if (fqn)
                return fqn;
        }
        return null;
    }
    static resolveSingleType(rawType, currentNamespace, currentUses) {
        const nameNode = rawType.startsWith('\\')
            ? { kind: 'name', name: rawType, resolution: 'fqn' }
            : { kind: 'name', name: rawType, resolution: null };
        return name_resolver_1.NameResolver.resolveName(nameNode, currentNamespace, currentUses);
    }
    static collectCommentText(node) {
        const chunks = [];
        const addComment = (comment) => {
            if (comment && typeof comment.value === 'string') {
                chunks.push(comment.value);
            }
        };
        if (Array.isArray(node.leadingComments)) {
            node.leadingComments.forEach(addComment);
        }
        if (Array.isArray(node.comments)) {
            node.comments.forEach(addComment);
        }
        return chunks.join('\n');
    }
}
exports.PropertyTypeExtractor = PropertyTypeExtractor;
//# sourceMappingURL=property-type-extractor.js.map