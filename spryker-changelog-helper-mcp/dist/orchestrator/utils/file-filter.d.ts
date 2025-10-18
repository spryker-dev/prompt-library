import { NonPhpFile } from '../diff-analyzer';
export declare class FileFilter {
    private includeTests;
    constructor(includeTests: boolean);
    filterPhpFiles(gitStatusLines: string[]): string[];
    filterPhpFilesWithStatus(gitStatusLines: string[]): Array<{
        status: string;
        file: string;
    }>;
    identifyNonPhpFiles(gitStatusLines: string[], mapGitStatus: (status: string) => 'added' | 'modified' | 'deleted'): NonPhpFile[];
}
//# sourceMappingURL=file-filter.d.ts.map