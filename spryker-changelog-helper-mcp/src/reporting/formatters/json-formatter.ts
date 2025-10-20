import { ImpactReport } from '../generators/impact-report-generator';

const JSON_FIELDS = {
  timestamp: 'timestamp',
  riskLevel: 'riskLevel',
  versionRecommendation: 'versionRecommendation',
  moduleReports: 'moduleReports',
  summary: 'summary',
  newPublicAPI: 'newPublicAPI',
  modifiedPublicAPI: 'modifiedPublicAPI',
  newConfigMethods: 'newConfigMethods',
  modifiedConfigMethods: 'modifiedConfigMethods',
  internalChangesWithImpact: 'internalChangesWithImpact',
  internalChangesNoImpact: 'internalChangesNoImpact',
  removedMethods: 'removedMethods',
  newClasses: 'newClasses',
  skippedFiles: 'skippedFiles',
  nonPhpFiles: 'nonPhpFiles',
  transferChanges: 'transferChanges',
  schemaChanges: 'schemaChanges',
  composerChanges: 'composerChanges',
  constantChanges: 'constantChanges',
  frontendChanges: 'frontendChanges',
  allNewMethods: 'allNewMethods',
  allModifiedMethods: 'allModifiedMethods',
  modifiedInternalFiles: 'modifiedInternalFiles',
} as const;

const RISK_FIELDS = {
  level: 'level',
  score: 'score',
} as const;

const VERSION_FIELDS = {
  recommendedBump: 'recommendedBump',
  confidence: 'confidence',
  requiresManualReview: 'requiresManualReview',
  reasons: 'reasons',
  notes: 'notes',
} as const;


const ITEM_FIELDS = {
  method: 'method',
  file: 'file',
  visibility: 'visibility',
  class: 'class',
  fqcn: 'fqcn',
  signatureChanged: 'signatureChanged',
  affectedMethods: 'affectedMethods',
  hops: 'hops',
  transferName: 'transferName',
  changeType: 'changeType',
  addedProperties: 'addedProperties',
  removedProperties: 'removedProperties',
  fileType: 'fileType',
  reason: 'reason',
  error: 'error',
  schemaName: 'schemaName',
  tableName: 'tableName',
  addedColumns: 'addedColumns',
  removedColumns: 'removedColumns',
  modifiedColumns: 'modifiedColumns',
  packageName: 'packageName',
  oldVersion: 'oldVersion',
  newVersion: 'newVersion',
} as const;

interface JsonOutput {
  timestamp: string;
  riskLevel: {
    level: string;
    score: number;
  };
  versionRecommendation: {
    recommendedBump: string;
    confidence: string;
    requiresManualReview: boolean;
    reasons: Array<{
      type: string;
      category: string;
      description: string;
      count: number;
    }>;
  };
  summary: {
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
  };
  newPublicAPI: Array<{
    method: string;
    file: string;
    visibility: string;
  }>;
  modifiedPublicAPI: Array<{
    method: string;
    file: string;
  }>;
  newConfigMethods: Array<{
    method: string;
    file: string;
    visibility: string;
  }>;
  modifiedConfigMethods: Array<{
    method: string;
    file: string;
  }>;
  internalChangesWithImpact: Array<{
    method: string;
    file: string;
    affectedMethods: Array<{
      class: string;
      method: string;
      hops: number;
    }>;
  }>;
  newClasses: Array<{
    name: string;
    fqcn: string;
    file: string;
  }>;
  transferChanges: Array<{
    file: string;
    transferName: string;
    changeType: string;
    addedProperties?: string[];
    removedProperties?: string[];
  }>;
  frontendChanges: Array<{
    file: string;
    componentType: string;
    componentName: string;
    changeType: string;
    changes: any;
  }>;
  nonPhpFiles: Array<{
    file: string;
    fileType: string;
    changeType: string;
  }>;
  skippedFiles: Array<{
    file: string;
    reason: string;
    suggestion?: string;
  }>;
  internalChangesNoImpact: Array<{
    method: string;
    file: string;
    visibility: string;
  }>;
  allNewMethods: Array<{
    method: string;
    file: string;
    visibility: string;
    class: string;
  }>;
  allModifiedMethods: Array<{
    method: string;
    file: string;
    visibility: string;
    class: string;
  }>;
  modifiedInternalFiles: Array<{
    file: string;
    className: string;
    fqcn: string;
    layer: string;
    changeType: string;
  }>;
  schemaChanges: Array<{
    file: string;
    tableName: string;
    changeType: string;
    addedColumns?: Array<{
      name: string;
      type?: string;
      size?: string;
      description?: string;
    }>;
    removedColumns?: Array<{
      name: string;
      type?: string;
    }>;
    addedIndexes?: Array<{
      name: string;
      columns: string[];
      unique?: boolean;
    }>;
    removedIndexes?: Array<{
      name: string;
      columns: string[];
    }>;
  }>;
  constantChanges: Array<{
    file: string;
    className: string;
    fqcn: string;
    changeType: string;
    addedConstants?: Array<{
      name: string;
      value?: string;
      visibility: string;
    }>;
    removedConstants?: Array<{
      name: string;
      value?: string;
      visibility: string;
    }>;
    modifiedConstants?: Array<{
      name: string;
      oldValue?: string;
      newValue?: string;
      visibility: string;
    }>;
  }>;
  moduleReports: Record<string, any>;
}

export class JsonFormatter {
  format(report: ImpactReport): string {
    const output = this.buildJsonOutput(report);
    return JSON.stringify(output, null, 2);
  }

  private buildJsonOutput(report: ImpactReport): JsonOutput {
    return {
      [JSON_FIELDS.timestamp]: report.timestamp,
      [JSON_FIELDS.riskLevel]: {
        [RISK_FIELDS.level]: report.riskLevel.level,
        [RISK_FIELDS.score]: this.calculateRiskScore(report),
      },
      [JSON_FIELDS.versionRecommendation]: {
        [VERSION_FIELDS.recommendedBump]: report.versionRecommendation.recommendedBump,
        [VERSION_FIELDS.confidence]: report.versionRecommendation.confidence,
        [VERSION_FIELDS.requiresManualReview]: report.versionRecommendation.requiresManualReview,
        [VERSION_FIELDS.reasons]: report.versionRecommendation.reasons,
      },
      [JSON_FIELDS.summary]: report.summary,
      [JSON_FIELDS.newPublicAPI]: this.formatNewPublicAPI(report.newPublicAPI),
      [JSON_FIELDS.modifiedPublicAPI]: this.formatModifiedPublicAPI(report.modifiedPublicAPI),
      [JSON_FIELDS.newConfigMethods]: this.formatConfigMethods(report.newConfigMethods),
      [JSON_FIELDS.modifiedConfigMethods]: this.formatModifiedConfigMethods(report.modifiedConfigMethods),
      [JSON_FIELDS.internalChangesWithImpact]: this.formatInternalChanges(report.internalChangesWithImpact),
      [JSON_FIELDS.newClasses]: this.formatNewClasses(report.newClasses || []),
      [JSON_FIELDS.transferChanges]: this.formatTransferChanges(report.transferChanges),
      [JSON_FIELDS.frontendChanges]: this.formatFrontendChanges(report.frontendChanges),
      [JSON_FIELDS.nonPhpFiles]: this.formatNonPhpFiles(report.nonPhpFiles),
      [JSON_FIELDS.skippedFiles]: this.formatSkippedFiles(report.skippedFiles),
      [JSON_FIELDS.internalChangesNoImpact]: this.formatInternalChangesNoImpact(report.internalChangesNoImpact),
      [JSON_FIELDS.allNewMethods]: this.formatAllNewMethods(report.newMethods || []),
      [JSON_FIELDS.allModifiedMethods]: this.formatAllModifiedMethods(report.modifiedMethods || []),
      [JSON_FIELDS.modifiedInternalFiles]: this.formatModifiedInternalFiles(report.modifiedInternalFiles || []),
      [JSON_FIELDS.schemaChanges]: this.formatSchemaChanges(report.schemaChanges),
      [JSON_FIELDS.constantChanges]: this.formatConstantChanges(report.constantChanges),
      [JSON_FIELDS.moduleReports]: this.formatModuleReports(report.moduleReports),
    };
  }

  private calculateRiskScore(report: ImpactReport): number {
    const weights = {
      newPublicAPI: 5,
      modifiedPublicAPI: 10,
      newConfigMethods: 3,
      modifiedConfigMethods: 7,
      internalWithImpact: 4,
    };

    return (
      report.summary.newPublicAPI * weights.newPublicAPI +
      report.summary.modifiedPublicAPI * weights.modifiedPublicAPI +
      report.summary.newConfigMethods * weights.newConfigMethods +
      report.summary.modifiedConfigMethods * weights.modifiedConfigMethods +
      report.summary.internalWithImpact * weights.internalWithImpact
    );
  }

  private formatNewPublicAPI(items: ImpactReport['newPublicAPI']) {
    return items.map(item => ({
      [ITEM_FIELDS.method]: item.method,
      [ITEM_FIELDS.file]: item.file,
      [ITEM_FIELDS.visibility]: item.visibility,
      description: item.description,
      isApiMethod: item.isApiMethod,
      isDeprecated: item.isDeprecated,
    }));
  }

  private formatModifiedPublicAPI(items: ImpactReport['modifiedPublicAPI']) {
    return items.map(item => ({
      [ITEM_FIELDS.method]: item.method,
      [ITEM_FIELDS.file]: item.file,
      [ITEM_FIELDS.signatureChanged]: item.signatureChanged,
      description: item.description,
      isApiMethod: item.isApiMethod,
      isDeprecated: item.isDeprecated,
    }));
  }

  private formatConfigMethods(items: ImpactReport['newConfigMethods']) {
    return items.map(item => ({
      [ITEM_FIELDS.method]: item.method,
      [ITEM_FIELDS.file]: item.file,
      [ITEM_FIELDS.visibility]: item.visibility,
    }));
  }

  private formatModifiedConfigMethods(items: ImpactReport['modifiedConfigMethods']) {
    return items.map(item => ({
      [ITEM_FIELDS.method]: item.method,
      [ITEM_FIELDS.file]: item.file,
    }));
  }

  private formatInternalChanges(items: ImpactReport['internalChangesWithImpact']) {
    return items.map(item => ({
      [ITEM_FIELDS.method]: item.method,
      [ITEM_FIELDS.file]: item.file,
      [ITEM_FIELDS.affectedMethods]: item.affectedMethods.map(affected => ({
        [ITEM_FIELDS.class]: affected.class || '',
        [ITEM_FIELDS.method]: affected.method || '',
        [ITEM_FIELDS.hops]: affected.hops,
        description: affected.description,
        isApiMethod: affected.isApiMethod,
        isDeprecated: affected.isDeprecated,
      })),
    }));
  }

  private formatTransferChanges(items: ImpactReport['transferChanges']) {
    return items.map(item => ({
      [ITEM_FIELDS.file]: item.file,
      [ITEM_FIELDS.transferName]: item.transferName,
      [ITEM_FIELDS.changeType]: item.changeType,
      [ITEM_FIELDS.addedProperties]: item.addedProperties,
      [ITEM_FIELDS.removedProperties]: item.removedProperties,
    }));
  }

  private formatFrontendChanges(items: ImpactReport['frontendChanges']) {
    return items.map(item => ({
      file: item.file,
      componentType: item.componentType,
      componentName: item.componentName,
      changeType: item.changeType,
      changes: item.changes,
    }));
  }

  private formatNonPhpFiles(items: ImpactReport['nonPhpFiles']) {
    return items.map(item => ({
      [ITEM_FIELDS.file]: item.file,
      [ITEM_FIELDS.fileType]: item.fileType,
      [ITEM_FIELDS.changeType]: item.changeType,
    }));
  }

  private formatSkippedFiles(items: ImpactReport['skippedFiles']) {
    return items.map(item => {
      const result: any = {
        [ITEM_FIELDS.file]: item.file,
        [ITEM_FIELDS.reason]: item.reason,
      };
      if (item.suggestion) {
        result.suggestion = item.suggestion;
      }
      return result;
    });
  }

  private formatInternalChangesNoImpact(items: ImpactReport['internalChangesNoImpact']) {
    return items.map(item => ({
      method: item.fqcn,
      file: item.file,
      visibility: item.visibility,
    }));
  }

  private formatNewClasses(items: any[]) {
    return items.map(item => ({
      name: item.name,
      fqcn: item.fqcn,
      file: item.file,
    }));
  }

  private formatAllNewMethods(items: any[]) {
    return items.map(item => ({
      method: item.fqcn,
      file: item.file,
      visibility: item.visibility,
      class: item.class,
    }));
  }

  private formatAllModifiedMethods(items: any[]) {
    return items.map(item => ({
      method: item.fqcn,
      file: item.file,
      visibility: item.visibility,
      class: item.class,
    }));
  }

  private formatModifiedInternalFiles(items: any[]) {
    return items.map(item => ({
      file: item.file,
      className: item.className,
      fqcn: item.fqcn,
      layer: item.layer,
      changeType: item.changeType,
    }));
  }

  private formatSchemaChanges(items: any[]) {
    return items.map(item => ({
      file: item.file,
      tableName: item.tableName,
      changeType: item.changeType,
      addedColumns: item.addedColumns?.map((col: any) => ({
        name: col.name,
        type: col.type,
        size: col.size,
        description: col.description,
      })),
      removedColumns: item.removedColumns?.map((col: any) => ({
        name: col.name,
        type: col.type,
      })),
      addedIndexes: item.addedIndexes?.map((idx: any) => ({
        name: idx.name,
        columns: idx.columns,
        unique: idx.unique,
      })),
      removedIndexes: item.removedIndexes?.map((idx: any) => ({
        name: idx.name,
        columns: idx.columns,
      })),
    }));
  }

  private formatModuleReports(moduleReports: Map<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [moduleName, report] of moduleReports.entries()) {
      result[moduleName] = {
        moduleName: report.moduleName,
        versionRecommendation: {
          recommendedBump: report.versionRecommendation.recommendedBump,
          confidence: report.versionRecommendation.confidence,
          requiresManualReview: report.versionRecommendation.requiresManualReview,
          reasons: report.versionRecommendation.reasons,
        },
        publicApiChanges: {
          newMethods: report.publicApiChanges.newMethods,
          modifiedMethods: report.publicApiChanges.modifiedMethods,
          removedMethods: report.publicApiChanges.removedMethods,
          affectedByInternal: report.publicApiChanges.affectedByInternal,
        },
        pluginChanges: {
          newPlugins: report.pluginChanges.newPlugins,
          modifiedPlugins: report.pluginChanges.modifiedPlugins,
          removedPlugins: report.pluginChanges.removedPlugins,
          affectedByInternal: report.pluginChanges.affectedByInternal,
        },
        configChanges: {
          newMethods: report.configChanges.newMethods,
          modifiedMethods: report.configChanges.modifiedMethods,
          removedMethods: report.configChanges.removedMethods,
        },
        constantChanges: {
          addedConstants: report.constantChanges.addedConstants,
          removedConstants: report.constantChanges.removedConstants,
          modifiedConstants: report.constantChanges.modifiedConstants,
        },
        internalChanges: {
          newMethods: report.internalChanges.newMethods,
          modifiedMethods: report.internalChanges.modifiedMethods,
          modifiedFiles: report.internalChanges.modifiedFiles,
        },
        dataChanges: {
          transfers: report.dataChanges.transfers,
          schemas: report.dataChanges.schemas,
        },
        composerChanges: report.composerChanges || null,
        summary: {
          totalMethodChanges: report.validationInfo.totalMethodChanges,
          totalFileChanges: report.validationInfo.totalFileChanges,
          hasBreakingChanges: report.validationInfo.hasBreakingChanges,
        },
      };
    }
    
    return result;
  }

  private formatConstantChanges(changes: any[]): any[] {
    return changes.map(change => ({
      file: change.file,
      className: change.className,
      fqcn: change.fqcn,
      changeType: change.changeType,
      addedConstants: change.addedConstants?.map((c: any) => ({
        name: c.name,
        value: c.value,
        visibility: c.visibility,
      })),
      removedConstants: change.removedConstants?.map((c: any) => ({
        name: c.name,
        value: c.value,
        visibility: c.visibility,
      })),
      modifiedConstants: change.modifiedConstants?.map((c: any) => ({
        name: c.name,
        oldValue: c.oldValue,
        newValue: c.newValue,
        visibility: c.visibility,
      })),
    }));
  }
}
