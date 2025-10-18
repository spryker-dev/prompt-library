import { GitHelper } from '../../git/git-helper';
import { ChangeType, ConstraintChangeType, VersionChangeType } from '../constants/change-constants';
export interface ComposerChange {
    file: string;
    changeType: typeof ChangeType[keyof typeof ChangeType];
    phpVersionChange?: PhpVersionChange;
    dependencyChanges: DependencyChange[];
}
export interface PhpVersionChange {
    old?: string;
    new?: string;
    changeType: typeof VersionChangeType[keyof typeof VersionChangeType];
    requiresMajor: boolean;
}
export interface DependencyChange {
    package: string;
    changeType: typeof ChangeType[keyof typeof ChangeType];
    oldConstraint?: string;
    newConstraint?: string;
    constraintChangeType?: typeof ConstraintChangeType[keyof typeof ConstraintChangeType];
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