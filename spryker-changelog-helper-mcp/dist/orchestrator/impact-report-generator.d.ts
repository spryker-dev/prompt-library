import { DiffAnalysisResult, MethodChange, ClassChange, SkippedFile, NonPhpFile, TransferChange, ConstantChange } from './diff-analyzer';
import { SchemaChange } from './analyzers/schema-analyzer';
import { ComposerChange } from './analyzers/composer-analyzer';
import { ImpactedMethod } from '../types/domain.types';
import { VersionRecommendation } from './version-recommender';
import { ModuleReport } from './module-report-generator';
import { AnalyzerConfig } from './config/analyzer-config';
export interface ImpactReport {
    timestamp: string;
    riskLevel: RiskLevel;
    versionRecommendation: VersionRecommendation;
    moduleReports: Map<string, ModuleReport>;
    summary: ChangeSummary;
    newPublicAPI: PublicAPIChange[];
    modifiedPublicAPI: PublicAPIChange[];
    newConfigMethods: PublicAPIChange[];
    modifiedConfigMethods: PublicAPIChange[];
    modifiedCommunicationLayer: PublicAPIChange[];
    internalChangesWithImpact: InternalChangeWithImpact[];
    internalChangesNoImpact: MethodChange[];
    removedMethods: MethodChange[];
    newClasses: ClassChange[];
    deprecatedClasses: ClassChange[];
    skippedFiles: SkippedFile[];
    nonPhpFiles: NonPhpFile[];
    transferChanges: TransferChange[];
    schemaChanges: SchemaChange[];
    composerChanges: ComposerChange[];
    constantChanges: ConstantChange[];
    newMethods?: MethodChange[];
    modifiedMethods?: MethodChange[];
    modifiedInternalFiles?: ModifiedInternalFile[];
}
export interface ModifiedInternalFile {
    file: string;
    className: string;
    fqcn: string;
    layer: string;
    changeType: typeof AnalyzerConfig.internalChangeTypes[keyof typeof AnalyzerConfig.internalChangeTypes];
}
export interface RiskLevel {
    level: typeof AnalyzerConfig.riskLevels[keyof typeof AnalyzerConfig.riskLevels]['level'];
    emoji: string;
}
export interface ChangeSummary {
    newMethods: number;
    modifiedMethods: number;
    removedMethods: number;
    newClasses: number;
    newPublicAPI: number;
    modifiedPublicAPI: number;
    newConfigMethods: number;
    modifiedConfigMethods: number;
    internalWithImpact: number;
    internalNoImpact: number;
}
export interface PublicAPIChange {
    method: string;
    file: string;
    visibility: string;
    signatureChanged?: boolean;
    description?: string;
    isApiMethod?: boolean;
    isDeprecated?: boolean;
}
export interface InternalChangeWithImpact {
    method: string;
    file: string;
    affectedMethods: ImpactedMethod[];
}
export declare class ImpactReportGenerator {
    private versionRecommender;
    private moduleReportGenerator;
    constructor();
    generateReport(diffResult: DiffAnalysisResult, impactResults: Map<string, ImpactedMethod[]>): ImpactReport;
    private isConfigMethod;
    private isCommunicationLayerAdjustment;
    private calculateRiskLevel;
}
//# sourceMappingURL=impact-report-generator.d.ts.map