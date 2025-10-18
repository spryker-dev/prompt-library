"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogFormatter = void 0;
const analyzer_config_1 = require("../config/analyzer-config");
class ChangelogFormatter {
    format(_report, moduleReports) {
        const modules = new Map();
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
    formatModuleChangelog(moduleReport) {
        const breakingChanges = [];
        const improvements = [];
        const adjustments = [];
        const deprecations = [];
        for (const method of moduleReport.publicApiChanges.removedMethods) {
            breakingChanges.push({
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.method,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.removed,
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
                    type: analyzer_config_1.AnalyzerConfig.changelogTypes.method,
                    action: analyzer_config_1.AnalyzerConfig.changelogActions.modified,
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
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.method,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.improved,
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
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.method,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.added,
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
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.config,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.added,
                item: this.extractMethodName(method.method),
                visibility: method.visibility,
                file: method.file,
            });
        }
        for (const plugin of moduleReport.pluginChanges.affectedByInternal) {
            improvements.push({
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.plugin,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.improved,
                item: this.extractClassName(plugin.method),
            });
        }
        // New plugin classes (entire plugins)
        for (const pluginClass of moduleReport.pluginChanges.newPluginClasses) {
            improvements.push({
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.plugin,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.added,
                item: pluginClass.name,
                file: pluginClass.file,
            });
        }
        for (const plugin of moduleReport.pluginChanges.newPlugins) {
            improvements.push({
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.method,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.added,
                item: this.extractMethodName(plugin.method),
                visibility: plugin.visibility,
                file: plugin.file,
                pluginClass: this.extractClassName(plugin.method),
            });
        }
        for (const pluginClass of moduleReport.pluginChanges.deprecatedPluginClasses) {
            deprecations.push({
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.plugin,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.deprecated,
                item: pluginClass.name,
                file: pluginClass.file,
            });
        }
        // Removed constants - only breaking if from Config/Constants files
        for (const constant of moduleReport.constantChanges.removedConstants) {
            const entry = {
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.constant,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.removed,
                item: `${constant.className}::${constant.name}`,
                oldValue: constant.value,
                visibility: constant.visibility,
            };
            if (constant.isConfigOrConstants) {
                // Config/Constants files = Public API = Breaking change
                breakingChanges.push(entry);
            }
            else {
                // Other files (Forms, etc.) = Internal = Adjustment
                adjustments.push(entry);
            }
        }
        for (const schema of moduleReport.dataChanges.schemas) {
            if (schema.addedColumns && schema.addedColumns.length > 0) {
                for (const column of schema.addedColumns) {
                    improvements.push({
                        type: analyzer_config_1.AnalyzerConfig.changelogTypes.schema,
                        action: analyzer_config_1.AnalyzerConfig.changelogActions.added,
                        item: `${schema.tableName}.${column.name}`,
                        newValue: column.type,
                    });
                }
            }
            if (schema.addedIndexes && schema.addedIndexes.length > 0) {
                for (const index of schema.addedIndexes) {
                    improvements.push({
                        type: analyzer_config_1.AnalyzerConfig.changelogTypes.schema,
                        action: analyzer_config_1.AnalyzerConfig.changelogActions.added,
                        item: `${schema.tableName}.${index.name}`,
                        columns: index.columns,
                    });
                }
            }
        }
        // Communication layer adjustments
        // Controllers: show method-level (public API)
        // Forms/Tables: group by class (internal implementation)
        const nonControllerClasses = new Set();
        const nonControllerClassFiles = new Map();
        for (const method of moduleReport.communicationChanges.adjustedMethods) {
            const className = this.extractClassName(method.method);
            const isController = className.endsWith('Controller');
            if (isController) {
                // Controllers are public API - show method level
                adjustments.push({
                    type: analyzer_config_1.AnalyzerConfig.changelogTypes.method,
                    action: analyzer_config_1.AnalyzerConfig.changelogActions.adjusted,
                    item: this.extractMethodName(method.method),
                    file: method.file,
                });
            }
            else {
                // Forms/Tables - group by class
                nonControllerClasses.add(className);
                if (!nonControllerClassFiles.has(className)) {
                    nonControllerClassFiles.set(className, method.file);
                }
            }
        }
        for (const className of nonControllerClasses) {
            adjustments.push({
                type: analyzer_config_1.AnalyzerConfig.changelogTypes.class,
                action: analyzer_config_1.AnalyzerConfig.changelogActions.adjusted,
                item: className,
                file: nonControllerClassFiles.get(className),
            });
        }
        if (moduleReport.composerChanges) {
            for (const dep of moduleReport.composerChanges.dependencyChanges) {
                adjustments.push({
                    type: analyzer_config_1.AnalyzerConfig.changelogTypes.composer,
                    action: analyzer_config_1.AnalyzerConfig.changelogActions.modified,
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
                        type: analyzer_config_1.AnalyzerConfig.changelogTypes.schema,
                        action: analyzer_config_1.AnalyzerConfig.changelogActions.modified,
                        item: `${schema.tableName}.${column.name}`,
                        oldValue: column.oldType,
                        newValue: column.newType,
                    });
                }
            }
        }
        const transfers = [];
        for (const transfer of moduleReport.dataChanges.transfers) {
            if (transfer.changeType === analyzer_config_1.AnalyzerConfig.changeTypes.new) {
                transfers.push({
                    type: analyzer_config_1.AnalyzerConfig.changelogTypes.transfer,
                    action: analyzer_config_1.AnalyzerConfig.changelogActions.added,
                    item: transfer.name,
                });
                continue;
            }
            if (transfer.addedProperties && transfer.addedProperties.length > 0) {
                for (const prop of transfer.addedProperties) {
                    improvements.push({
                        type: analyzer_config_1.AnalyzerConfig.changelogTypes.transfer,
                        action: analyzer_config_1.AnalyzerConfig.changelogActions.added,
                        item: `${transfer.name}.${prop}`,
                    });
                }
            }
            if (transfer.modifiedProperties && transfer.modifiedProperties.length > 0) {
                for (const prop of transfer.modifiedProperties) {
                    adjustments.push({
                        type: analyzer_config_1.AnalyzerConfig.changelogTypes.transfer,
                        action: analyzer_config_1.AnalyzerConfig.changelogActions.modified,
                        item: `${transfer.name}.${prop}`,
                    });
                }
            }
        }
        return {
            moduleName: moduleReport.moduleName,
            versionBump: moduleReport.versionRecommendation.recommendedBump,
            breakingChanges,
            improvements,
            adjustments,
            deprecations,
            transfers: transfers.length > 0 ? transfers : undefined,
        };
    }
    generateSummary(modules) {
        let majorReleases = 0;
        let minorReleases = 0;
        let patchReleases = 0;
        for (const moduleData of modules.values()) {
            if (moduleData.versionBump === analyzer_config_1.AnalyzerConfig.versionBumpTypes.major)
                majorReleases++;
            else if (moduleData.versionBump === analyzer_config_1.AnalyzerConfig.versionBumpTypes.minor)
                minorReleases++;
            else
                patchReleases++;
        }
        const overallRisk = majorReleases > 0
            ? analyzer_config_1.AnalyzerConfig.riskLevels.high.level
            : minorReleases > 0
                ? analyzer_config_1.AnalyzerConfig.riskLevels.medium.level
                : analyzer_config_1.AnalyzerConfig.riskLevels.low.level;
        return {
            totalModules: modules.size,
            majorReleases,
            minorReleases,
            patchReleases,
            overallRisk,
        };
    }
    extractMethodName(fqcn) {
        const parts = fqcn.split('\\');
        const lastPart = parts[parts.length - 1];
        return lastPart;
    }
    extractClassName(fqcn) {
        const parts = fqcn.split('\\');
        const classAndMethod = parts[parts.length - 1];
        return classAndMethod.split('::')[0];
    }
    formatAsJson(changelogReport) {
        const output = {
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
            };
        }
        return JSON.stringify(output, null, 2);
    }
}
exports.ChangelogFormatter = ChangelogFormatter;
//# sourceMappingURL=changelog-formatter.js.map