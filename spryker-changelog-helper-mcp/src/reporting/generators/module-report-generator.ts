import { ImpactReport } from '../generators/impact-report-generator';
import { VersionRecommender, VersionRecommendation } from '../versioning/version-recommender';
import { PublicApiDetector } from '../../spryker/detectors/public-api-detector';
import { VersionBumpType } from '../constants/version-constants';
import { FilePattern, FileExtension } from '../../analysis/constants/file-constants';
import { FrontendChangelogGenerator } from '../formatters/frontend-changelog-generator';
import { FrontendChange } from '../../analysis/analyzers/frontend-analyzer';

export interface ModuleReport {
  moduleName: string;
  versionRecommendation: VersionRecommendation;
  publicApiChanges: ModulePublicApiChanges;
  pluginChanges: ModulePluginChanges;
  configChanges: ModuleConfigChanges;
  communicationChanges: ModuleCommunicationChanges;
  constantChanges: ModuleConstantChanges;
  internalChanges: ModuleInternalChanges;
  dataChanges: ModuleDataChanges;
  frontendChanges?: ModuleFrontendChanges;
  composerChanges?: ComposerChange;
  validationInfo: ModuleValidationInfo;
}

export interface ModulePublicApiChanges {
  newMethods: Array<{ method: string; file: string; visibility: string; description?: string; isApiMethod?: boolean; isDeprecated?: boolean }>;
  modifiedMethods: Array<{ method: string; file: string; signatureChanged: boolean; description?: string; isApiMethod?: boolean; isDeprecated?: boolean }>;
  removedMethods: Array<{ method: string; file: string; description?: string; isApiMethod?: boolean; isDeprecated?: boolean }>;
  affectedByInternal: Array<{
    method: string;
    affectedBy: Array<{ internalMethod: string; hops: number }>;
    description?: string;
    isApiMethod?: boolean;
    isDeprecated?: boolean;
  }>;
}

export interface ModulePluginChanges {
  newPlugins: Array<{ method: string; file: string; visibility: string }>;
  newPluginClasses: Array<{ name: string; fqcn: string; file: string }>;
  deprecatedPluginClasses: Array<{ name: string; fqcn: string; file: string }>;
  modifiedPlugins: Array<{ method: string; file: string; signatureChanged: boolean }>;
  removedPlugins: Array<{ method: string; file: string }>;
  affectedByInternal: Array<{
    method: string;
    affectedBy: Array<{ internalMethod: string; hops: number }>;
  }>;
}

export interface ModuleConfigChanges {
  newMethods: Array<{ method: string; file: string; visibility: string }>;
  modifiedMethods: Array<{ method: string; file: string; signatureChanged: boolean }>;
  removedMethods: Array<{ method: string; file: string }>;
}

export interface ModuleCommunicationChanges {
  adjustedMethods: Array<{ method: string; file: string; signatureChanged: boolean; description?: string }>;
}

export interface ModuleConstantChanges {
  addedConstants: Array<{ name: string; className: string; value?: string; visibility: string }>;
  removedConstants: Array<{ name: string; className: string; value?: string; visibility: string }>;
  modifiedConstants: Array<{ name: string; className: string; oldValue?: string; newValue?: string; visibility: string }>;
}

export interface ModuleInternalChanges {
  modifiedMethods: Array<{ method: string; file: string; signatureChanged: boolean }>;
  newMethods: Array<{ method: string; file: string }>;
  modifiedFiles: Array<{ file: string; className: string; layer: string; changeType: string }>;
}

export interface ModuleDataChanges {
  transfers: Array<{
    name: string;
    changeType: string;
    addedProperties?: string[];
    removedProperties?: string[];
    modifiedProperties?: string[];
    strictAdded?: boolean;
    strictAddedForProperties?: string[];
  }>;
  schemas: Array<{
    tableName: string;
    changeType: string;
    addedColumns?: Array<{ name: string; type?: string }>;
    removedColumns?: Array<{ name: string }>;
    modifiedColumns?: Array<{ name: string; oldType?: string; newType?: string }>;
    addedIndexes?: Array<{ name: string; columns: string[] }>;
    removedIndexes?: Array<{ name: string }>;
  }>;
}

export interface ModuleFrontendChanges {
  detailedChanges: Array<{
    file: string;
    componentType: string;
    componentName: string;
    changeType: string;
    breakingChanges: string[];
    improvements: string[];
    fixes: string[];
  }>;
}

export interface ComposerChange {
  file: string;
  phpVersionChange?: {
    old: string;
    new: string;
    changeType: 'added' | 'removed' | 'upgraded' | 'downgraded';
  };
  dependencyChanges: Array<{
    package: string;
    changeType: 'added' | 'removed' | 'modified';
    oldConstraint?: string;
    newConstraint?: string;
    constraintChangeType?: 'major' | 'minor' | 'patch' | 'relaxed' | 'tightened';
  }>;
}

export interface ModuleValidationInfo {
  totalMethodChanges: number;
  totalFileChanges: number;
  hasBreakingChanges: boolean;
  requiresManualReview: boolean;
  notes: string[];
}

export class ModuleReportGenerator {
  private versionRecommender: VersionRecommender;
  private frontendChangelogGenerator: FrontendChangelogGenerator;

  constructor() {
    this.versionRecommender = new VersionRecommender();
    this.frontendChangelogGenerator = new FrontendChangelogGenerator();
  }

  generateModuleReports(report: ImpactReport): Map<string, ModuleReport> {
    const moduleReports = new Map<string, ModuleReport>();

    // Group all changes by module
    const moduleData = this.groupChangesByModule(report);

    // Generate report for each module
    for (const [moduleName, data] of moduleData.entries()) {
      const moduleReport = this.generateModuleReport(moduleName, data, report);
      moduleReports.set(moduleName, moduleReport);
    }

    return moduleReports;
  }

  private groupChangesByModule(report: ImpactReport): Map<string, any> {
    const moduleData = new Map<string, any>();

    // Helper to get or create module data
    const getModuleData = (moduleName: string) => {
      if (!moduleData.has(moduleName)) {
        moduleData.set(moduleName, {
          newPublicAPI: [],
          modifiedPublicAPI: [],
          removedPublicAPI: [],
          affectedPublicAPI: [],
          newPlugins: [],
          newPluginClasses: [],
          deprecatedPluginClasses: [],
          modifiedPlugins: [],
          removedPlugins: [],
          affectedPlugins: [],
          newConfig: [],
          modifiedConfig: [],
          removedConfig: [],
          communicationAdjustments: [],
          constants: [],
          newMethods: [],
          modifiedMethods: [],
          modifiedFiles: [],
          transfers: [],
          schemas: [],
          composerChange: null,
          frontendFiles: [],
          detailedFrontendChanges: [],
        });
      }
      return moduleData.get(moduleName);
    };

    for (const classChange of report.newClasses || []) {
      if (PublicApiDetector.isPlugin(classChange.name)) {
        const moduleName = this.extractModuleFromPath(classChange.file);
        getModuleData(moduleName).newPluginClasses.push(classChange);
      }
    }

    for (const classChange of report.deprecatedClasses || []) {
      if (PublicApiDetector.isPlugin(classChange.name)) {
        const moduleName = this.extractModuleFromPath(classChange.file);
        getModuleData(moduleName).deprecatedPluginClasses.push(classChange);
      }
    }

    // Group public API changes (separate plugins and config)
    for (const method of report.newPublicAPI) {
      const moduleName = PublicApiDetector.extractModuleName(method.method);
      const className = method.method.split('::')[0];
      
      if (PublicApiDetector.isPlugin(className)) {
        getModuleData(moduleName).newPlugins.push(method);
      } else {
        getModuleData(moduleName).newPublicAPI.push(method);
      }
    }

    for (const method of report.modifiedPublicAPI) {
      const moduleName = PublicApiDetector.extractModuleName(method.method);
      const className = method.method.split('::')[0];
      
      if (PublicApiDetector.isPlugin(className)) {
        getModuleData(moduleName).modifiedPlugins.push(method);
      } else {
        getModuleData(moduleName).modifiedPublicAPI.push(method);
      }
    }

    // Group config changes
    for (const method of report.newConfigMethods) {
      const moduleName = PublicApiDetector.extractModuleName(method.method);
      getModuleData(moduleName).newConfig.push(method);
    }

    for (const method of report.modifiedConfigMethods) {
      const moduleName = PublicApiDetector.extractModuleName(method.method);
      getModuleData(moduleName).modifiedConfig.push(method);
    }

    for (const method of report.modifiedCommunicationLayer) {
      const moduleName = PublicApiDetector.extractModuleName(method.method);
      getModuleData(moduleName).communicationAdjustments.push(method);
    }

    for (const method of report.removedMethods) {
      const moduleName = PublicApiDetector.extractModuleName(method.fqcn);
      const className = method.fqcn.split('::')[0];
      
      if (PublicApiDetector.isPublicApi(method)) {
        if (PublicApiDetector.isPlugin(className)) {
          getModuleData(moduleName).removedPlugins.push(method);
        } else if (PublicApiDetector.isConfig(className)) {
          getModuleData(moduleName).removedConfig.push(method);
        } else {
          getModuleData(moduleName).removedPublicAPI.push(method);
        }
      }
    }

    // Group internal changes with impact (separate plugins from public API)
    for (const change of report.internalChangesWithImpact) {
      // Track which public APIs are affected
      for (const affected of change.affectedMethods) {
        const affectedModule = PublicApiDetector.extractModuleName(`${affected.class}::${affected.method}`);
        const affectedData = getModuleData(affectedModule);
        const isPlugin = PublicApiDetector.isPlugin(affected.class);
        
        const targetArray = isPlugin ? affectedData.affectedPlugins : affectedData.affectedPublicAPI;
        const existing = targetArray.find((a: any) => 
          a.method === `${affected.class}::${affected.method}`
        );
        
        if (existing) {
          existing.affectedBy.push({
            internalMethod: change.method,
            hops: affected.hops,
          });
        } else {
          targetArray.push({
            method: `${affected.class}::${affected.method}`,
            affectedBy: [{
              internalMethod: change.method,
              hops: affected.hops,
            }],
            description: affected.description,
            isApiMethod: affected.isApiMethod,
            isDeprecated: affected.isDeprecated,
          });
        }
      }
    }

    // Group all methods (separate plugin internal methods from regular internal)
    if (report.newMethods) {
      for (const method of report.newMethods) {
        const moduleName = PublicApiDetector.extractModuleName(method.fqcn);
        const className = method.fqcn.split('::')[0];
        
        if (PublicApiDetector.isPlugin(className)) {
          if (method.visibility === 'public') {
            getModuleData(moduleName).newPlugins.push({
              method: method.fqcn,
              file: method.file,
              visibility: method.visibility,
            });
          }
        } else {
          getModuleData(moduleName).newMethods.push(method);
        }
      }
    }

    if (report.modifiedMethods) {
      for (const method of report.modifiedMethods) {
        const moduleName = PublicApiDetector.extractModuleName(method.fqcn);
        const className = method.fqcn.split('::')[0];
        
        if (PublicApiDetector.isPlugin(className)) {
          if (method.visibility === 'public') {
            getModuleData(moduleName).modifiedPlugins.push({
              method: method.fqcn,
              file: method.file,
              signatureChanged: method.signatureChanged,
            });
          }
        } else {
          getModuleData(moduleName).modifiedMethods.push(method);
        }
      }
    }

    // Group modified files
    if (report.modifiedInternalFiles) {
      for (const file of report.modifiedInternalFiles) {
        const moduleName = PublicApiDetector.extractModuleName(file.fqcn);
        getModuleData(moduleName).modifiedFiles.push(file);
      }
    }

    // Group transfers
    for (const transfer of report.transferChanges) {
      const moduleName = this.extractModuleFromPath(transfer.file);
      getModuleData(moduleName).transfers.push(transfer);
    }

    // Group schemas
    for (const schema of report.schemaChanges) {
      const moduleName = this.extractModuleFromPath(schema.file);
      getModuleData(moduleName).schemas.push(schema);
    }

    // Group composer changes
    for (const composerChange of report.composerChanges) {
      const moduleName = this.extractModuleFromPath(composerChange.file);
      getModuleData(moduleName).composerChange = composerChange;
    }

    // Group constant changes
    for (const constantChange of report.constantChanges) {
      const moduleName = this.extractModuleFromPath(constantChange.file);
      getModuleData(moduleName).constants.push(constantChange);
    }

    // Group frontend files
    for (const nonPhpFile of report.nonPhpFiles) {
      if (this.isFrontendFile(nonPhpFile.file)) {
        const moduleName = this.extractModuleFromPath(nonPhpFile.file);
        getModuleData(moduleName).frontendFiles.push(nonPhpFile);
      }
    }

    // Group detailed frontend changes
    for (const feChange of report.frontendChanges) {
      const moduleName = this.extractModuleFromPath(feChange.file);
      getModuleData(moduleName).detailedFrontendChanges.push(feChange);
    }

    return moduleData;
  }

  private generateModuleReport(moduleName: string, moduleData: any, fullReport: ImpactReport): ModuleReport {
    // Create a mini-report for this module to get version recommendation
    const moduleSpecificReport: ImpactReport = {
      ...fullReport,
      newPublicAPI: moduleData.newPublicAPI,
      modifiedPublicAPI: moduleData.modifiedPublicAPI,
      removedMethods: moduleData.removedPublicAPI,
      internalChangesWithImpact: moduleData.affectedPublicAPI.map((a: any) => ({
        method: a.method,
        file: '',
        affectedMethods: a.affectedBy,
      })),
      transferChanges: moduleData.transfers,
      schemaChanges: moduleData.schemas,
      modifiedInternalFiles: moduleData.modifiedFiles,
      constantChanges: moduleData.constants,
    };

    const versionRecommendation = this.versionRecommender.recommend(moduleSpecificReport);

    const publicApiChanges: ModulePublicApiChanges = {
      newMethods: this.deduplicateByMethodName(moduleData.newPublicAPI.map((m: any) => ({
        method: m.method,
        file: m.file,
        visibility: m.visibility,
        description: m.description,
        isApiMethod: m.isApiMethod,
        isDeprecated: m.isDeprecated,
      }))),
      modifiedMethods: this.deduplicateByMethodName(moduleData.modifiedPublicAPI.map((m: any) => ({
        method: m.method,
        file: m.file,
        signatureChanged: m.signatureChanged,
        description: m.description,
        isApiMethod: m.isApiMethod,
        isDeprecated: m.isDeprecated,
      }))),
      removedMethods: this.deduplicateByMethodName(moduleData.removedPublicAPI.map((m: any) => ({
        method: m.fqcn,
        file: m.file,
        description: m.description,
        isApiMethod: m.isApiMethod,
        isDeprecated: m.isDeprecated,
      }))),
      affectedByInternal: moduleData.affectedPublicAPI.map((a: any) => ({
        method: a.method,
        affectedBy: a.affectedBy,
        description: a.description,
        isApiMethod: a.isApiMethod,
        isDeprecated: a.isDeprecated,
      })),
    };

    const pluginChanges: ModulePluginChanges = {
      newPlugins: this.deduplicateByMethodName(moduleData.newPlugins.map((m: any) => ({
        method: m.method,
        file: m.file,
        visibility: m.visibility,
      }))),
      newPluginClasses: moduleData.newPluginClasses || [],
      deprecatedPluginClasses: moduleData.deprecatedPluginClasses || [],
      modifiedPlugins: this.deduplicateByMethodName(moduleData.modifiedPlugins.map((m: any) => ({
        method: m.method,
        file: m.file,
        signatureChanged: m.signatureChanged,
      }))),
      removedPlugins: this.deduplicateByMethodName(moduleData.removedPlugins.map((m: any) => ({
        method: m.fqcn,
        file: m.file,
      }))),
      affectedByInternal: moduleData.affectedPlugins.map((a: any) => ({
        method: a.method,
        affectedBy: a.affectedBy,
      })),
    };

    const configChanges: ModuleConfigChanges = {
      newMethods: moduleData.newConfig.map((m: any) => ({
        method: m.method,
        file: m.file,
        visibility: m.visibility,
      })),
      modifiedMethods: moduleData.modifiedConfig.map((m: any) => ({
        method: m.method,
        file: m.file,
        signatureChanged: m.signatureChanged,
      })),
      removedMethods: moduleData.removedConfig.map((m: any) => ({
        method: m.fqcn,
        file: m.file,
      })),
    };

    const communicationChanges: ModuleCommunicationChanges = {
      adjustedMethods: moduleData.communicationAdjustments.map((m: any) => ({
        method: m.method,
        file: m.file,
        signatureChanged: m.signatureChanged,
        description: m.description,
      })),
    };

    const constantChanges: ModuleConstantChanges = {
      addedConstants: (moduleData.constants || [])
        .filter((c: any) => c.addedConstants && c.addedConstants.length > 0)
        .flatMap((c: any) => c.addedConstants.map((constant: any) => ({
          name: constant.name,
          className: c.className,
          value: constant.value,
          visibility: constant.visibility,
        }))),
      removedConstants: (moduleData.constants || [])
        .filter((c: any) => c.removedConstants && c.removedConstants.length > 0)
        .flatMap((c: any) => c.removedConstants.map((constant: any) => ({
          name: constant.name,
          className: c.className,
          value: constant.value,
          visibility: constant.visibility,
          isConfigOrConstants: c.isConfigOrConstants,
        }))),
      modifiedConstants: (moduleData.constants || [])
        .filter((c: any) => c.modifiedConstants && c.modifiedConstants.length > 0)
        .flatMap((c: any) => c.modifiedConstants.map((constant: any) => ({
          name: constant.name,
          className: c.className,
          oldValue: constant.oldValue,
          newValue: constant.newValue,
          visibility: constant.visibility,
        }))),
    };

    const internalChanges: ModuleInternalChanges = {
      modifiedMethods: moduleData.modifiedMethods.map((m: any) => ({
        method: m.fqcn,
        file: m.file,
        signatureChanged: m.signatureChanged,
      })),
      newMethods: moduleData.newMethods.map((m: any) => ({
        method: m.fqcn,
        file: m.file,
      })),
      modifiedFiles: moduleData.modifiedFiles,
    };

    const dataChanges: ModuleDataChanges = {
      transfers: moduleData.transfers.map((t: any) => ({
        name: t.transferName,
        changeType: t.changeType,
        addedProperties: t.addedProperties,
        removedProperties: t.removedProperties,
        modifiedProperties: t.modifiedProperties,
        strictAdded: t.strictAdded,
        strictAddedForProperties: t.strictAddedForProperties,
      })),
      schemas: moduleData.schemas.map((s: any) => ({
        tableName: s.tableName,
        changeType: s.changeType,
        addedColumns: s.addedColumns,
        removedColumns: s.removedColumns,
        modifiedColumns: s.modifiedColumns,
        addedIndexes: s.addedIndexes,
        removedIndexes: s.removedIndexes,
      })),
    };

    const validationInfo: ModuleValidationInfo = {
      totalMethodChanges: moduleData.newMethods.length + moduleData.modifiedMethods.length,
      totalFileChanges: moduleData.modifiedFiles.length,
      hasBreakingChanges: versionRecommendation.recommendedBump === VersionBumpType.MAJOR,
      requiresManualReview: versionRecommendation.requiresManualReview,
      notes: versionRecommendation.notes,
    };

    const frontendChanges = this.generateFrontendChanges(moduleData.detailedFrontendChanges);

    return {
      moduleName,
      versionRecommendation,
      publicApiChanges,
      pluginChanges,
      configChanges,
      communicationChanges,
      constantChanges,
      internalChanges,
      dataChanges,
      frontendChanges: frontendChanges || undefined,
      composerChanges: moduleData.composerChange ? this.parseComposerChanges(moduleData.composerChange) : undefined,
      validationInfo,
    };
  }

  private parseComposerChanges(composerChange: any): ComposerChange | undefined {
    return composerChange;
  }

  private isFrontendFile(filePath: string): boolean {
    return filePath.endsWith(FileExtension.TWIG) ||
           filePath.endsWith(FileExtension.JS) ||
           filePath.endsWith(FileExtension.TS) ||
           filePath.endsWith(FileExtension.SCSS) ||
           filePath.endsWith(FileExtension.CSS);
  }

  private generateFrontendChanges(detailedChanges: FrontendChange[]): ModuleFrontendChanges | null {
    if (detailedChanges.length === 0) {
      return null;
    }

    const detailedChangesList = detailedChanges.map(change => {
      const entries = this.frontendChangelogGenerator.generate([change]);
      const breakingChanges = entries.filter(e => e.type === 'breaking').map(e => e.description);
      const improvements = entries.filter(e => e.type === 'improvement').map(e => e.description);
      const fixes = entries.filter(e => e.type === 'fix').map(e => e.description);

      return {
        file: change.file,
        componentType: change.componentType,
        componentName: change.componentName,
        changeType: change.changeType,
        breakingChanges,
        improvements,
        fixes,
      };
    });

    return {
      detailedChanges: detailedChangesList,
    };
  }

  private extractModuleFromPath(filePath: string): string {
    // Match both Bundles and Features patterns
    const bundlesMatch = filePath.match(/Bundles\/([^\/]+)/);
    if (bundlesMatch) return bundlesMatch[1];
    
    const featuresMatch = filePath.match(/Features\/([^\/]+)/);
    if (featuresMatch) return featuresMatch[1];
    
    return 'Unknown';
  }

  private deduplicateByMethodName<T extends { method: string }>(methods: T[]): T[] {
    const seen = new Map<string, T>();
    
    for (const method of methods) {
      const methodName = method.method.split('::')[1];
      
      if (!seen.has(methodName)) {
        seen.set(methodName, method);
      } else {
        if (method.method.includes(FilePattern.INTERFACE_SUFFIX)) {
          seen.set(methodName, method);
        }
      }
    }
    
    return Array.from(seen.values());
  }
}
