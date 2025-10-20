"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodVisibility = exports.PhpDocMarker = exports.PhpDocPattern = void 0;
exports.PhpDocPattern = {
    FACTORY_METHOD: /@method\s+\\?([A-Za-z_][\w\\]+)\s+get(?:BusinessFactory|Factory)\s*\(/,
    VAR_TYPE: /@var\s+([^\s*]+)/i,
};
exports.PhpDocMarker = {
    DOC_START: '/**',
    DOC_END: '*/',
    LINE_PREFIX: /^\s*\*\s?/,
    TAG_PREFIX: '@',
};
exports.MethodVisibility = {
    PUBLIC: 'public',
    PROTECTED: 'protected',
    PRIVATE: 'private',
};
//# sourceMappingURL=php-doc-patterns.js.map