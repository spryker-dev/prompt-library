export declare const ChangeType: {
    readonly NEW: "new";
    readonly MODIFIED: "modified";
    readonly REMOVED: "removed";
    readonly ADDED: "added";
    readonly DELETED: "deleted";
    readonly NONE: "none";
};
export declare const InternalChangeType: {
    readonly IMPLEMENTATION: "implementation";
    readonly SIGNATURE: "signature";
};
export declare const VersionChangeType: {
    readonly ADDED: "added";
    readonly REMOVED: "removed";
    readonly UPGRADED: "upgraded";
    readonly DOWNGRADED: "downgraded";
    readonly UNCHANGED: "unchanged";
};
export declare const ConstraintChangeType: {
    readonly MAJOR: "major";
    readonly MINOR: "minor";
    readonly PATCH: "patch";
    readonly RELAXED: "relaxed";
    readonly TIGHTENED: "tightened";
    readonly UNCHANGED: "unchanged";
};
export declare const TransferChangeType: {
    readonly STRICT_ADDED: "strictAdded";
    readonly STRICT_REMOVED: "strictRemoved";
    readonly PROPERTY_ADDED: "propertyAdded";
    readonly PROPERTY_REMOVED: "propertyRemoved";
    readonly PROPERTY_MODIFIED: "propertyModified";
};
export type ChangeTypeValue = typeof ChangeType[keyof typeof ChangeType];
export type InternalChangeTypeValue = typeof InternalChangeType[keyof typeof InternalChangeType];
import { ChangeType, InternalChangeType } from './change-types';
//# sourceMappingURL=change-types.d.ts.map