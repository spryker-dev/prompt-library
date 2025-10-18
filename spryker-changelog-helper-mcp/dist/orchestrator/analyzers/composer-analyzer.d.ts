import { GitHelper } from '../utils/git-helper';
import { AnalyzerConfig } from '../config/analyzer-config';
export interface ComposerChange {
    file: string;
    changeType: typeof AnalyzerConfig.changeTypes[keyof typeof AnalyzerConfig.changeTypes];
    phpVersionChange?: PhpVersionChange;
    dependencyChanges: DependencyChange[];
}
export interface PhpVersionChange {
    old?: string;
    new?: string;
    changeType: typeof AnalyzerConfig.versionChangeTypes[keyof typeof AnalyzerConfig.versionChangeTypes];
    requiresMajor: boolean;
}
export interface DependencyChange {
    package: string;
    changeType: typeof AnalyzerConfig.changeTypes[keyof typeof AnalyzerConfig.changeTypes];
    oldConstraint?: string;
    newConstraint?: string;
    constraintChangeType?: typeof AnalyzerConfig.constraintChangeTypes[keyof typeof AnalyzerConfig.constraintChangeTypes];
    requiresMajor: boolean;
}
export declare class ComposerAnalyzer {
    private gitHelper;
    constructor(gitHelper: GitHelper);
    analyzeComposerChanges(files: string[], baseCommit: string): Promise<ComposerChange[]>;
    private parseComposerChange;
    private detectPhpVersionChange;
    private comparePhpVersions;
    private extractMinVersion;
    private detectDependencyChanges;
    private compareConstraints;
    private extractMajorVersion;
    private extractMinorVersion;
    private parseJson;
    private determineChangeType;
}
//# sourceMappingURL=composer-analyzer.d.ts.map