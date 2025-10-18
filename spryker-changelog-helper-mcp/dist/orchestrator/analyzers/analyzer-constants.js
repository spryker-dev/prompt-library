"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSFER_CHANGE_TYPES = exports.DIFF_BLOCK_MARKER = exports.XML_ATTRIBUTES = exports.SCHEMA_TAGS = exports.COMPOSER_KEYS = exports.FILE_PATTERNS = exports.DIFF_PREFIXES = exports.DIFF_MARKERS = exports.CONSTRAINT_CHANGE_TYPES = exports.VERSION_CHANGE_TYPES = exports.CHANGE_TYPES = void 0;
exports.CHANGE_TYPES = {
    new: 'new',
    modified: 'modified',
    removed: 'removed',
    added: 'added',
};
exports.VERSION_CHANGE_TYPES = {
    added: 'added',
    removed: 'removed',
    upgraded: 'upgraded',
    downgraded: 'downgraded',
    unchanged: 'unchanged',
};
exports.CONSTRAINT_CHANGE_TYPES = {
    major: 'major',
    minor: 'minor',
    patch: 'patch',
    relaxed: 'relaxed',
    tightened: 'tightened',
    unchanged: 'unchanged',
};
exports.DIFF_MARKERS = {
    newFile: 'new file mode',
    deletedFile: 'deleted file mode',
    orOperator: '||',
};
exports.DIFF_PREFIXES = {
    added: '+',
    removed: '-',
    unchanged: ' ',
};
exports.FILE_PATTERNS = {
    composerJson: 'composer.json',
    schemaXml: '.schema.xml',
    transferXml: '.transfer.xml',
    phpExtension: '.php',
};
exports.COMPOSER_KEYS = {
    require: 'require',
    requireDev: 'require-dev',
    php: 'php',
};
exports.SCHEMA_TAGS = {
    column: '<column name=',
    index: '<index',
    indexName: '<index name=',
    indexClose: '</index>',
    indexColumn: '<index-column name=',
    table: '<table name=',
};
exports.XML_ATTRIBUTES = {
    strict: 'strict=',
    trueValue: 'true',
};
exports.DIFF_BLOCK_MARKER = '@@';
exports.TRANSFER_CHANGE_TYPES = {
    strictAdded: 'strictAdded',
    strictRemoved: 'strictRemoved',
    propertyAdded: 'propertyAdded',
    propertyRemoved: 'propertyRemoved',
    propertyModified: 'propertyModified',
};
//# sourceMappingURL=analyzer-constants.js.map