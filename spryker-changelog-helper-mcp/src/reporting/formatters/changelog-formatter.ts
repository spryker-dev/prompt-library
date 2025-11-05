import { ImpactReport } from '../generators/impact-report-generator';
import { ModuleReport } from '../generators/module-report-generator';
import { ChangeType } from '../../analysis/constants/change-constants';
import { ChangelogType, ChangelogAction } from '../constants/changelog-types';
import { RiskLevel } from '../constants/risk-constants';
import { VersionBumpType } from '../constants/version-constants';

export interface ChangelogReport {
  modules: Map<string, ModuleChangelogData>;
  summary: ChangelogSummary;
}

export interface ModuleChangelogData {
  moduleName: string;
  versionBump: typeof VersionBumpType[keyof typeof VersionBumpType];
  breakingChanges: ChangelogEntry[];
  improvements: ChangelogEntry[];
  adjustments: ChangelogEntry[];
  deprecations: ChangelogEntry[];
  transfers?: ChangelogEntry[];
  frontendChanges?: ChangelogEntry[];
}

export interface ChangelogEntry {
  type: string;
  action: string;
  item: string;
  details?: string;
  signatureChanged?: boolean;
  oldValue?: string;
  newValue?: string;
  columns?: string[];
  visibility?: string;
  file?: string;
  pluginClass?: string;
  context?: {
    description?: string;
    isApiMethod?: boolean;
    isDeprecated?: boolean;
  };
}

export interface ChangelogSummary {
  totalModules: number;
  majorReleases: number;
  minorReleases: number;
  patchReleases: number;
  overallRisk: string;
}

export class ChangelogFormatter {
  format(_report: ImpactReport, moduleReports: Map<string, ModuleReport>): ChangelogReport {
    const modules = new Map<string, ModuleChangelogData>();

    for (const [moduleName, moduleReport] of moduleReports) {
      const changelogData = this.formatModuleChangelog(moduleReport);
      modules.set(moduleName, changelogData);
    }

    const summary = this.generateSummary(modules);

    return {
      modules,
      summary,
    };
  }

  private formatModuleChangelog(moduleReport: ModuleReport): ModuleChangelogData {
    const breakingChanges: ChangelogEntry[] = [];
    const improvements: ChangelogEntry[] = [];
    const adjustments: ChangelogEntry[] = [];
    const deprecations: ChangelogEntry[] = [];

    for (const method of moduleReport.publicApiChanges.removedMethods) {
      breakingChanges.push({
        type: ChangelogType.METHOD,
        action: ChangelogAction.REMOVED,
        item: this.extractMethodName(method.method),
        file: method.file,
        context: method.description || method.isApiMethod || method.isDeprecated ? {
          description: method.description,
          isApiMethod: method.isApiMethod,
          isDeprecated: method.isDeprecated,
        } : undefined,
      });
    }

    for (const method of moduleReport.publicApiChanges.modifiedMethods) {
      if (method.signatureChanged) {
        breakingChanges.push({
          type: ChangelogType.METHOD,
          action: ChangelogAction.MODIFIED,
          item: this.extractMethodName(method.method),
          signatureChanged: true,
          file: method.file,
          context: method.description || method.isApiMethod || method.isDeprecated ? {
            description: method.description,
            isApiMethod: method.isApiMethod,
            isDeprecated: method.isDeprecated,
          } : undefined,
        });
      }
    }

    for (const method of moduleReport.publicApiChanges.affectedByInternal) {
      improvements.push({
        type: ChangelogType.METHOD,
        action: ChangelogAction.IMPROVED,
        item: this.extractMethodName(method.method),
        context: method.description || method.isApiMethod || method.isDeprecated ? {
          description: method.description,
          isApiMethod: method.isApiMethod,
          isDeprecated: method.isDeprecated,
        } : undefined,
      });
    }

    for (const method of moduleReport.publicApiChanges.newMethods) {
      improvements.push({
        type: ChangelogType.METHOD,
        action: ChangelogAction.ADDED,
        item: this.extractMethodName(method.method),
        visibility: method.visibility,
        file: method.file,
        context: method.description || method.isApiMethod || method.isDeprecated ? {
          description: method.description,
          isApiMethod: method.isApiMethod,
          isDeprecated: method.isDeprecated,
        } : undefined,
      });
    }

    for (const method of moduleReport.configChanges.newMethods) {
      improvements.push({
        type: ChangelogType.CONFIG,
        action: ChangelogAction.ADDED,
        item: this.extractMethodName(method.method),
        visibility: method.visibility,
        file: method.file,
      });
    }

    for (const plugin of moduleReport.pluginChanges.affectedByInternal) {
      improvements.push({
        type: ChangelogType.PLUGIN,
        action: ChangelogAction.IMPROVED,
        item: this.extractClassName(plugin.method),
      });
    }

    // New plugin classes (entire plugins)
    for (const pluginClass of moduleReport.pluginChanges.newPluginClasses) {
      improvements.push({
        type: ChangelogType.PLUGIN,
        action: ChangelogAction.ADDED,
        item: pluginClass.name,
        file: pluginClass.file,
      });
    }

    for (const plugin of moduleReport.pluginChanges.newPlugins) {
      improvements.push({
        type: ChangelogType.METHOD,
        action: ChangelogAction.ADDED,
        item: this.extractMethodName(plugin.method),
        visibility: plugin.visibility,
        file: plugin.file,
        pluginClass: this.extractClassName(plugin.method),
      });
    }

    for (const pluginClass of moduleReport.pluginChanges.deprecatedPluginClasses) {
      deprecations.push({
        type: ChangelogType.PLUGIN,
        action: ChangelogAction.DEPRECATED,
        item: pluginClass.name,
        file: pluginClass.file,
      });
    }

    // Removed constants - only breaking if from Config/Constants files
    for (const constant of moduleReport.constantChanges.removedConstants) {
      const entry = {
        type: ChangelogType.CONSTANT,
        action: ChangelogAction.REMOVED,
        item: `${constant.className}::${constant.name}`,
        oldValue: constant.value,
        visibility: constant.visibility,
      };
      
      if ((constant as any).isConfigOrConstants) {
        // Config/Constants files = Public API = Breaking change
        breakingChanges.push(entry);
      } else {
        // Other files (Forms, etc.) = Internal = Adjustment
        adjustments.push(entry);
      }
    }

    for (const schema of moduleReport.dataChanges.schemas) {
      if (schema.addedColumns && schema.addedColumns.length > 0) {
        for (const column of schema.addedColumns) {
          improvements.push({
            type: ChangelogType.SCHEMA,
            action: ChangelogAction.ADDED,
            item: `${schema.tableName}.${column.name}`,
            newValue: column.type,
          });
        }
      }
      if (schema.addedIndexes && schema.addedIndexes.length > 0) {
        for (const index of schema.addedIndexes) {
          improvements.push({
            type: ChangelogType.SCHEMA,
            action: ChangelogAction.ADDED,
            item: `${schema.tableName}.${index.name}`,
            columns: index.columns,
          });
        }
      }
    }

    // Communication layer adjustments
    // Controllers: show method-level (public API)
    // Forms/Tables: group by class (internal implementation)
    const nonControllerClasses = new Set<string>();
    const nonControllerClassFiles = new Map<string, string>();
    
    for (const method of moduleReport.communicationChanges.adjustedMethods) {
      const className = this.extractClassName(method.method);
      const isController = className.endsWith('Controller');
      
      if (isController) {
        // Controllers are public API - show method level
        adjustments.push({
          type: ChangelogType.METHOD,
          action: ChangelogAction.ADJUSTED,
          item: this.extractMethodName(method.method),
          file: method.file,
        });
      } else {
        // Forms/Tables - group by class
        nonControllerClasses.add(className);
        if (!nonControllerClassFiles.has(className)) {
          nonControllerClassFiles.set(className, method.file);
        }
      }
    }
    
    for (const className of nonControllerClasses) {
      adjustments.push({
        type: ChangelogType.CLASS,
        action: ChangelogAction.ADJUSTED,
        item: className,
        file: nonControllerClassFiles.get(className),
      });
    }

    if (moduleReport.composerChanges) {
      for (const dep of moduleReport.composerChanges.dependencyChanges) {
        adjustments.push({
          type: ChangelogType.COMPOSER,
          action: ChangelogAction.MODIFIED,
          item: dep.package,
          oldValue: dep.oldConstraint,
          newValue: dep.newConstraint,
        });
      }
    }

    for (const schema of moduleReport.dataChanges.schemas) {
      if (schema.modifiedColumns && schema.modifiedColumns.length > 0) {
        for (const column of schema.modifiedColumns) {
          adjustments.push({
            type: ChangelogType.SCHEMA,
            action: ChangelogAction.MODIFIED,
            item: `${schema.tableName}.${column.name}`,
            oldValue: column.oldType,
            newValue: column.newType,
          });
        }
      }
    }

    const transfers: ChangelogEntry[] = [];
    
    for (const transfer of moduleReport.dataChanges.transfers) {
      if (transfer.changeType === ChangeType.NEW) {
        transfers.push({
          type: ChangelogType.TRANSFER,
          action: ChangelogAction.ADDED,
          item: transfer.name,
        });
        continue;
      }
      
      if (transfer.addedProperties && transfer.addedProperties.length > 0) {
        for (const prop of transfer.addedProperties) {
          improvements.push({
            type: ChangelogType.TRANSFER,
            action: ChangelogAction.ADDED,
            item: `${transfer.name}.${prop}`,
          });
        }
      }
      
      if (transfer.modifiedProperties && transfer.modifiedProperties.length > 0) {
        for (const prop of transfer.modifiedProperties) {
          adjustments.push({
            type: ChangelogType.TRANSFER,
            action: ChangelogAction.MODIFIED,
            item: `${transfer.name}.${prop}`,
          });
        }
      }
    }

    // Add internal changes as adjustments (implementation details)
    if (moduleReport.internalChanges) {
      for (const method of moduleReport.internalChanges.newMethods) {
        adjustments.push({
          type: ChangelogType.METHOD,
          action: ChangelogAction.ADDED,
          item: this.extractMethodName(method.method),
          file: method.file,
        });
      }
      
      for (const method of moduleReport.internalChanges.modifiedMethods) {
        if (method.signatureChanged) {
          adjustments.push({
            type: ChangelogType.METHOD,
            action: ChangelogAction.MODIFIED,
            item: this.extractMethodName(method.method),
            file: method.file,
          });
        }
      }
    }

    const frontendChanges = this.generateFrontendChangelogEntries(moduleReport);
    
    return {
      moduleName: moduleReport.moduleName,
      versionBump: moduleReport.versionRecommendation.recommendedBump as 'MAJOR' | 'MINOR' | 'PATCH',
      breakingChanges,
      improvements,
      adjustments,
      deprecations,
      transfers: transfers.length > 0 ? transfers : undefined,
      frontendChanges: frontendChanges.length > 0 ? frontendChanges : undefined,
    };
  }

  private generateFrontendChangelogEntries(moduleReport: ModuleReport): ChangelogEntry[] {
    const entries: ChangelogEntry[] = [];

    if (!moduleReport.frontendChanges) {
      return entries;
    }

    // Process detailed frontend changes
    for (const change of moduleReport.frontendChanges.detailedChanges) {
      // Add breaking changes
      for (const breaking of change.breakingChanges) {
        entries.push({
          type: 'frontend',
          action: 'breaking',
          item: change.componentName,
          details: breaking,
          file: change.file,
        });
      }

      // Add improvements
      for (const improvement of change.improvements) {
        entries.push({
          type: 'frontend',
          action: 'improvement',
          item: change.componentName,
          details: improvement,
          file: change.file,
        });
      }

      // Add fixes
      for (const fix of change.fixes) {
        entries.push({
          type: 'frontend',
          action: 'fix',
          item: change.componentName,
          details: fix,
          file: change.file,
        });
      }
    }

    return entries;
  }

  private generateSummary(modules: Map<string, ModuleChangelogData>): ChangelogSummary {
    let majorReleases = 0;
    let minorReleases = 0;
    let patchReleases = 0;

    for (const moduleData of modules.values()) {
      if (moduleData.versionBump === VersionBumpType.MAJOR) majorReleases++;
      else if (moduleData.versionBump === VersionBumpType.MINOR) minorReleases++;
      else patchReleases++;
    }

    const overallRisk = majorReleases > 0 
      ? RiskLevel.HIGH.level 
      : minorReleases > 0 
        ? RiskLevel.MEDIUM.level 
        : RiskLevel.LOW.level;

    return {
      totalModules: modules.size,
      majorReleases,
      minorReleases,
      patchReleases,
      overallRisk,
    };
  }

  private extractMethodName(fqcn: string): string {
    const parts = fqcn.split('\\');
    const lastPart = parts[parts.length - 1];
    return lastPart;
  }

  private extractClassName(fqcn: string): string {
    const parts = fqcn.split('\\');
    const classAndMethod = parts[parts.length - 1];
    return classAndMethod.split('::')[0];
  }


  formatAsJson(changelogReport: ChangelogReport): string {
    const output: any = {
      summary: changelogReport.summary,
      modules: {},
    };

    for (const [moduleName, moduleData] of changelogReport.modules) {
      output.modules[moduleName] = {
        versionBump: moduleData.versionBump,
        breakingChanges: moduleData.breakingChanges,
        improvements: moduleData.improvements,
        adjustments: moduleData.adjustments,
        deprecations: moduleData.deprecations,
        ...(moduleData.transfers && { transfers: moduleData.transfers }),
        ...(moduleData.frontendChanges && { frontendChanges: moduleData.frontendChanges }),
      };
    }

    return JSON.stringify(output, null, 2);
  }
}
