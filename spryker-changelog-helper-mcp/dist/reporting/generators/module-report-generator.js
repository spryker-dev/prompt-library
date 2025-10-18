"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleReportGenerator = void 0;
const version_recommender_1 = require("../versioning/version-recommender");
const public_api_detector_1 = require("../../spryker/detectors/public-api-detector");
const version_constants_1 = require("../constants/version-constants");
const file_constants_1 = require("../../analysis/constants/file-constants");
const frontend_changelog_generator_1 = require("../formatters/frontend-changelog-generator");
class ModuleReportGenerator {
    constructor() {
        this.versionRecommender = new version_recommender_1.VersionRecommender();
        this.frontendChangelogGenerator = new frontend_changelog_generator_1.FrontendChangelogGenerator();
    }
    generateModuleReports(report) {
        const moduleReports = new Map();
        // Group all changes by module
        const moduleData = this.groupChangesByModule(report);
        // Generate report for each module
        for (const [moduleName, data] of moduleData.entries()) {
            const moduleReport = this.generateModuleReport(moduleName, data, report);
            moduleReports.set(moduleName, moduleReport);
        }
        return moduleReports;
    }
    groupChangesByModule(report) {
        const moduleData = new Map();
        // Helper to get or create module data
        const getModuleData = (moduleName) => {
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
            if (public_api_detector_1.PublicApiDetector.isPlugin(classChange.name)) {
                const moduleName = this.extractModuleFromPath(classChange.file);
                getModuleData(moduleName).newPluginClasses.push(classChange);
            }
        }
        for (const classChange of report.deprecatedClasses || []) {
            if (public_api_detector_1.PublicApiDetector.isPlugin(classChange.name)) {
                const moduleName = this.extractModuleFromPath(classChange.file);
                getModuleData(moduleName).deprecatedPluginClasses.push(classChange);
            }
        }
        // Group public API changes (separate plugins and config)
        for (const method of report.newPublicAPI) {
            const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.method);
            const className = method.method.split('::')[0];
            if (public_api_detector_1.PublicApiDetector.isPlugin(className)) {
                getModuleData(moduleName).newPlugins.push(method);
            }
            else {
                getModuleData(moduleName).newPublicAPI.push(method);
            }
        }
        for (const method of report.modifiedPublicAPI) {
            const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.method);
            const className = method.method.split('::')[0];
            if (public_api_detector_1.PublicApiDetector.isPlugin(className)) {
                getModuleData(moduleName).modifiedPlugins.push(method);
            }
            else {
                getModuleData(moduleName).modifiedPublicAPI.push(method);
            }
        }
        // Group config changes
        for (const method of report.newConfigMethods) {
            const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.method);
            getModuleData(moduleName).newConfig.push(method);
        }
        for (const method of report.modifiedConfigMethods) {
            const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.method);
            getModuleData(moduleName).modifiedConfig.push(method);
        }
        for (const method of report.modifiedCommunicationLayer) {
            const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.method);
            getModuleData(moduleName).communicationAdjustments.push(method);
        }
        for (const method of report.removedMethods) {
            const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.fqcn);
            const className = method.fqcn.split('::')[0];
            if (public_api_detector_1.PublicApiDetector.isPublicApi(method)) {
                if (public_api_detector_1.PublicApiDetector.isPlugin(className)) {
                    getModuleData(moduleName).removedPlugins.push(method);
                }
                else if (public_api_detector_1.PublicApiDetector.isConfig(className)) {
                    getModuleData(moduleName).removedConfig.push(method);
                }
                else {
                    getModuleData(moduleName).removedPublicAPI.push(method);
                }
            }
        }
        // Group internal changes with impact (separate plugins from public API)
        for (const change of report.internalChangesWithImpact) {
            // Track which public APIs are affected
            for (const affected of change.affectedMethods) {
                const affectedModule = public_api_detector_1.PublicApiDetector.extractModuleName(`${affected.class}::${affected.method}`);
                const affectedData = getModuleData(affectedModule);
                const isPlugin = public_api_detector_1.PublicApiDetector.isPlugin(affected.class);
                const targetArray = isPlugin ? affectedData.affectedPlugins : affectedData.affectedPublicAPI;
                const existing = targetArray.find((a) => a.method === `${affected.class}::${affected.method}`);
                if (existing) {
                    existing.affectedBy.push({
                        internalMethod: change.method,
                        hops: affected.hops,
                    });
                }
                else {
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
                const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.fqcn);
                const className = method.fqcn.split('::')[0];
                if (public_api_detector_1.PublicApiDetector.isPlugin(className)) {
                    if (method.visibility === 'public') {
                        getModuleData(moduleName).newPlugins.push({
                            method: method.fqcn,
                            file: method.file,
                            visibility: method.visibility,
                        });
                    }
                }
                else {
                    getModuleData(moduleName).newMethods.push(method);
                }
            }
        }
        if (report.modifiedMethods) {
            for (const method of report.modifiedMethods) {
                const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.fqcn);
                const className = method.fqcn.split('::')[0];
                if (public_api_detector_1.PublicApiDetector.isPlugin(className)) {
                    if (method.visibility === 'public') {
                        getModuleData(moduleName).modifiedPlugins.push({
                            method: method.fqcn,
                            file: method.file,
                            signatureChanged: method.signatureChanged,
                        });
                    }
                }
                else {
                    getModuleData(moduleName).modifiedMethods.push(method);
                }
            }
        }
        // Group modified files
        if (report.modifiedInternalFiles) {
            for (const file of report.modifiedInternalFiles) {
                const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(file.fqcn);
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
    generateModuleReport(moduleName, moduleData, fullReport) {
        // Create a mini-report for this module to get version recommendation
        const moduleSpecificReport = {
            ...fullReport,
            newPublicAPI: moduleData.newPublicAPI,
            modifiedPublicAPI: moduleData.modifiedPublicAPI,
            removedMethods: moduleData.removedPublicAPI,
            internalChangesWithImpact: moduleData.affectedPublicAPI.map((a) => ({
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
        const publicApiChanges = {
            newMethods: this.deduplicateByMethodName(moduleData.newPublicAPI.map((m) => ({
                method: m.method,
                file: m.file,
                visibility: m.visibility,
                description: m.description,
                isApiMethod: m.isApiMethod,
                isDeprecated: m.isDeprecated,
            }))),
            modifiedMethods: this.deduplicateByMethodName(moduleData.modifiedPublicAPI.map((m) => ({
                method: m.method,
                file: m.file,
                signatureChanged: m.signatureChanged,
                description: m.description,
                isApiMethod: m.isApiMethod,
                isDeprecated: m.isDeprecated,
            }))),
            removedMethods: this.deduplicateByMethodName(moduleData.removedPublicAPI.map((m) => ({
                method: m.fqcn,
                file: m.file,
                description: m.description,
                isApiMethod: m.isApiMethod,
                isDeprecated: m.isDeprecated,
            }))),
            affectedByInternal: moduleData.affectedPublicAPI.map((a) => ({
                method: a.method,
                affectedBy: a.affectedBy,
                description: a.description,
                isApiMethod: a.isApiMethod,
                isDeprecated: a.isDeprecated,
            })),
        };
        const pluginChanges = {
            newPlugins: this.deduplicateByMethodName(moduleData.newPlugins.map((m) => ({
                method: m.method,
                file: m.file,
                visibility: m.visibility,
            }))),
            newPluginClasses: moduleData.newPluginClasses || [],
            deprecatedPluginClasses: moduleData.deprecatedPluginClasses || [],
            modifiedPlugins: this.deduplicateByMethodName(moduleData.modifiedPlugins.map((m) => ({
                method: m.method,
                file: m.file,
                signatureChanged: m.signatureChanged,
            }))),
            removedPlugins: this.deduplicateByMethodName(moduleData.removedPlugins.map((m) => ({
                method: m.fqcn,
                file: m.file,
            }))),
            affectedByInternal: moduleData.affectedPlugins.map((a) => ({
                method: a.method,
                affectedBy: a.affectedBy,
            })),
        };
        const configChanges = {
            newMethods: moduleData.newConfig.map((m) => ({
                method: m.method,
                file: m.file,
                visibility: m.visibility,
            })),
            modifiedMethods: moduleData.modifiedConfig.map((m) => ({
                method: m.method,
                file: m.file,
                signatureChanged: m.signatureChanged,
            })),
            removedMethods: moduleData.removedConfig.map((m) => ({
                method: m.fqcn,
                file: m.file,
            })),
        };
        const communicationChanges = {
            adjustedMethods: moduleData.communicationAdjustments.map((m) => ({
                method: m.method,
                file: m.file,
                signatureChanged: m.signatureChanged,
                description: m.description,
            })),
        };
        const constantChanges = {
            addedConstants: (moduleData.constants || [])
                .filter((c) => c.addedConstants && c.addedConstants.length > 0)
                .flatMap((c) => c.addedConstants.map((constant) => ({
                name: constant.name,
                className: c.className,
                value: constant.value,
                visibility: constant.visibility,
            }))),
            removedConstants: (moduleData.constants || [])
                .filter((c) => c.removedConstants && c.removedConstants.length > 0)
                .flatMap((c) => c.removedConstants.map((constant) => ({
                name: constant.name,
                className: c.className,
                value: constant.value,
                visibility: constant.visibility,
                isConfigOrConstants: c.isConfigOrConstants,
            }))),
            modifiedConstants: (moduleData.constants || [])
                .filter((c) => c.modifiedConstants && c.modifiedConstants.length > 0)
                .flatMap((c) => c.modifiedConstants.map((constant) => ({
                name: constant.name,
                className: c.className,
                oldValue: constant.oldValue,
                newValue: constant.newValue,
                visibility: constant.visibility,
            }))),
        };
        const internalChanges = {
            modifiedMethods: moduleData.modifiedMethods.map((m) => ({
                method: m.fqcn,
                file: m.file,
                signatureChanged: m.signatureChanged,
            })),
            newMethods: moduleData.newMethods.map((m) => ({
                method: m.fqcn,
                file: m.file,
            })),
            modifiedFiles: moduleData.modifiedFiles,
        };
        const dataChanges = {
            transfers: moduleData.transfers.map((t) => ({
                name: t.transferName,
                changeType: t.changeType,
                addedProperties: t.addedProperties,
                removedProperties: t.removedProperties,
                modifiedProperties: t.modifiedProperties,
                strictAdded: t.strictAdded,
                strictAddedForProperties: t.strictAddedForProperties,
            })),
            schemas: moduleData.schemas.map((s) => ({
                tableName: s.tableName,
                changeType: s.changeType,
                addedColumns: s.addedColumns,
                removedColumns: s.removedColumns,
                modifiedColumns: s.modifiedColumns,
                addedIndexes: s.addedIndexes,
                removedIndexes: s.removedIndexes,
            })),
        };
        const validationInfo = {
            totalMethodChanges: moduleData.newMethods.length + moduleData.modifiedMethods.length,
            totalFileChanges: moduleData.modifiedFiles.length,
            hasBreakingChanges: versionRecommendation.recommendedBump === version_constants_1.VersionBumpType.MAJOR,
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
    parseComposerChanges(composerChange) {
        return composerChange;
    }
    isFrontendFile(filePath) {
        return filePath.endsWith(file_constants_1.FileExtension.TWIG) ||
            filePath.endsWith(file_constants_1.FileExtension.JS) ||
            filePath.endsWith(file_constants_1.FileExtension.TS) ||
            filePath.endsWith(file_constants_1.FileExtension.SCSS) ||
            filePath.endsWith(file_constants_1.FileExtension.CSS);
    }
    generateFrontendChanges(detailedChanges) {
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
    extractModuleFromPath(filePath) {
        // Match both Bundles and Features patterns
        const bundlesMatch = filePath.match(/Bundles\/([^\/]+)/);
        if (bundlesMatch)
            return bundlesMatch[1];
        const featuresMatch = filePath.match(/Features\/([^\/]+)/);
        if (featuresMatch)
            return featuresMatch[1];
        return 'Unknown';
    }
    deduplicateByMethodName(methods) {
        const seen = new Map();
        for (const method of methods) {
            const methodName = method.method.split('::')[1];
            if (!seen.has(methodName)) {
                seen.set(methodName, method);
            }
            else {
                if (method.method.includes(file_constants_1.FilePattern.INTERFACE_SUFFIX)) {
                    seen.set(methodName, method);
                }
            }
        }
        return Array.from(seen.values());
    }
}
exports.ModuleReportGenerator = ModuleReportGenerator;
//# sourceMappingURL=module-report-generator.js.map