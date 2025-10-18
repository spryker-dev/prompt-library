export declare const SkipReason: {
    readonly NO_CLASS_NAME: "Could not extract class name from file path";
    readonly PARSE_ERROR: "Failed to parse diff";
    readonly GIT_ERROR: "Git command failed";
    readonly UNKNOWN_ERROR: "Unknown error occurred";
    readonly EMPTY_DIFF: "Empty diff content";
    readonly INVALID_FILE: "Invalid file format";
};
export type SkipReasonValue = typeof SkipReason[keyof typeof SkipReason];
import { SkipReason } from './error-messages';
//# sourceMappingURL=error-messages.d.ts.map