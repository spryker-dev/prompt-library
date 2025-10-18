import { DiffAnalysisResult, MethodChange, ClassChange, SkippedFile, NonPhpFile, TransferChange, ConstantChange } from '../../analysis/diff-analyzer';
import { FilePattern } from '../../analysis/constants/file-constants';
import { SchemaChange } from '../../analysis/analyzers/schema-analyzer';
import { ComposerChange } from '../../analysis/analyzers/composer-analyzer';
import { canonKey } from '../../utils/canonical';
import { ImpactedMethod } from '../../types/domain.types';
import { PublicApiDetector } from '../../spryker/detectors/public-api-detector';
import { RiskLevel, RiskThreshold } from '../constants/risk-constants';
import { InternalApiLayers, CommunicationLayerClass } from '../../spryker/constants/spryker-constants';
import { VersionRecommender, VersionRecommendation } from '../versioning/version-recommender';
import { ModuleReportGenerator, ModuleReport } from '../generators/module-report-generator';
import { InternalChangeType } from '../../analysis/constants/change-constants';
import { SprykerSeparator } from '../../spryker/constants/spryker-constants';
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

export class ImpactReportGenerator {
  private versionRecommender: VersionRecommender;
  private moduleReportGenerator: ModuleReportGenerator;

  constructor() {
    this.versionRecommender = new VersionRecommender();
    this.moduleReportGenerator = new ModuleReportGenerator();
  }

  generateReport(
    diffResult: DiffAnalysisResult,
    impactResults: Map<string, ImpactedMethod[]>
  ): ImpactReport {
    const newPublicAPI: PublicAPIChange[] = [];
    const modifiedPublicAPI: PublicAPIChange[] = [];
    const newConfigMethods: PublicAPIChange[] = [];
    const modifiedConfigMethods: PublicAPIChange[] = [];
    const modifiedCommunicationLayer: PublicAPIChange[] = [];
    const internalChangesWithImpact: InternalChangeWithImpact[] = [];
    const internalChangesNoImpact: MethodChange[] = [];

    // Categorize new methods
    for (const method of diffResult.newMethods) {
      if (this.isConfigMethod(method)) {
        newConfigMethods.push({
          method: method.fqcn,
          file: method.file,
          visibility: method.visibility,
        });
      } else if (PublicApiDetector.isPublicApi(method)) {
        newPublicAPI.push({
          method: method.fqcn,
          file: method.file,
          visibility: method.visibility,
          description: method.description,
          isApiMethod: method.isApiMethod,
          isDeprecated: method.isDeprecated,
        });
      }
    }

    for (const method of diffResult.modifiedMethods) {
      if (this.isConfigMethod(method)) {
        modifiedConfigMethods.push({
          method: method.fqcn,
          file: method.file,
          visibility: method.visibility,
          signatureChanged: method.signatureChanged,
        });
      } else if (this.isCommunicationLayerAdjustment(method)) {
        modifiedCommunicationLayer.push({
          method: method.fqcn,
          file: method.file,
          visibility: method.visibility,
          signatureChanged: method.signatureChanged,
        });
      } else if (PublicApiDetector.isPublicApi(method)) {
        modifiedPublicAPI.push({
          method: method.fqcn,
          file: method.file,
          visibility: method.visibility,
          signatureChanged: method.signatureChanged,
          description: method.description,
          isApiMethod: method.isApiMethod,
          isDeprecated: method.isDeprecated,
        });
        
        // Also track impact if there are affected methods
        const [cls, methodName] = method.fqcn.split('::');
        const canonicalKey = cls && methodName ? canonKey(cls, methodName) : method.fqcn.toLowerCase();
        const impact = impactResults.get(canonicalKey) || impactResults.get(method.fqcn) || impactResults.get(method.fqcn.toLowerCase()) || [];
        
        if (impact.length > 0) {
          internalChangesWithImpact.push({
            method: method.fqcn,
            file: method.file,
            affectedMethods: impact,
          });
        }
      } else {
        const [cls, methodName] = method.fqcn.split('::');
        const canonicalKey = cls && methodName ? canonKey(cls, methodName) : method.fqcn.toLowerCase();
        
        const impact = impactResults.get(canonicalKey) || impactResults.get(method.fqcn) || impactResults.get(method.fqcn.toLowerCase()) || [];
        if (impact.length > 0) {
          internalChangesWithImpact.push({
            method: method.fqcn,
            file: method.file,
            affectedMethods: impact,
          });
        } else {
          internalChangesNoImpact.push(method);
        }
      }
    }

    const summary: ChangeSummary = {
      newMethods: diffResult.newMethods.length,
      modifiedMethods: diffResult.modifiedMethods.length,
      removedMethods: diffResult.removedMethods.length,
      newClasses: diffResult.newClasses.length,
      newPublicAPI: newPublicAPI.length,
      modifiedPublicAPI: modifiedPublicAPI.length,
      newConfigMethods: newConfigMethods.length,
      modifiedConfigMethods: modifiedConfigMethods.length,
      internalWithImpact: internalChangesWithImpact.length,
      internalNoImpact: internalChangesNoImpact.length,
    };

    const riskLevel = this.calculateRiskLevel(
      modifiedPublicAPI.length,
      newPublicAPI.length,
      modifiedConfigMethods.length,
      internalChangesWithImpact.length
    );

    const report: ImpactReport = {
      timestamp: new Date().toISOString(),
      riskLevel,
      versionRecommendation: {} as VersionRecommendation,
      moduleReports: new Map(),
      summary,
      newPublicAPI,
      modifiedPublicAPI,
      newConfigMethods,
      modifiedConfigMethods,
      modifiedCommunicationLayer,
      internalChangesWithImpact,
      internalChangesNoImpact,
      removedMethods: diffResult.removedMethods,
      newClasses: diffResult.newClasses,
      deprecatedClasses: diffResult.deprecatedClasses || [],
      skippedFiles: diffResult.skippedFiles,
      nonPhpFiles: diffResult.nonPhpFiles,
      transferChanges: diffResult.transferChanges,
      schemaChanges: diffResult.schemaChanges,
      composerChanges: diffResult.composerChanges,
      constantChanges: diffResult.constantChanges,
      frontendChanges: diffResult.frontendChanges,
      newMethods: diffResult.newMethods,
      modifiedMethods: diffResult.modifiedMethods,
      modifiedInternalFiles: diffResult.modifiedFiles,
    };

    // Generate version recommendation based on the report
    report.versionRecommendation = this.versionRecommender.recommend(report);

    // Generate per-module reports
    report.moduleReports = this.moduleReportGenerator.generateModuleReports(report);

    return report;
  }


  private isConfigMethod(method: MethodChange): boolean {
    if (method.visibility !== 'public') return false;
    return /\\Config(::|$)/.test(method.fqcn) || method.file.includes(FilePattern.CONFIG);
  }

  private isCommunicationLayerAdjustment(method: MethodChange): boolean {
    // Only track public/protected methods in Communication layer
    if (method.visibility === 'private') return false;
    
    // Check if it's in Communication layer
    const communicationLayer = InternalApiLayers.find(layer => layer === 'Communication');
    if (!method.file.includes(`/${communicationLayer}/`)) return false;
    
    const className = method.fqcn.split('::')[0];
    const simpleClassName = className.split(SprykerSeparator.NAMESPACE).pop() || '';
    
    // Check against configured Communication layer class types
    const controller = CommunicationLayerClass.CONTROLLER;
    const form = CommunicationLayerClass.FORM;
    const table = CommunicationLayerClass.TABLE;
    
    return simpleClassName.endsWith(controller) || 
           simpleClassName.endsWith(form) || 
           simpleClassName.endsWith(table);
  }

  private calculateRiskLevel(
    modifiedPublicAPI: number,
    newPublicAPI: number,
    modifiedConfigMethods: number,
    internalWithImpact: number
  ): RiskLevel {
    if (modifiedPublicAPI > 0 || modifiedConfigMethods > RiskThreshold.MODIFIED_CONFIG_METHODS_HIGH) {
      return RiskLevel.HIGH;
    }
    if (newPublicAPI > RiskThreshold.NEW_PUBLIC_API_MEDIUM || 
        internalWithImpact > RiskThreshold.INTERNAL_WITH_IMPACT_MEDIUM || 
        modifiedConfigMethods > 0) {
      return RiskLevel.MEDIUM;
    }
    return RiskLevel.LOW;
  }
}
