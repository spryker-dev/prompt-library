import { GitHelper } from '../../git/git-helper';
import { MethodInfo } from '../parsers/typescript-parser';
export interface FrontendChange {
    file: string;
    componentType: 'atom' | 'molecule' | 'organism' | 'template' | 'page' | 'style' | 'script' | 'unknown';
    componentName: string;
    changeType: 'added' | 'modified' | 'deleted';
    changes: FrontendChangeDetails;
}
export interface FrontendChangeDetails {
    addedDataAttributes?: string[];
    removedDataAttributes?: string[];
    addedBlocks?: string[];
    removedBlocks?: string[];
    addedIncludes?: string[];
    removedIncludes?: string[];
    addedMacros?: string[];
    removedMacros?: string[];
    addedDefineDataVariables?: string[];
    removedDefineDataVariables?: string[];
    addedAttributesKeys?: string[];
    removedAttributesKeys?: string[];
    addedMolecules?: string[];
    removedMolecules?: string[];
    addedWidgets?: string[];
    removedWidgets?: string[];
    addedMethods?: MethodInfo[];
    removedMethods?: MethodInfo[];
    addedProperties?: string[];
    removedProperties?: string[];
    addedEvents?: string[];
    removedEvents?: string[];
    visibilityChanges?: VisibilityChange[];
    addedMixins?: string[];
    removedMixins?: string[];
    addedVariables?: string[];
    removedVariables?: string[];
    addedCssVariables?: string[];
    removedCssVariables?: string[];
    addedClasses?: string[];
    removedClasses?: string[];
    addedModifiers?: string[];
    removedModifiers?: string[];
}
export interface VisibilityChange {
    name: string;
    from: 'public' | 'protected' | 'private';
    to: 'public' | 'protected' | 'private';
}
export declare class FrontendAnalyzer {
    private gitHelper;
    private twigParser;
    private typescriptParser;
    private scssParser;
    constructor(gitHelper: GitHelper);
    analyzeFrontendChanges(files: Array<{
        file: string;
        changeType: string;
    }>, baseCommit: string): Promise<FrontendChange[]>;
    private getFileContent;
    private analyzeNewFile;
    private analyzeDeletedFile;
    private analyzeModifiedFile;
    private parseFileContent;
    private compareTwigFeatures;
    private compareTypescriptFeatures;
    private compareScssFeatures;
    private extractComponentInfo;
    private diff;
    private diffMethods;
    private detectVisibilityChanges;
    private emptyTwigFeatures;
    private emptyTypescriptFeatures;
    private emptyScssFeatures;
}
//# sourceMappingURL=frontend-analyzer.d.ts.map