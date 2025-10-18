import { AnalyzerConfig } from '../constants/analyzer-config';
import { PHPParser } from '../utils/php-parser';
import { MethodChange, DiffAnalysisResult, SkippedFile } from '../diff-analyzer';
import { PhpPattern } from '../constants/php-constants';
import { ChangeType } from '../constants/change-constants';
import { DiffPrefixes } from '../constants/git-constants';

interface DiffBlock {
  context: string;
  lines: string[];
  additions: string[];
  removals: string[];
  methodNameFromContext: string | null;
}

interface MethodSignatureTracker {
  added: boolean;
  removed: boolean;
}

export class MethodAnalyzer {
  constructor(private phpParser: PHPParser, _root: string = '') {}

  analyzeDiff(file: string, diffText: string): DiffAnalysisResult {
    const result = this.createEmptyResult();
    
    const className = this.phpParser.extractClassNameFromFilePath(file);
    if (!className) {
      result.skippedFiles.push(this.createSkippedFileForNoClassName(file));
      return result;
    }

    const blocks = this.parseDiffBlocks(diffText);
    const methodSignatures = this.buildMethodSignatureTracker(diffText);

    this.processBlocks(file, className, blocks, methodSignatures, result);
    this.processRemovedMethods(file, className, methodSignatures, result);
    this.filterOutRemovedFromModified(result);

    return result;
  }

  private filterOutRemovedFromModified(result: DiffAnalysisResult): void {
    const removedFqcns = new Set(result.removedMethods.map(m => m.fqcn));
    result.modifiedMethods = result.modifiedMethods.filter(m => !removedFqcns.has(m.fqcn));
  }

  private processRemovedMethods(
    file: string,
    className: string,
    methodSignatures: Map<string, MethodSignatureTracker>,
    result: DiffAnalysisResult
  ): void {
    for (const [methodName, signature] of methodSignatures.entries()) {
      if (signature.removed && !signature.added) {
        const fqcn = `${this.phpParser.buildFQCN(file, className)}::${methodName}`;
        
        result.removedMethods.push({
          name: methodName,
          fqcn,
          file,
          visibility: 'public',
        });
      }
    }
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

  private createSkippedFileForNoClassName(file: string): SkippedFile {
    return {
      file,
      reason: AnalyzerConfig.skipReasons.noClassName,
      suggestion: 'Ensure file follows naming convention: /path/ClassName.php',
    };
  }

  private processBlocks(
    file: string,
    className: string,
    blocks: DiffBlock[],
    methodSignatures: Map<string, MethodSignatureTracker>,
    result: DiffAnalysisResult
  ): void {
    for (const block of blocks) {
      this.processBlock(file, className, block, methodSignatures, result);
    }
  }

  private processBlock(
    file: string,
    className: string,
    block: DiffBlock,
    methodSignatures: Map<string, MethodSignatureTracker>,
    result: DiffAnalysisResult
  ): void {
    // Check if block contains multiple method signatures (added or removed)
    const methodSignaturesInBlock = this.findMethodSignaturesInBlock(block);
    
    if (block.methodNameFromContext === null || methodSignaturesInBlock.length > 0) {
      this.processBlockWithoutMethodContext(file, className, block, methodSignatures, result);
      return;
    }

    const methodName = this.extractMethodNameFromBlock(block);
    if (!methodName) return;
    if (!this.blockHasChanges(block)) return;

    const methodDetails = this.extractMethodDetails(block);
    const fqcn = `${this.phpParser.buildFQCN(file, className)}::${methodName}`;
    const changeType = this.determineChangeType(methodName, block, methodSignatures);

    if (changeType === ChangeType.NEW) {
      result.newMethods.push(this.createNewMethodChange(methodName, className, fqcn, file, methodDetails, block));
      return;
    }

    if (changeType === ChangeType.MODIFIED) {
      result.modifiedMethods.push(this.createModifiedMethodChange(methodName, className, fqcn, file, methodDetails, block, methodSignatures));
    }
  }

  private findMethodSignaturesInBlock(block: DiffBlock): string[] {
    const methodNames: string[] = [];
    
    for (const line of block.lines) {
      if (!this.isAddition(line) && !this.isRemoval(line)) continue;
      
      const cleanLine = this.removeDiffPrefix(line);
      // Only match complete method signatures (with 'function' keyword)
      const methodMatch = cleanLine.match(/^\s*(?:public|protected|private)?\s*(?:static\s+)?function\s+(\w+)\s*\(/);
      
      if (methodMatch) {
        methodNames.push(methodMatch[1]);
      }
    }
    
    return methodNames;
  }

  private processBlockWithoutMethodContext(
    file: string,
    className: string,
    block: DiffBlock,
    methodSignatures: Map<string, MethodSignatureTracker>,
    result: DiffAnalysisResult
  ): void {
    const methodsInBlock = new Map<string, { additions: string[]; removals: string[]; lines: string[] }>();
    let currentMethod: string | null = null;

    for (const line of block.lines) {
      const cleanLine = this.removeDiffPrefix(line);
      const methodMatch = cleanLine.match(PhpPattern.METHOD_SIGNATURE);
      
      if (methodMatch) {
        currentMethod = methodMatch[1];
        if (!methodsInBlock.has(currentMethod)) {
          methodsInBlock.set(currentMethod, { additions: [], removals: [], lines: [] });
        }
      }

      if (cleanLine.match(AnalyzerConfig.patterns.closingBrace)) {
        currentMethod = null;
      }

      if (!currentMethod || !methodsInBlock.has(currentMethod)) continue;

      const methodData = methodsInBlock.get(currentMethod)!;
      methodData.lines.push(line);
      
      if (this.isAddition(line)) {
        methodData.additions.push(line.slice(1));
      }
      
      if (this.isRemoval(line)) {
        methodData.removals.push(line.slice(1));
      }
    }

    for (const [methodName, methodData] of methodsInBlock.entries()) {
      if (methodData.additions.length === 0 && methodData.removals.length === 0) continue;

      const methodBlock: DiffBlock = {
        context: block.context,
        lines: methodData.lines,
        additions: methodData.additions,
        removals: methodData.removals,
        methodNameFromContext: methodName,
      };

      const methodDetails = this.extractMethodDetails(methodBlock);
      const fqcn = `${this.phpParser.buildFQCN(file, className)}::${methodName}`;
      const changeType = this.determineChangeType(methodName, methodBlock, methodSignatures);

      if (changeType === ChangeType.NEW) {
        result.newMethods.push(this.createNewMethodChange(methodName, className, fqcn, file, methodDetails, methodBlock));
        continue;
      }

      if (changeType === ChangeType.MODIFIED) {
        result.modifiedMethods.push(this.createModifiedMethodChange(methodName, className, fqcn, file, methodDetails, methodBlock, methodSignatures));
      }
    }
  }

  private buildMethodSignatureTracker(diffText: string): Map<string, MethodSignatureTracker> {
    const tracker = new Map<string, MethodSignatureTracker>();
    const lines = diffText.split('\n');

    for (const line of lines) {
      this.processSignatureLine(line, tracker);
    }

    return tracker;
  }

  private processSignatureLine(line: string, tracker: Map<string, MethodSignatureTracker>): void {
    const methodMatch = line.match(PhpPattern.DIFF_METHOD_SIGNATURE);
    if (!methodMatch) return;

    const [, prefix, , methodName] = methodMatch;
    
    this.ensureMethodInTracker(methodName, tracker);
    this.updateMethodSignature(methodName, prefix, tracker);
  }

  private ensureMethodInTracker(methodName: string, tracker: Map<string, MethodSignatureTracker>): void {
    if (tracker.has(methodName)) return;
    
    tracker.set(methodName, { added: false, removed: false });
  }

  private updateMethodSignature(methodName: string, prefix: string, tracker: Map<string, MethodSignatureTracker>): void {
    const signature = tracker.get(methodName)!;
    
    if (prefix === DiffPrefixes.ADDITION) {
      signature.added = true;
    }
    
    if (prefix === DiffPrefixes.REMOVAL) {
      signature.removed = true;
    }
  }

  private extractMethodNameFromBlock(block: DiffBlock): string | null {
    const methodFromNewSignature = this.findMethodNameInAdditions(block);
    if (methodFromNewSignature) return methodFromNewSignature;

    // Check if changes contain a method signature - if so, use that instead of context
    const methodInChanges = this.findMethodNameInChanges(block);
    if (methodInChanges) return methodInChanges;

    // If context shows __construct but no actual changes to constructor, skip it
    if (block.methodNameFromContext === '__construct' && !this.hasConstructorChanges(block)) {
      return null;
    }

    if (block.methodNameFromContext) return block.methodNameFromContext;

    return this.findMethodNameInBlockLines(block);
  }

  private hasConstructorChanges(block: DiffBlock): boolean {
    // Check if any additions or removals contain constructor-related code
    for (const line of [...block.additions, ...block.removals]) {
      // If the line contains the constructor signature, it's a real change
      if (line.match(/function\s+__construct/)) {
        return true;
      }
    }
    return false;
  }

  private findMethodNameInChanges(block: DiffBlock): string | null {
    // Look for method signatures in actual changes (additions/removals)
    for (const line of [...block.additions, ...block.removals]) {
      const methodMatch = line.match(PhpPattern.METHOD_SIGNATURE);
      if (methodMatch) return methodMatch[1];
    }
    return null;
  }

  private findMethodNameInAdditions(block: DiffBlock): string | null {
    const hasOnlyAdditions = block.additions.length > 0 && block.removals.length === 0;
    if (!hasOnlyAdditions) return null;

    for (const line of block.additions) {
      const methodName = this.phpParser.extractMethodNameFromLine(line);
      if (methodName) return methodName;
    }

    return null;
  }

  private findMethodNameInBlockLines(block: DiffBlock): string | null {
    for (const line of block.lines) {
      const methodName = this.phpParser.extractMethodNameFromLine(line);
      if (methodName) return methodName;
    }
    
    return null;
  }

  private blockHasChanges(block: DiffBlock): boolean {
    return block.additions.length > 0 || block.removals.length > 0;
  }

  private extractMethodDetails(block: DiffBlock): { visibility: string; params: string } {
    for (const line of block.lines) {
      const methodMatch = line.match(PhpPattern.METHOD_SIGNATURE);
      if (!methodMatch) continue;

      const visibility = line.match(AnalyzerConfig.patterns.visibilityModifier)?.[1] || AnalyzerConfig.visibilityModifiers.public;
      return { visibility, params: '' };
    }
    
    return { visibility: AnalyzerConfig.visibilityModifiers.public, params: '' };
  }

  private determineChangeType(
    methodName: string,
    block: DiffBlock,
    tracker: Map<string, MethodSignatureTracker>
  ): typeof ChangeType.NEW | typeof ChangeType.MODIFIED | typeof ChangeType.NONE {
    const signature = tracker.get(methodName);
    const isNew = signature?.added && !signature.removed;
    const hasChanges = block.additions.length > 0 || block.removals.length > 0;

    if (isNew) return ChangeType.NEW;
    if (hasChanges) return ChangeType.MODIFIED;
    
    return ChangeType.NONE;
  }

  private createNewMethodChange(
    methodName: string,
    _className: string,
    fqcn: string,
    file: string,
    details: { visibility: string; params: string },
    block: DiffBlock
  ): MethodChange {
    return {
      name: methodName,
      fqcn,
      file,
      visibility: details.visibility,
      params: details.params,
      addedLines: block.additions,
      context: block.context,
    };
  }

  private createModifiedMethodChange(
    methodName: string,
    _className: string,
    fqcn: string,
    file: string,
    details: { visibility: string; params: string },
    block: DiffBlock,
    methodSignatures: Map<string, MethodSignatureTracker>
  ): MethodChange {
    const tracker = methodSignatures.get(methodName);
    const signatureLineChanged = tracker ? (tracker.added || tracker.removed) : false;
    const parameterChanged = this.hasParameterChanges(block);
    const signatureChanged = signatureLineChanged || parameterChanged;

    return {
      name: methodName,
      fqcn,
      file,
      visibility: details.visibility,
      params: details.params,
      signatureChanged,
      addedLines: block.additions,
      removedLines: block.removals,
      context: block.context,
    };
  }

  private hasParameterChanges(block: DiffBlock): boolean {
    // Check if there are changes to parameter lines
    // Parameters are in the method signature, not in the body
    // Look for lines that have type hints before $variable (not assignments or calls)
    // e.g., "bool $isChanged", "SomeClass $param,", "array $items)"
    // Exclude lines with = (assignments), -> (method calls), :: (static calls)
    const parameterPattern = /\$\w+\s*[,)]/;
    const bodyPattern = /=|->|::|;|\{|\}/;
    
    for (const addition of block.additions) {
      if (parameterPattern.test(addition) && !bodyPattern.test(addition)) {
        return true;
      }
    }
    
    for (const removal of block.removals) {
      if (parameterPattern.test(removal) && !bodyPattern.test(removal)) {
        return true;
      }
    }
    
    return false;
  }

  private parseDiffBlocks(diffText: string): DiffBlock[] {
    const lines = diffText.split('\n');
    const blocks: DiffBlock[] = [];
    let currentBlock: DiffBlock | null = null;

    for (const line of lines) {
      if (this.isBlockHeader(line)) {
        currentBlock = this.startNewBlock(line, blocks, currentBlock);
        continue;
      }

      if (currentBlock) {
        this.addLineToBlock(line, currentBlock);
      }
    }

    this.finalizeBlock(currentBlock, blocks);

    return blocks;
  }

  private isBlockHeader(line: string): boolean {
    return line.startsWith(AnalyzerConfig.diffBlockMarker);
  }

  private startNewBlock(line: string, blocks: DiffBlock[], currentBlock: DiffBlock | null): DiffBlock {
    this.finalizeBlock(currentBlock, blocks);

    return {
      context: line,
      lines: [],
      additions: [],
      removals: [],
      methodNameFromContext: this.extractMethodNameFromContext(line),
    };
  }

  private finalizeBlock(block: DiffBlock | null, blocks: DiffBlock[]): void {
    if (!block || block.lines.length === 0) return;
    blocks.push(block);
  }

  private extractMethodNameFromContext(contextLine: string): string | null {
    const match = contextLine.match(/@@.*?@@\s*(?:public|protected|private)?\s*(?:static\s+)?function\s+(\w+)/);
    return match ? match[1] : null;
  }

  private addLineToBlock(line: string, block: DiffBlock): void {
    block.lines.push(line);

    if (this.isAddition(line)) {
      block.additions.push(line.slice(1));
    }
    
    if (this.isRemoval(line)) {
      block.removals.push(line.slice(1));
    }
  }

  private removeDiffPrefix(line: string): string {
    const prefixes = [AnalyzerConfig.diffPrefixChars.added, AnalyzerConfig.diffPrefixChars.removed, AnalyzerConfig.diffPrefixChars.unchanged];
    return prefixes.some(p => line.startsWith(p)) ? line.slice(1) : line;
  }

  private isAddition(line: string): boolean {
    return line.startsWith(DiffPrefixes.ADDITION) && 
           !line.startsWith(DiffPrefixes.ADDITION_FILE);
  }

  private isRemoval(line: string): boolean {
    return line.startsWith(DiffPrefixes.REMOVAL) && 
           !line.startsWith(DiffPrefixes.REMOVAL_FILE);
  }

}
