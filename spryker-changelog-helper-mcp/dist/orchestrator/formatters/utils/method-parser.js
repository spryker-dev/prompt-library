"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodParser = void 0;
class MethodParser {
    static parseSignature(fqcn) {
        const parts = fqcn.split('::');
        const fullClass = parts[0] || '';
        const className = fullClass.split('\\').pop() || '';
        const methodName = parts[1] || '';
        return { className, methodName, fullClass };
    }
    static formatMethodCall(fqcn) {
        const { className, methodName } = this.parseSignature(fqcn);
        return `${className}::${methodName}()`;
    }
    static getChangeEmoji(changeType) {
        const emojiMap = {
            'added': '➕',
            'deleted': '➖',
            'modified': '✏️',
            'new': '➕',
            'removed': '➖',
        };
        return emojiMap[changeType] || '•';
    }
}
exports.MethodParser = MethodParser;
//# sourceMappingURL=method-parser.js.map