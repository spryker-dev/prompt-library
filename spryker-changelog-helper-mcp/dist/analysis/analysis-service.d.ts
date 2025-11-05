import { ImpactedMethod } from '../types/domain.types';
export interface ModulePattern {
    detect: string;
    glob: string;
}
export interface AnalysisOptions {
    root: string;
    diff: string;
    excludes?: string[];
    includeTests?: boolean;
    debug?: boolean;
    modulePatterns?: ModulePattern[];
    modules?: string[];
}
export interface AnalysisResult {
    diffResult: any;
    impactResults: Map<string, ImpactedMethod[]>;
}
export declare class ImpactAnalysisService {
    private modulePatterns;
    constructor(modulePatterns?: ModulePattern[]);
    analyze(options: AnalysisOptions): Promise<AnalysisResult>;
    private enrichDiffWithPhpDoc;
    generateReport(analysisResult: AnalysisResult, root: string, modulePatterns?: ModulePattern[]): Promise<any>;
    private analyzeDiff;
    private analyzeImpact;
    private getAllModulesWithChanges;
    private groupMethodsByModule;
    private addMethodToModule;
    private createFileMethod;
    private analyzeModuleImpact;
    private buildModuleGlobs;
    private filterReportByModule;
    private detectModuleScope;
    private createLogger;
}
//# sourceMappingURL=analysis-service.d.ts.map