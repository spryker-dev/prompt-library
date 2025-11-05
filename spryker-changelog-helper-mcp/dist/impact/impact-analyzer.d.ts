import { AnalysisResult, Logger } from '../types/domain.types';
export interface AnalyzerConfig {
    root: string;
    globs: string[];
    excludes: string[];
    targets: string[];
    entrypointRegex: RegExp;
    linkInterfaces: boolean;
    debug: boolean;
    logger: Logger;
}
export declare class ImpactAnalyzer {
    private config;
    constructor(config: AnalyzerConfig);
    analyze(): Promise<AnalysisResult>;
    private normalizeTargets;
}
//# sourceMappingURL=impact-analyzer.d.ts.map