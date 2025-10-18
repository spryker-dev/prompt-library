import { DiffAnalysisResult, MethodChange, ClassChange, SkippedFile, NonPhpFile, TransferChange, ConstantChange } from '../../analysis/diff-analyzer';
import { SchemaChange } from '../../analysis/analyzers/schema-analyzer';
import { ComposerChange } from '../../analysis/analyzers/composer-analyzer';
import { ImpactedMethod } from '../../types/domain.types';
import { RiskLevel } from '../constants/risk-constants';
import { VersionRecommendation } from '../versioning/version-recommender';
import { ModuleReport } from '../generators/module-report-generator';
import { InternalChangeType } from '../../analysis/constants/change-constants';
import { FrontendChange } from '../../analysis/analyzers/frontend-analyzer';
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
    frontendChanges: FrontendChange[];
    newMethods?: MethodChange[];
    modifiedMethods?: MethodChange[];
    modifiedInternalFiles?: ModifiedInternalFile[];
}
export interface ModifiedInternalFile {
    file: string;
    className: string;
    fqcn: string;
    layer: string;
    changeType: typeof InternalChangeType[keyof typeof InternalChangeType];
}
export interface RiskLevel {
    level: typeof RiskLevel[keyof typeof RiskLevel]['level'];
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