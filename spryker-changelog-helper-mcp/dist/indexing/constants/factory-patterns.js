"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryPattern = void 0;
exports.FactoryPattern = {
    CLASS_SUFFIX: /Factory$/,
    METHOD_PREFIXES: ['create', 'get'],
    METHOD_ANNOTATION: /@method\s+([^\s]+)\s+(\w+)\s*\(/gi,
    RETURN_ANNOTATION: /@return\s+([^\s*]+)/i,
};
//# sourceMappingURL=factory-patterns.js.map