import { Logger } from '../types/domain.types';
import { AnalyzerConfig } from './config/analyzer-config';
import { SchemaChange } from './analyzers/schema-analyzer';
import { ComposerChange } from './analyzers/composer-analyzer';
export interface DiffAnalysisResult {
    newMethods: MethodChange[];
    modifiedMethods: MethodChange[];
    removedMethods: MethodChange[];
    newClasses: ClassChange[];
    deprecatedClasses: ClassChange[];
    skippedFiles: SkippedFile[];
    nonPhpFiles: NonPhpFile[];
    transferChanges: TransferChange[];
    modifiedFiles: ModifiedFile[];
    schemaChanges: SchemaChange[];
    composerChanges: ComposerChange[];
    constantChanges: ConstantChange[];
}
export interface ModifiedFile {
    file: string;
    className: string;
    fqcn: string;
    layer: string;
    changeType: 'implementation' | 'signature';
}
export interface SkippedFile {
    file: string;
    reason: string;
    error?: string;
    suggestion?: string;
}
export interface NonPhpFile {
    file: string;
    fileType: string;
    changeType: 'added' | 'modified' | 'deleted';
}
export interface TransferChange {
    file: string;
    transferName: string;
    changeType: 'new' | 'modified' | 'removed';
    addedProperties?: string[];
    removedProperties?: string[];
    modifiedProperties?: string[];
    strictAdded?: boolean;
    strictAddedForProperties?: string[];
}
export interface ConstantChange {
    file: string;
    className: string;
    fqcn: string;
    changeType: typeof AnalyzerConfig.changeTypes[keyof typeof AnalyzerConfig.changeTypes];
    isConfigOrConstants?: boolean;
    addedConstants?: ConstantInfo[];
    removedConstants?: ConstantInfo[];
    modifiedConstants?: ConstantModification[];
}
export interface ConstantInfo {
    name: string;
    value?: string;
    visibility: 'public' | 'protected' | 'private';
}
export interface ConstantModification {
    name: string;
    oldValue?: string;
    newValue?: string;
    visibility: 'public' | 'protected' | 'private';
}
export interface MethodChange {
    name: string;
    fqcn: string;
    file: string;
    visibility: string;
    params?: string;
    signatureChanged?: boolean;
    addedLines?: string[];
    removedLines?: string[];
    context?: string;
    description?: string;
    isApiMethod?: boolean;
    isDeprecated?: boolean;
}
export interface ClassChange {
    name: string;
    file: string;
    fqcn: string;
}
export declare class DiffAnalyzer {
    private baseCommit;
    private gitHelper;
    private fileFilter;
    private transferAnalyzer;
    private methodAnalyzer;
    private schemaAnalyzer;
    private constantAnalyzer;
    private phpParser;
    constructor(root: string, baseCommit: string, includeTests: boolean, _logger?: Logger, modules?: string[]);
    analyze(): Promise<DiffAnalysisResult>;
    private createEmptyResult;
    private analyzePhpFiles;
    private analyzePhpFile;
    private detectClassDeprecation;
    private trackModifiedFile;
    private extractLayer;
    private createSkippedFileForEmptyDiff;
    private createSkippedFileForError;
    private mergeAnalysisResults;
}
//# sourceMappingURL=diff-analyzer.d.ts.map