"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferChangeType = exports.ConstraintChangeType = exports.VersionChangeType = exports.InternalChangeType = exports.ChangeType = void 0;
exports.ChangeType = {
    NEW: 'new',
    MODIFIED: 'modified',
    REMOVED: 'removed',
    ADDED: 'added',
    DELETED: 'deleted',
    NONE: 'none',
};
exports.InternalChangeType = {
    IMPLEMENTATION: 'implementation',
    SIGNATURE: 'signature',
};
exports.VersionChangeType = {
    ADDED: 'added',
    REMOVED: 'removed',
    UPGRADED: 'upgraded',
    DOWNGRADED: 'downgraded',
    UNCHANGED: 'unchanged',
};
exports.ConstraintChangeType = {
    MAJOR: 'major',
    MINOR: 'minor',
    PATCH: 'patch',
    RELAXED: 'relaxed',
    TIGHTENED: 'tightened',
    UNCHANGED: 'unchanged',
};
exports.TransferChangeType = {
    STRICT_ADDED: 'strictAdded',
    STRICT_REMOVED: 'strictRemoved',
    PROPERTY_ADDED: 'propertyAdded',
    PROPERTY_REMOVED: 'propertyRemoved',
    PROPERTY_MODIFIED: 'propertyModified',
};
//# sourceMappingURL=change-constants.js.map