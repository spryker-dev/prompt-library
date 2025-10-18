"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhpDocParser = void 0;
const php_doc_patterns_1 = require("../constants/php-doc-patterns");
class PhpDocParser {
    static parse(docText) {
        if (!docText) {
            return {};
        }
        const { AnalyzerConfig } = require('../../orchestrator/config/analyzer-config');
        const description = this.extractDescription(docText);
        const isApiMethod = docText.includes(AnalyzerConfig.phpDocAnnotations.api);
        const isDeprecated = docText.includes(AnalyzerConfig.phpDocAnnotations.deprecated);
        return { description, isApiMethod, isDeprecated };
    }
    static extractDescription(docText) {
        const lines = [];
        const docLines = docText.split('\n');
        for (const line of docLines) {
            const trimmed = line.replace(php_doc_patterns_1.PhpDocMarker.LINE_PREFIX, '').trim();
            if (this.shouldSkipLine(trimmed)) {
                continue;
            }
            if (trimmed.startsWith(php_doc_patterns_1.PhpDocMarker.TAG_PREFIX)) {
                break;
            }
            lines.push(trimmed);
        }
        return lines.length > 0 ? lines.join(' ').trim() : undefined;
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
    static shouldSkipLine(trimmed) {
        return trimmed.startsWith(php_doc_patterns_1.PhpDocMarker.DOC_START) ||
            trimmed.startsWith(php_doc_patterns_1.PhpDocMarker.DOC_END) ||
            trimmed === '';
    }
}
exports.PhpDocParser = PhpDocParser;
//# sourceMappingURL=php-doc-parser.js.map