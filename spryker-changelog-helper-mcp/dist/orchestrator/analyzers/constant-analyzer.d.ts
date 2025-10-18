import { GitHelper } from '../utils/git-helper';
import { ConstantChange } from '../diff-analyzer';
export declare class ConstantAnalyzer {
    private gitHelper;
    constructor(gitHelper: GitHelper);
    analyzeConstantChanges(files: string[], baseCommit: string): Promise<ConstantChange[]>;
    private analyzeFile;
    private extractConstants;
    private extractClassName;
    private extractFQCN;
    private determineChangeType;
    private hasConstantChanges;
    private isConfigOrConstantsFile;
}
//# sourceMappingURL=constant-analyzer.d.ts.map