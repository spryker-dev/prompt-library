"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFormatter = void 0;
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
    allNewMethods: 'allNewMethods',
    allModifiedMethods: 'allModifiedMethods',
    modifiedInternalFiles: 'modifiedInternalFiles',
};
const RISK_FIELDS = {
    level: 'level',
    score: 'score',
};
const VERSION_FIELDS = {
    recommendedBump: 'recommendedBump',
    confidence: 'confidence',
    requiresManualReview: 'requiresManualReview',
    reasons: 'reasons',
    notes: 'notes',
};
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
};
class JsonFormatter {
    format(report) {
        const output = this.buildJsonOutput(report);
        return JSON.stringify(output, null, 2);
    }
    buildJsonOutput(report) {
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
    calculateRiskScore(report) {
        const weights = {
            newPublicAPI: 5,
            modifiedPublicAPI: 10,
            newConfigMethods: 3,
            modifiedConfigMethods: 7,
            internalWithImpact: 4,
        };
        return (report.summary.newPublicAPI * weights.newPublicAPI +
            report.summary.modifiedPublicAPI * weights.modifiedPublicAPI +
            report.summary.newConfigMethods * weights.newConfigMethods +
            report.summary.modifiedConfigMethods * weights.modifiedConfigMethods +
            report.summary.internalWithImpact * weights.internalWithImpact);
    }
    formatNewPublicAPI(items) {
        return items.map(item => ({
            [ITEM_FIELDS.method]: item.method,
            [ITEM_FIELDS.file]: item.file,
            [ITEM_FIELDS.visibility]: item.visibility,
            description: item.description,
            isApiMethod: item.isApiMethod,
            isDeprecated: item.isDeprecated,
        }));
    }
    formatModifiedPublicAPI(items) {
        return items.map(item => ({
            [ITEM_FIELDS.method]: item.method,
            [ITEM_FIELDS.file]: item.file,
            [ITEM_FIELDS.signatureChanged]: item.signatureChanged,
            description: item.description,
            isApiMethod: item.isApiMethod,
            isDeprecated: item.isDeprecated,
        }));
    }
    formatConfigMethods(items) {
        return items.map(item => ({
            [ITEM_FIELDS.method]: item.method,
            [ITEM_FIELDS.file]: item.file,
            [ITEM_FIELDS.visibility]: item.visibility,
        }));
    }
    formatModifiedConfigMethods(items) {
        return items.map(item => ({
            [ITEM_FIELDS.method]: item.method,
            [ITEM_FIELDS.file]: item.file,
        }));
    }
    formatInternalChanges(items) {
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
    formatTransferChanges(items) {
        return items.map(item => ({
            [ITEM_FIELDS.file]: item.file,
            [ITEM_FIELDS.transferName]: item.transferName,
            [ITEM_FIELDS.changeType]: item.changeType,
            [ITEM_FIELDS.addedProperties]: item.addedProperties,
            [ITEM_FIELDS.removedProperties]: item.removedProperties,
        }));
    }
    formatNonPhpFiles(items) {
        return items.map(item => ({
            [ITEM_FIELDS.file]: item.file,
            [ITEM_FIELDS.fileType]: item.fileType,
            [ITEM_FIELDS.changeType]: item.changeType,
        }));
    }
    formatSkippedFiles(items) {
        return items.map(item => {
            const result = {
                [ITEM_FIELDS.file]: item.file,
                [ITEM_FIELDS.reason]: item.reason,
            };
            if (item.suggestion) {
                result.suggestion = item.suggestion;
            }
            return result;
        });
    }
    formatInternalChangesNoImpact(items) {
        return items.map(item => ({
            method: item.fqcn,
            file: item.file,
            visibility: item.visibility,
        }));
    }
    formatNewClasses(items) {
        return items.map(item => ({
            name: item.name,
            fqcn: item.fqcn,
            file: item.file,
        }));
    }
    formatAllNewMethods(items) {
        return items.map(item => ({
            method: item.fqcn,
            file: item.file,
            visibility: item.visibility,
            class: item.class,
        }));
    }
    formatAllModifiedMethods(items) {
        return items.map(item => ({
            method: item.fqcn,
            file: item.file,
            visibility: item.visibility,
            class: item.class,
        }));
    }
    formatModifiedInternalFiles(items) {
        return items.map(item => ({
            file: item.file,
            className: item.className,
            fqcn: item.fqcn,
            layer: item.layer,
            changeType: item.changeType,
        }));
    }
    formatSchemaChanges(items) {
        return items.map(item => ({
            file: item.file,
            tableName: item.tableName,
            changeType: item.changeType,
            addedColumns: item.addedColumns?.map((col) => ({
                name: col.name,
                type: col.type,
                size: col.size,
                description: col.description,
            })),
            removedColumns: item.removedColumns?.map((col) => ({
                name: col.name,
                type: col.type,
            })),
            addedIndexes: item.addedIndexes?.map((idx) => ({
                name: idx.name,
                columns: idx.columns,
                unique: idx.unique,
            })),
            removedIndexes: item.removedIndexes?.map((idx) => ({
                name: idx.name,
                columns: idx.columns,
            })),
        }));
    }
    formatModuleReports(moduleReports) {
        const result = {};
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
    formatConstantChanges(changes) {
        return changes.map(change => ({
            file: change.file,
            className: change.className,
            fqcn: change.fqcn,
            changeType: change.changeType,
            addedConstants: change.addedConstants?.map((c) => ({
                name: c.name,
                value: c.value,
                visibility: c.visibility,
            })),
            removedConstants: change.removedConstants?.map((c) => ({
                name: c.name,
                value: c.value,
                visibility: c.visibility,
            })),
            modifiedConstants: change.modifiedConstants?.map((c) => ({
                name: c.name,
                oldValue: c.oldValue,
                newValue: c.newValue,
                visibility: c.visibility,
            })),
        }));
    }
}
exports.JsonFormatter = JsonFormatter;
//# sourceMappingURL=json-formatter.js.map