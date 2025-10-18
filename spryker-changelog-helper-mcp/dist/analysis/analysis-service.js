"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactAnalysisService = void 0;
const diff_analyzer_1 = require("./diff-analyzer");
const impact_analyzer_1 = require("../impact/impact-analyzer");
const impact_report_generator_1 = require("../reporting/generators/impact-report-generator");
const public_api_detector_1 = require("../spryker/detectors/public-api-detector");
const spryker_constants_1 = require("../spryker/constants/spryker-constants");
class ImpactAnalysisService {
    constructor(modulePatterns) {
        this.modulePatterns = modulePatterns || spryker_constants_1.DefaultModulePatterns;
    }
    async analyze(options) {
        const patterns = options.modulePatterns || this.modulePatterns;
        const { effectiveRoot, moduleFilter } = this.detectModuleScope(options.root, patterns);
        const logger = this.createLogger(options.debug);
        const diffResult = await this.analyzeDiff({ ...options, root: effectiveRoot }, logger);
        const { impactResults, symbolIndex } = await this.analyzeImpact(effectiveRoot, diffResult, moduleFilter, patterns, logger);
        this.enrichDiffWithPhpDoc(diffResult, symbolIndex);
        return { diffResult, impactResults };
    }
    enrichDiffWithPhpDoc(diffResult, symbolIndex) {
        const { canonKey } = require('../utils/canonical');
        const methods = symbolIndex.methods || symbolIndex;
        // Enrich methods
        for (const method of [...diffResult.newMethods, ...diffResult.modifiedMethods]) {
            let metadata = null;
            // Try to match by FQCN if available
            if (method.fqcn && method.name) {
                const key = canonKey(method.fqcn.split('::')[0], method.name);
                metadata = methods.get(key);
            }
            // Fallback: match by file path and line number (no parsing needed!)
            if (!metadata && method.file && method.start) {
                for (const [_key, meta] of methods.entries()) {
                    if (meta.file === method.file && meta.start === method.start) {
                        metadata = meta;
                        // Update the method's FQCN and name from symbol index
                        method.fqcn = `${meta.classFQN}::${meta.name}`;
                        method.name = meta.name;
                        break;
                    }
                }
            }
            // Apply metadata if found
            if (metadata) {
                method.description = metadata.description;
                method.isApiMethod = metadata.isApiMethod;
                method.isDeprecated = metadata.isDeprecated;
                method.visibility = metadata.visibility;
            }
        }
        // Enrich new classes from symbol index (no parsing!)
        if (symbolIndex.classes) {
            for (const classChange of diffResult.newClasses || []) {
                if (!classChange.file)
                    continue;
                // Find the class in symbol index by file (match by file ending since paths may differ)
                for (const [fqcn, classMetadata] of symbolIndex.classes.entries()) {
                    if (classMetadata.file.endsWith(classChange.file) || classChange.file.endsWith(classMetadata.file)) {
                        classChange.fqcn = fqcn;
                        classChange.name = fqcn.split(spryker_constants_1.SprykerSeparator.NAMESPACE).pop() || '';
                        break;
                    }
                }
            }
        }
    }
    async generateReport(analysisResult, root, modulePatterns) {
        const patterns = modulePatterns || this.modulePatterns;
        const { moduleFilter } = this.detectModuleScope(root, patterns);
        const reportGenerator = new impact_report_generator_1.ImpactReportGenerator();
        const report = reportGenerator.generateReport(analysisResult.diffResult, analysisResult.impactResults);
        if (!moduleFilter) {
            return report;
        }
        return this.filterReportByModule(report, moduleFilter);
    }
    async analyzeDiff(options, logger) {
        const diffAnalyzer = new diff_analyzer_1.DiffAnalyzer(options.root, options.diff, options.includeTests || false, logger, options.modules);
        return await diffAnalyzer.analyze();
    }
    async analyzeImpact(root, diffResult, moduleFilter, modulePatterns, logger) {
        const impactResults = new Map();
        let symbolIndex = null;
        const methodsByModule = this.groupMethodsByModule(diffResult);
        const allModules = this.getAllModulesWithChanges(diffResult);
        for (const moduleName of allModules) {
            if (moduleFilter && moduleName !== moduleFilter) {
                continue;
            }
            const methods = methodsByModule.get(moduleName) || [];
            const moduleSymbolIndex = await this.analyzeModuleImpact(root, moduleName, methods, modulePatterns, impactResults, logger);
            // Keep the full symbol index from the first module (contains classes + methods)
            if (moduleSymbolIndex && !symbolIndex) {
                symbolIndex = moduleSymbolIndex;
            }
        }
        return { impactResults, symbolIndex: symbolIndex || { classes: new Map(), methods: new Map() } };
    }
    getAllModulesWithChanges(diffResult) {
        const modules = new Set();
        for (const method of [...diffResult.newMethods, ...diffResult.modifiedMethods]) {
            const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.fqcn);
            modules.add(moduleName);
        }
        return modules;
    }
    groupMethodsByModule(diffResult) {
        const methodsByModule = new Map();
        for (const method of diffResult.modifiedMethods) {
            if (public_api_detector_1.PublicApiDetector.isPublicApi(method)) {
                continue;
            }
            const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(method.fqcn);
            this.addMethodToModule(methodsByModule, moduleName, method);
        }
        for (const file of diffResult.modifiedFiles) {
            const moduleName = public_api_detector_1.PublicApiDetector.extractModuleName(file.fqcn);
            const fileMethod = this.createFileMethod(file);
            this.addMethodToModule(methodsByModule, moduleName, fileMethod);
        }
        return methodsByModule;
    }
    addMethodToModule(methodsByModule, moduleName, method) {
        if (!methodsByModule.has(moduleName)) {
            methodsByModule.set(moduleName, []);
        }
        methodsByModule.get(moduleName).push(method);
    }
    createFileMethod(file) {
        return {
            name: '*',
            class: file.className,
            fqcn: `${file.fqcn}::*`,
            file: file.file,
            visibility: 'public',
            signatureChanged: false,
        };
    }
    async analyzeModuleImpact(root, moduleName, methods, modulePatterns, impactResults, logger) {
        const globs = this.buildModuleGlobs(moduleName, modulePatterns);
        const targets = methods.map(m => m.fqcn);
        try {
            const analyzer = new impact_analyzer_1.ImpactAnalyzer({
                root,
                globs,
                excludes: [],
                targets,
                entrypointRegex: new RegExp((0, spryker_constants_1.getEntrypointPattern)(), 'i'),
                linkInterfaces: true,
                debug: false,
                logger,
            });
            const result = await analyzer.analyze();
            for (const targetKey of Object.keys(result.impacted)) {
                const impacted = result.impacted[targetKey] || [];
                if (impacted.length > 0) {
                    impactResults.set(targetKey, impacted);
                }
            }
            return result.symbolIndex || null;
        }
        catch (e) {
            logger(`[Warning] Could not analyze module ${moduleName}: ${e.message}`);
            return null;
        }
    }
    buildModuleGlobs(moduleName, modulePatterns) {
        return modulePatterns.map(pattern => pattern.glob.replace('{module}', moduleName));
    }
    filterReportByModule(report, moduleFilter) {
        const filteredModuleReports = new Map();
        const moduleReports = report.moduleReports;
        if (moduleReports instanceof Map && moduleReports.has(moduleFilter)) {
            filteredModuleReports.set(moduleFilter, moduleReports.get(moduleFilter));
        }
        const modulePattern = new RegExp(`\\\\${moduleFilter}\\\\`);
        const filterByModule = (items) => {
            return items.filter((item) => {
                const method = item.method || item.fqcn || '';
                return modulePattern.test(method);
            });
        };
        const filteredNewPublicAPI = filterByModule(report.newPublicAPI || []);
        const filteredModifiedPublicAPI = filterByModule(report.modifiedPublicAPI || []);
        const filteredNewConfigMethods = filterByModule(report.newConfigMethods || []);
        const filteredModifiedConfigMethods = filterByModule(report.modifiedConfigMethods || []);
        const filteredInternalChangesWithImpact = filterByModule(report.internalChangesWithImpact || []);
        return {
            ...report,
            moduleReports: filteredModuleReports,
            newPublicAPI: filteredNewPublicAPI,
            modifiedPublicAPI: filteredModifiedPublicAPI,
            newConfigMethods: filteredNewConfigMethods,
            modifiedConfigMethods: filteredModifiedConfigMethods,
            internalChangesWithImpact: filteredInternalChangesWithImpact,
            summary: {
                ...report.summary,
                newPublicAPI: filteredNewPublicAPI.length,
                modifiedPublicAPI: filteredModifiedPublicAPI.length,
                newConfigMethods: filteredNewConfigMethods.length,
                modifiedConfigMethods: filteredModifiedConfigMethods.length,
                internalWithImpact: filteredInternalChangesWithImpact.length,
            },
        };
    }
    detectModuleScope(rootPath, modulePatterns) {
        for (const pattern of modulePatterns) {
            if (!rootPath.includes(pattern.detect)) {
                continue;
            }
            const parts = rootPath.split(pattern.detect);
            const repoRoot = parts[0];
            const modulePath = parts[1];
            if (!modulePath) {
                continue;
            }
            const moduleName = modulePath.split('/')[0];
            if (!moduleName) {
                continue;
            }
            return {
                effectiveRoot: repoRoot,
                moduleFilter: moduleName,
            };
        }
        return { effectiveRoot: rootPath };
    }
    createLogger(debug) {
        if (!debug) {
            return () => { };
        }
        return (...args) => {
            console.error('[DEBUG]', ...args);
        };
    }
}
exports.ImpactAnalysisService = ImpactAnalysisService;
//# sourceMappingURL=analysis-service.js.map