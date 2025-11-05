"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogFormatter = void 0;
const change_constants_1 = require("../../analysis/constants/change-constants");
const changelog_types_1 = require("../constants/changelog-types");
const risk_constants_1 = require("../constants/risk-constants");
const version_constants_1 = require("../constants/version-constants");
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
                type: changelog_types_1.ChangelogType.METHOD,
                action: changelog_types_1.ChangelogAction.REMOVED,
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
                    type: changelog_types_1.ChangelogType.METHOD,
                    action: changelog_types_1.ChangelogAction.MODIFIED,
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
                type: changelog_types_1.ChangelogType.METHOD,
                action: changelog_types_1.ChangelogAction.IMPROVED,
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
                type: changelog_types_1.ChangelogType.METHOD,
                action: changelog_types_1.ChangelogAction.ADDED,
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
                type: changelog_types_1.ChangelogType.CONFIG,
                action: changelog_types_1.ChangelogAction.ADDED,
                item: this.extractMethodName(method.method),
                visibility: method.visibility,
                file: method.file,
            });
        }
        for (const plugin of moduleReport.pluginChanges.affectedByInternal) {
            improvements.push({
                type: changelog_types_1.ChangelogType.PLUGIN,
                action: changelog_types_1.ChangelogAction.IMPROVED,
                item: this.extractClassName(plugin.method),
            });
        }
        // New plugin classes (entire plugins)
        for (const pluginClass of moduleReport.pluginChanges.newPluginClasses) {
            improvements.push({
                type: changelog_types_1.ChangelogType.PLUGIN,
                action: changelog_types_1.ChangelogAction.ADDED,
                item: pluginClass.name,
                file: pluginClass.file,
            });
        }
        for (const plugin of moduleReport.pluginChanges.newPlugins) {
            improvements.push({
                type: changelog_types_1.ChangelogType.METHOD,
                action: changelog_types_1.ChangelogAction.ADDED,
                item: this.extractMethodName(plugin.method),
                visibility: plugin.visibility,
                file: plugin.file,
                pluginClass: this.extractClassName(plugin.method),
            });
        }
        for (const pluginClass of moduleReport.pluginChanges.deprecatedPluginClasses) {
            deprecations.push({
                type: changelog_types_1.ChangelogType.PLUGIN,
                action: changelog_types_1.ChangelogAction.DEPRECATED,
                item: pluginClass.name,
                file: pluginClass.file,
            });
        }
        // Removed constants - only breaking if from Config/Constants files
        for (const constant of moduleReport.constantChanges.removedConstants) {
            const entry = {
                type: changelog_types_1.ChangelogType.CONSTANT,
                action: changelog_types_1.ChangelogAction.REMOVED,
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
                        type: changelog_types_1.ChangelogType.SCHEMA,
                        action: changelog_types_1.ChangelogAction.ADDED,
                        item: `${schema.tableName}.${column.name}`,
                        newValue: column.type,
                    });
                }
            }
            if (schema.addedIndexes && schema.addedIndexes.length > 0) {
                for (const index of schema.addedIndexes) {
                    improvements.push({
                        type: changelog_types_1.ChangelogType.SCHEMA,
                        action: changelog_types_1.ChangelogAction.ADDED,
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
                    type: changelog_types_1.ChangelogType.METHOD,
                    action: changelog_types_1.ChangelogAction.ADJUSTED,
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
                type: changelog_types_1.ChangelogType.CLASS,
                action: changelog_types_1.ChangelogAction.ADJUSTED,
                item: className,
                file: nonControllerClassFiles.get(className),
            });
        }
        if (moduleReport.composerChanges) {
            for (const dep of moduleReport.composerChanges.dependencyChanges) {
                adjustments.push({
                    type: changelog_types_1.ChangelogType.COMPOSER,
                    action: changelog_types_1.ChangelogAction.MODIFIED,
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
                        type: changelog_types_1.ChangelogType.SCHEMA,
                        action: changelog_types_1.ChangelogAction.MODIFIED,
                        item: `${schema.tableName}.${column.name}`,
                        oldValue: column.oldType,
                        newValue: column.newType,
                    });
                }
            }
        }
        const transfers = [];
        for (const transfer of moduleReport.dataChanges.transfers) {
            if (transfer.changeType === change_constants_1.ChangeType.NEW) {
                transfers.push({
                    type: changelog_types_1.ChangelogType.TRANSFER,
                    action: changelog_types_1.ChangelogAction.ADDED,
                    item: transfer.name,
                });
                continue;
            }
            if (transfer.addedProperties && transfer.addedProperties.length > 0) {
                for (const prop of transfer.addedProperties) {
                    improvements.push({
                        type: changelog_types_1.ChangelogType.TRANSFER,
                        action: changelog_types_1.ChangelogAction.ADDED,
                        item: `${transfer.name}.${prop}`,
                    });
                }
            }
            if (transfer.modifiedProperties && transfer.modifiedProperties.length > 0) {
                for (const prop of transfer.modifiedProperties) {
                    adjustments.push({
                        type: changelog_types_1.ChangelogType.TRANSFER,
                        action: changelog_types_1.ChangelogAction.MODIFIED,
                        item: `${transfer.name}.${prop}`,
                    });
                }
            }
        }
        // Add internal changes as adjustments (implementation details)
        if (moduleReport.internalChanges) {
            for (const method of moduleReport.internalChanges.newMethods) {
                adjustments.push({
                    type: changelog_types_1.ChangelogType.METHOD,
                    action: changelog_types_1.ChangelogAction.ADDED,
                    item: this.extractMethodName(method.method),
                    file: method.file,
                });
            }
            for (const method of moduleReport.internalChanges.modifiedMethods) {
                if (method.signatureChanged) {
                    adjustments.push({
                        type: changelog_types_1.ChangelogType.METHOD,
                        action: changelog_types_1.ChangelogAction.MODIFIED,
                        item: this.extractMethodName(method.method),
                        file: method.file,
                    });
                }
            }
        }
        const frontendChanges = this.generateFrontendChangelogEntries(moduleReport);
        return {
            moduleName: moduleReport.moduleName,
            versionBump: moduleReport.versionRecommendation.recommendedBump,
            breakingChanges,
            improvements,
            adjustments,
            deprecations,
            transfers: transfers.length > 0 ? transfers : undefined,
            frontendChanges: frontendChanges.length > 0 ? frontendChanges : undefined,
        };
    }
    generateFrontendChangelogEntries(moduleReport) {
        const entries = [];
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
    generateSummary(modules) {
        let majorReleases = 0;
        let minorReleases = 0;
        let patchReleases = 0;
        for (const moduleData of modules.values()) {
            if (moduleData.versionBump === version_constants_1.VersionBumpType.MAJOR)
                majorReleases++;
            else if (moduleData.versionBump === version_constants_1.VersionBumpType.MINOR)
                minorReleases++;
            else
                patchReleases++;
        }
        const overallRisk = majorReleases > 0
            ? risk_constants_1.RiskLevel.HIGH.level
            : minorReleases > 0
                ? risk_constants_1.RiskLevel.MEDIUM.level
                : risk_constants_1.RiskLevel.LOW.level;
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
                ...(moduleData.frontendChanges && { frontendChanges: moduleData.frontendChanges }),
            };
        }
        return JSON.stringify(output, null, 2);
    }
}
exports.ChangelogFormatter = ChangelogFormatter;
//# sourceMappingURL=changelog-formatter.js.map