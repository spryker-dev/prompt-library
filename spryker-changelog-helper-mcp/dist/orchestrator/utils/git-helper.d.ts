export declare class GitHelper {
    private root;
    private modules?;
    constructor(root: string, modules?: string[] | undefined);
    getMergeBase(baseRef: string): string;
    getAllChangedFiles(baseCommit: string): string[];
    getFileDiff(baseCommit: string, file: string): string;
    getFileContent(ref: string, file: string): string;
    getCurrentFileContent(file: string): string;
    mapGitStatusToChangeType(status: string): 'added' | 'modified' | 'deleted';
}
//# sourceMappingURL=git-helper.d.ts.map