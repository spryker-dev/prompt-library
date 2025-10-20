"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactReportGenerator = void 0;
const file_constants_1 = require("../../analysis/constants/file-constants");
const canonical_1 = require("../../utils/canonical");
const public_api_detector_1 = require("../../spryker/detectors/public-api-detector");
const risk_constants_1 = require("../constants/risk-constants");
const spryker_constants_1 = require("../../spryker/constants/spryker-constants");
const version_recommender_1 = require("../versioning/version-recommender");
const module_report_generator_1 = require("../generators/module-report-generator");
const spryker_constants_2 = require("../../spryker/constants/spryker-constants");
class ImpactReportGenerator {
    constructor() {
        this.versionRecommender = new version_recommender_1.VersionRecommender();
        this.moduleReportGenerator = new module_report_generator_1.ModuleReportGenerator();
    }
    generateReport(diffResult, impactResults) {
        const newPublicAPI = [];
        const modifiedPublicAPI = [];
        const newConfigMethods = [];
        const modifiedConfigMethods = [];
        const modifiedCommunicationLayer = [];
        const internalChangesWithImpact = [];
        const internalChangesNoImpact = [];
        // Categorize new methods
        for (const method of diffResult.newMethods) {
            if (this.isConfigMethod(method)) {
                newConfigMethods.push({
                    method: method.fqcn,
                    file: method.file,
                    visibility: method.visibility,
                });
            }
            else if (public_api_detector_1.PublicApiDetector.isPublicApi(method)) {
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
            }
            else if (this.isCommunicationLayerAdjustment(method)) {
                modifiedCommunicationLayer.push({
                    method: method.fqcn,
                    file: method.file,
                    visibility: method.visibility,
                    signatureChanged: method.signatureChanged,
                });
            }
            else if (public_api_detector_1.PublicApiDetector.isPublicApi(method)) {
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
                const canonicalKey = cls && methodName ? (0, canonical_1.canonKey)(cls, methodName) : method.fqcn.toLowerCase();
                const impact = impactResults.get(canonicalKey) || impactResults.get(method.fqcn) || impactResults.get(method.fqcn.toLowerCase()) || [];
                if (impact.length > 0) {
                    internalChangesWithImpact.push({
                        method: method.fqcn,
                        file: method.file,
                        affectedMethods: impact,
                    });
                }
            }
            else {
                const [cls, methodName] = method.fqcn.split('::');
                const canonicalKey = cls && methodName ? (0, canonical_1.canonKey)(cls, methodName) : method.fqcn.toLowerCase();
                const impact = impactResults.get(canonicalKey) || impactResults.get(method.fqcn) || impactResults.get(method.fqcn.toLowerCase()) || [];
                if (impact.length > 0) {
                    internalChangesWithImpact.push({
                        method: method.fqcn,
                        file: method.file,
                        affectedMethods: impact,
                    });
                }
                else {
                    internalChangesNoImpact.push(method);
                }
            }
        }
        const summary = {
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
        const riskLevel = this.calculateRiskLevel(modifiedPublicAPI.length, newPublicAPI.length, modifiedConfigMethods.length, internalChangesWithImpact.length);
        const report = {
            timestamp: new Date().toISOString(),
            riskLevel,
            versionRecommendation: {},
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
    isConfigMethod(method) {
        if (method.visibility !== 'public')
            return false;
        return /\\Config(::|$)/.test(method.fqcn) || method.file.includes(file_constants_1.FilePattern.CONFIG);
    }
    isCommunicationLayerAdjustment(method) {
        // Only track public/protected methods in Communication layer
        if (method.visibility === 'private')
            return false;
        // Check if it's in Communication layer
        const communicationLayer = spryker_constants_1.InternalApiLayers.find(layer => layer === 'Communication');
        if (!method.file.includes(`/${communicationLayer}/`))
            return false;
        const className = method.fqcn.split('::')[0];
        const simpleClassName = className.split(spryker_constants_2.SprykerSeparator.NAMESPACE).pop() || '';
        // Check against configured Communication layer class types
        const controller = spryker_constants_1.CommunicationLayerClass.CONTROLLER;
        const form = spryker_constants_1.CommunicationLayerClass.FORM;
        const table = spryker_constants_1.CommunicationLayerClass.TABLE;
        return simpleClassName.endsWith(controller) ||
            simpleClassName.endsWith(form) ||
            simpleClassName.endsWith(table);
    }
    calculateRiskLevel(modifiedPublicAPI, newPublicAPI, modifiedConfigMethods, internalWithImpact) {
        if (modifiedPublicAPI > 0 || modifiedConfigMethods > risk_constants_1.RiskThreshold.MODIFIED_CONFIG_METHODS_HIGH) {
            return risk_constants_1.RiskLevel.HIGH;
        }
        if (newPublicAPI > risk_constants_1.RiskThreshold.NEW_PUBLIC_API_MEDIUM ||
            internalWithImpact > risk_constants_1.RiskThreshold.INTERNAL_WITH_IMPACT_MEDIUM ||
            modifiedConfigMethods > 0) {
            return risk_constants_1.RiskLevel.MEDIUM;
        }
        return risk_constants_1.RiskLevel.LOW;
    }
}
exports.ImpactReportGenerator = ImpactReportGenerator;
//# sourceMappingURL=impact-report-generator.js.map