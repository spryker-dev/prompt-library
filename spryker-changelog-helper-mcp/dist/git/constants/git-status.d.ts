export declare const GitStatus: {
    readonly ADDED: "A";
    readonly DELETED: "D";
    readonly MODIFIED: "M";
    readonly RENAMED: "R";
    readonly COPIED: "C";
};
export declare const DiffMarkers: {
    readonly NEW_FILE: "new file mode";
    readonly DELETED_FILE: "deleted file mode";
    readonly BLOCK_MARKER: "@@";
};
export declare const DiffPrefixes: {
    readonly ADDITION: "+";
    readonly REMOVAL: "-";
    readonly ADDITION_FILE: "+++";
    readonly REMOVAL_FILE: "---";
    readonly CONTEXT: " ";
};
export declare const DiffSettings: {
    readonly CONTEXT_LINES: 10;
};
export type GitStatusType = typeof GitStatus[keyof typeof GitStatus];
import { GitStatus } from './git-status';
//# sourceMappingURL=git-status.d.ts.map