"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposerKey = exports.TransferSchema = exports.XmlAttribute = exports.SchemaTag = exports.XmlPattern = exports.PhpPattern = void 0;
exports.PhpPattern = {
    METHOD_SIGNATURE: /^\s*(?:public|protected|private)?\s*(?:static\s+)?function\s+(\w+)/,
    DIFF_METHOD_SIGNATURE: /^([+ -])\s*(public|protected|private)\s+(?:static\s+)?function\s+(\w+)\s*\(/,
    VISIBILITY_MODIFIER: /^\s*(public|protected|private)/,
    CLOSING_BRACE: /^\s*}\s*$/,
    CLASS_NAME: /class\s+(\w+)/,
    NAMESPACE: /namespace\s+([\w\\]+)/,
    CLASS_NAME_FROM_PATH: /\/([^\/]+)\.php$/,
};
exports.XmlPattern = {
    TRANSFER_OPEN: /<transfer\s+name="([^"]+)"/g,
    TRANSFER_CLOSE: '</transfer>',
    PROPERTY_OPEN: /<property\s+name="([^"]+)"/g,
};
exports.SchemaTag = {
    COLUMN: '<column name=',
    INDEX: '<index',
    INDEX_NAME: '<index name=',
    INDEX_CLOSE: '</index>',
    INDEX_COLUMN: '<index-column name=',
    TABLE: '<table name=',
};
exports.XmlAttribute = {
    STRICT: 'strict=',
    TRUE_VALUE: 'true',
};
exports.TransferSchema = {
    PROPERTY_TAG: 'property',
    NAME_ATTRIBUTE: 'name',
    TYPE_ATTRIBUTE: 'type',
};
exports.ComposerKey = {
    REQUIRE: 'require',
    REQUIRE_DEV: 'require-dev',
    PHP: 'php',
};
//# sourceMappingURL=php-constants.js.map