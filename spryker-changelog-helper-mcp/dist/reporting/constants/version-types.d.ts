export declare const VersionBumpType: {
    readonly MAJOR: "MAJOR";
    readonly MINOR: "MINOR";
    readonly PATCH: "PATCH";
};
export declare const ConfidenceLevel: {
    readonly HIGH: "high";
    readonly MEDIUM: "medium";
    readonly LOW: "low";
};
export type VersionBumpTypeValue = typeof VersionBumpType[keyof typeof VersionBumpType];
export type ConfidenceLevelValue = typeof ConfidenceLevel[keyof typeof ConfidenceLevel];
import { ConfidenceLevel, VersionBumpType } from './version-types';
//# sourceMappingURL=version-types.d.ts.map