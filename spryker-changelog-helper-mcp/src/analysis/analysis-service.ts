import { DiffAnalyzer } from './diff-analyzer';
import { ImpactAnalyzer } from '../impact/impact-analyzer';
import { ImpactReportGenerator } from '../reporting/generators/impact-report-generator';
import { PublicApiDetector } from '../spryker/detectors/public-api-detector';
import { ImpactedMethod } from '../types/domain.types';
import { DefaultModulePatterns, SprykerSeparator, getEntrypointPattern } from '../spryker/constants/spryker-constants';

export interface ModulePattern {
  detect: string;
  glob: string;
}

export interface AnalysisOptions {
  root: string;
  diff: string;
  excludes?: string[];
  includeTests?: boolean;
  debug?: boolean;
  modulePatterns?: ModulePattern[];
  modules?: string[];
}

export interface AnalysisResult {
  diffResult: any;
  impactResults: Map<string, ImpactedMethod[]>;
}

export class ImpactAnalysisService {
  private modulePatterns: ModulePattern[];

  constructor(modulePatterns?: ModulePattern[]) {
    this.modulePatterns = modulePatterns || DefaultModulePatterns;
  }

  async analyze(options: AnalysisOptions): Promise<AnalysisResult> {
    const patterns = options.modulePatterns || this.modulePatterns;
    const { effectiveRoot, moduleFilter } = this.detectModuleScope(options.root, patterns);
    const logger = this.createLogger(options.debug);
    
    const diffResult = await this.analyzeDiff({ ...options, root: effectiveRoot }, logger);
    const { impactResults, symbolIndex } = await this.analyzeImpact(effectiveRoot, diffResult, moduleFilter, patterns, logger);
    
    this.enrichDiffWithPhpDoc(diffResult, symbolIndex);
    
    return { diffResult, impactResults };
  }

  private enrichDiffWithPhpDoc(diffResult: any, symbolIndex: any): void {
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
        if (!classChange.file) continue;
        
        // Find the class in symbol index by file (match by file ending since paths may differ)
        for (const [fqcn, classMetadata] of symbolIndex.classes.entries()) {
          if (classMetadata.file.endsWith(classChange.file) || classChange.file.endsWith(classMetadata.file)) {
            classChange.fqcn = fqcn;
            classChange.name = fqcn.split(SprykerSeparator.NAMESPACE).pop() || '';
            break;
          }
        }
      }
    }
  }

  async generateReport(analysisResult: AnalysisResult, root: string, modulePatterns?: ModulePattern[]): Promise<any> {
    const patterns = modulePatterns || this.modulePatterns;
    const { moduleFilter } = this.detectModuleScope(root, patterns);
    
    const reportGenerator = new ImpactReportGenerator();
    const report = reportGenerator.generateReport(
      analysisResult.diffResult,
      analysisResult.impactResults
    );

    if (!moduleFilter) {
      return report;
    }

    return this.filterReportByModule(report, moduleFilter);
  }

  private async analyzeDiff(options: AnalysisOptions, logger: any): Promise<any> {
    const diffAnalyzer = new DiffAnalyzer(
      options.root,
      options.diff,
      options.includeTests || false,
      logger,
      options.modules
    );
    
    return await diffAnalyzer.analyze();
  }

  private async analyzeImpact(
    root: string,
    diffResult: any,
    moduleFilter: string | undefined,
    modulePatterns: ModulePattern[],
    logger: any
  ): Promise<{ impactResults: Map<string, ImpactedMethod[]>; symbolIndex: any }> {
    const impactResults = new Map<string, ImpactedMethod[]>();
    let symbolIndex: any = null;
    const methodsByModule = this.groupMethodsByModule(diffResult);
    
    const allModules = this.getAllModulesWithChanges(diffResult);

    for (const moduleName of allModules) {
      if (moduleFilter && moduleName !== moduleFilter) {
        continue;
      }

      const methods = methodsByModule.get(moduleName) || [];
      const moduleSymbolIndex = await this.analyzeModuleImpact(
        root,
        moduleName,
        methods,
        modulePatterns,
        impactResults,
        logger
      );
      
      // Keep the full symbol index from the first module (contains classes + methods)
      if (moduleSymbolIndex && !symbolIndex) {
        symbolIndex = moduleSymbolIndex;
      }
    }

    return { impactResults, symbolIndex: symbolIndex || { classes: new Map(), methods: new Map() } };
  }

  private getAllModulesWithChanges(diffResult: any): Set<string> {
    const modules = new Set<string>();
    
    for (const method of [...diffResult.newMethods, ...diffResult.modifiedMethods]) {
      const moduleName = PublicApiDetector.extractModuleName(method.fqcn);
      modules.add(moduleName);
    }
    
    return modules;
  }

  private groupMethodsByModule(diffResult: any): Map<string, any[]> {
    const methodsByModule = new Map<string, any[]>();

    for (const method of diffResult.modifiedMethods) {
      if (PublicApiDetector.isPublicApi(method)) {
        continue;
      }

      const moduleName = PublicApiDetector.extractModuleName(method.fqcn);
      this.addMethodToModule(methodsByModule, moduleName, method);
    }

    for (const file of diffResult.modifiedFiles) {
      const moduleName = PublicApiDetector.extractModuleName(file.fqcn);
      const fileMethod = this.createFileMethod(file);
      this.addMethodToModule(methodsByModule, moduleName, fileMethod);
    }

    return methodsByModule;
  }

  private addMethodToModule(
    methodsByModule: Map<string, any[]>,
    moduleName: string,
    method: any
  ): void {
    if (!methodsByModule.has(moduleName)) {
      methodsByModule.set(moduleName, []);
    }
    methodsByModule.get(moduleName)!.push(method);
  }

  private createFileMethod(file: any): any {
    return {
      name: '*',
      class: file.className,
      fqcn: `${file.fqcn}::*`,
      file: file.file,
      visibility: 'public',
      signatureChanged: false,
    };
  }

  private async analyzeModuleImpact(
    root: string,
    moduleName: string,
    methods: any[],
    modulePatterns: ModulePattern[],
    impactResults: Map<string, ImpactedMethod[]>,
    logger: any
  ): Promise<any> {
    const globs = this.buildModuleGlobs(moduleName, modulePatterns);
    const targets = methods.map(m => m.fqcn);

    try {
      const analyzer = new ImpactAnalyzer({
        root,
        globs,
        excludes: [],
        targets,
        entrypointRegex: new RegExp(getEntrypointPattern(), 'i'),
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
    } catch (e: any) {
      logger(`[Warning] Could not analyze module ${moduleName}: ${e.message}`);
      return null;
    }
  }

  private buildModuleGlobs(moduleName: string, modulePatterns: ModulePattern[]): string[] {
    return modulePatterns.map(pattern => pattern.glob.replace('{module}', moduleName));
  }

  private filterReportByModule(report: any, moduleFilter: string): any {
    const filteredModuleReports = new Map();
    const moduleReports = report.moduleReports;

    if (moduleReports instanceof Map && moduleReports.has(moduleFilter)) {
      filteredModuleReports.set(moduleFilter, moduleReports.get(moduleFilter));
    }

    const modulePattern = new RegExp(`\\\\${moduleFilter}\\\\`);
    
    const filterByModule = (items: any[]) => {
      return items.filter((item: any) => {
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

  private detectModuleScope(
    rootPath: string,
    modulePatterns: ModulePattern[]
  ): { effectiveRoot: string; moduleFilter?: string } {
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

  private createLogger(debug?: boolean): (...args: any[]) => void {
    if (!debug) {
      return () => {};
    }

    return (...args: any[]) => {
      console.error('[DEBUG]', ...args);
    };
  }
}
