import { ChangeType } from './constants/change-constants';
import { GitHelper } from '../git/git-helper';
import { FileFilter } from '../utils/file-filter';
import { PHPParser } from './utils/php-parser';
import { TransferAnalyzer } from './analyzers/transfer-analyzer';
import { MethodAnalyzer } from './analyzers/method-analyzer';
import { SchemaAnalyzer, SchemaChange } from './analyzers/schema-analyzer';
import { ComposerAnalyzer, ComposerChange } from './analyzers/composer-analyzer';
import { ConstantAnalyzer } from './analyzers/constant-analyzer';
import { FrontendAnalyzer, FrontendChange } from './analyzers/frontend-analyzer';
import { SprykerLayers, InternalApiLayers } from '../spryker/constants/spryker-constants';
import { GitStatus } from './constants/git-constants';
import { Logger } from '../types/domain.types';
import { AnalyzerConfig } from './constants/analyzer-config';

export interface DiffAnalysisResult {
  newMethods: MethodChange[];
  modifiedMethods: MethodChange[];
  removedMethods: MethodChange[];
  newClasses: ClassChange[];
  deprecatedClasses: ClassChange[];
  skippedFiles: SkippedFile[];
  nonPhpFiles: NonPhpFile[];
  transferChanges: TransferChange[];
  modifiedFiles: ModifiedFile[];
  schemaChanges: SchemaChange[];
  composerChanges: ComposerChange[];
  constantChanges: ConstantChange[];
  frontendChanges: FrontendChange[];
}

export interface ModifiedFile {
  file: string;
  className: string;
  fqcn: string;
  layer: string;
  changeType: 'implementation' | 'signature';
}

export interface SkippedFile {
  file: string;
  reason: string;
  error?: string;
  suggestion?: string;
}

export interface NonPhpFile {
  file: string;
  fileType: string;
  changeType: 'added' | 'modified' | 'deleted';
}

export interface TransferChange {
  file: string;
  transferName: string;
  changeType: 'new' | 'modified' | 'removed';
  addedProperties?: string[];
  removedProperties?: string[];
  modifiedProperties?: string[];
  strictAdded?: boolean;
  strictAddedForProperties?: string[];
}

export interface ConstantChange {
  file: string;
  className: string;
  fqcn: string;
  changeType: typeof ChangeType[keyof typeof ChangeType];
  isConfigOrConstants?: boolean;
  addedConstants?: ConstantInfo[];
  removedConstants?: ConstantInfo[];
  modifiedConstants?: ConstantModification[];
}

export interface ConstantInfo {
  name: string;
  value?: string;
  visibility: 'public' | 'protected' | 'private';
}

export interface ConstantModification {
  name: string;
  oldValue?: string;
  newValue?: string;
  visibility: 'public' | 'protected' | 'private';
}

export interface MethodChange {
  name: string;
  fqcn: string;
  file: string;
  visibility: string;
  params?: string;
  signatureChanged?: boolean;
  addedLines?: string[];
  removedLines?: string[];
  context?: string;
  description?: string;
  isApiMethod?: boolean;
  isDeprecated?: boolean;
}

export interface ClassChange {
  name: string;
  file: string;
  fqcn: string;
}
export class DiffAnalyzer {
  private gitHelper: GitHelper;
  private fileFilter: FileFilter;
  private transferAnalyzer: TransferAnalyzer;
  private methodAnalyzer: MethodAnalyzer;
  private schemaAnalyzer: SchemaAnalyzer;
  private composerAnalyzer: ComposerAnalyzer;
  private constantAnalyzer: ConstantAnalyzer;
  private frontendAnalyzer: FrontendAnalyzer;
  private phpParser: PHPParser;

  constructor(
    root: string,
    private baseCommit: string,
    includeTests: boolean,
    _logger?: Logger,
    modules?: string[]
  ) {
    this.gitHelper = new GitHelper(root, modules);
    this.fileFilter = new FileFilter(includeTests);
    this.phpParser = new PHPParser();
    this.transferAnalyzer = new TransferAnalyzer(this.gitHelper);
    this.methodAnalyzer = new MethodAnalyzer(this.phpParser, root);
    this.schemaAnalyzer = new SchemaAnalyzer(this.gitHelper);
    this.composerAnalyzer = new ComposerAnalyzer(this.gitHelper);
    this.constantAnalyzer = new ConstantAnalyzer(this.gitHelper);
    this.frontendAnalyzer = new FrontendAnalyzer(this.gitHelper);
  }

  async analyze(): Promise<DiffAnalysisResult> {
    const baseCommit = this.gitHelper.getMergeBase(this.baseCommit);
    const allChangedFiles = this.gitHelper.getAllChangedFiles(baseCommit);
    
    const result = this.createEmptyResult();
    result.nonPhpFiles = this.fileFilter.identifyNonPhpFiles(
      allChangedFiles,
      (status) => this.gitHelper.mapGitStatusToChangeType(status)
    );
    result.transferChanges = await this.transferAnalyzer.analyzeTransferChanges(allChangedFiles, baseCommit);
    result.schemaChanges = await this.schemaAnalyzer.analyzeSchemaChanges(allChangedFiles, baseCommit);
    result.composerChanges = await this.composerAnalyzer.analyzeComposerChanges(allChangedFiles, baseCommit);
    result.constantChanges = await this.constantAnalyzer.analyzeConstantChanges(allChangedFiles, baseCommit);
    
    // Analyze frontend files
    const frontendFiles = result.nonPhpFiles.filter(f => 
      f.file.endsWith('.twig') || f.file.endsWith('.ts') || f.file.endsWith('.js') || 
      f.file.endsWith('.scss') || f.file.endsWith('.css')
    );
    result.frontendChanges = await this.frontendAnalyzer.analyzeFrontendChanges(frontendFiles, baseCommit);

    const phpFilesWithStatus = this.fileFilter.filterPhpFilesWithStatus(allChangedFiles);
    this.analyzePhpFiles(phpFilesWithStatus, baseCommit, result);

    return result;
  }

  private createEmptyResult(): DiffAnalysisResult {
    return {
      newMethods: [],
      modifiedMethods: [],
      removedMethods: [],
      newClasses: [],
      deprecatedClasses: [],
      skippedFiles: [],
      nonPhpFiles: [],
      transferChanges: [],
      modifiedFiles: [],
      schemaChanges: [],
      composerChanges: [],
      constantChanges: [],
      frontendChanges: [],
    };
  }

  private analyzePhpFiles(phpFiles: Array<{ status: string; file: string }>, baseCommit: string, result: DiffAnalysisResult): void {
    for (const item of phpFiles) {
      this.analyzePhpFile(item.file, item.status, baseCommit, result);
    }
  }

  private analyzePhpFile(file: string, status: string, baseCommit: string, result: DiffAnalysisResult): void {
    try {
      if (status === GitStatus.ADDED) {
        result.newClasses.push({
          name: '',
          fqcn: '',
          file,
        });
        return;
      }

      const diff = this.gitHelper.getFileDiff(baseCommit, file);
      
      if (!diff || diff.trim() === '') {
        result.skippedFiles.push(this.createSkippedFileForEmptyDiff(file));
        return;
      }

      this.detectClassDeprecation(file, diff, result);

      const analysis = this.methodAnalyzer.analyzeDiff(file, diff);
      this.mergeAnalysisResults(analysis, result);

      this.trackModifiedFile(file, analysis, result);
    } catch (error: any) {
      result.skippedFiles.push(this.createSkippedFileForError(file, error));
    }
  }

  private detectClassDeprecation(file: string, diff: string, result: DiffAnalysisResult): void {
    const deprecationPattern = /^\+\s*\*\s*@deprecated/m;
    if (!deprecationPattern.test(diff)) return;

    const classPattern = /^[+ ]?\s*class\s+(\w+)/m;
    const classMatch = diff.match(classPattern);
    if (!classMatch) return;

    const className = classMatch[1];
    const fqcn = this.phpParser.buildFQCN(file, className);

    result.deprecatedClasses.push({ name: className, fqcn, file });
  }

  private trackModifiedFile(file: string, analysis: DiffAnalysisResult, result: DiffAnalysisResult): void {
    if (analysis.newMethods.length > 0 || analysis.modifiedMethods.length > 0) {
      const className = this.phpParser.extractClassNameFromFilePath(file);
      if (className) {
        const fqcn = this.phpParser.buildFQCN(file, className);
        const layer = this.extractLayer(file);
        const changeType = analysis.modifiedMethods.some(m => m.signatureChanged) ? 'signature' : 'implementation';
        
        result.modifiedFiles.push({
          file,
          className,
          fqcn,
          layer,
          changeType,
        });
      }
    }
  }

  private extractLayer(file: string): string {
    const layers = SprykerLayers;
    const internalLayers = InternalApiLayers;
    
    // Check internal layers first
    for (const layer of internalLayers) {
      if (file.includes(`/${layer}/`)) return layer;
    }
    
    // Check other layers
    for (const layer of layers) {
      if (file.includes(`/${layer}/`)) return layer;
    }
    
    return 'Unknown';
  }

  private createSkippedFileForEmptyDiff(file: string): SkippedFile {
    return {
      file,
      reason: AnalyzerConfig.skipReasons.emptyDiff,
      suggestion: 'File may have only whitespace changes or be renamed without content changes',
    };
  }

  private createSkippedFileForError(file: string, error: any): SkippedFile {
    return {
      file,
      reason: error.message || AnalyzerConfig.skipReasons.unknownError,
      error: error.stack,
      suggestion: 'Review this file manually or check if it has syntax errors',
    };
  }

  private mergeAnalysisResults(analysis: DiffAnalysisResult, result: DiffAnalysisResult): void {
    result.newMethods.push(...analysis.newMethods);
    result.modifiedMethods.push(...analysis.modifiedMethods);
    result.removedMethods.push(...analysis.removedMethods);
    result.newClasses.push(...analysis.newClasses);
    result.deprecatedClasses.push(...analysis.deprecatedClasses);
    result.skippedFiles.push(...analysis.skippedFiles);
  }
}
