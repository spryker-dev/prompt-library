"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogDetail = exports.ChangelogAction = exports.ChangelogType = void 0;
exports.ChangelogType = {
    METHOD: 'method',
    PLUGIN: 'plugin',
    CLASS: 'class',
    CONSTANT: 'constant',
    TRANSFER: 'transfer',
    SCHEMA: 'schema',
    COMPOSER: 'composer',
    CONFIG: 'config',
};
exports.ChangelogAction = {
    ADDED: 'added',
    REMOVED: 'removed',
    MODIFIED: 'modified',
    IMPROVED: 'improved',
    ADJUSTED: 'adjusted',
    DEPRECATED: 'deprecated',
};
exports.ChangelogDetail = {
    BREAKING: 'breaking',
    SIGNATURE_CHANGED: 'signature changed',
    VISIBILITY_CHANGED: 'visibility changed',
    RETURN_TYPE_CHANGED: 'return type changed',
    PARAMETERS_CHANGED: 'parameters changed',
};
//# sourceMappingURL=changelog-types.js.map