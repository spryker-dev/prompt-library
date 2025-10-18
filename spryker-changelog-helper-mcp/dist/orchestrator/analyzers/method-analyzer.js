"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodAnalyzer = void 0;
const analyzer_config_1 = require("../config/analyzer-config");
class MethodAnalyzer {
    constructor(phpParser, _root = '') {
        this.phpParser = phpParser;
    }
    analyzeDiff(file, diffText) {
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
    filterOutRemovedFromModified(result) {
        const removedFqcns = new Set(result.removedMethods.map(m => m.fqcn));
        result.modifiedMethods = result.modifiedMethods.filter(m => !removedFqcns.has(m.fqcn));
    }
    processRemovedMethods(file, className, methodSignatures, result) {
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
    createEmptyResult() {
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
        };
    }
    createSkippedFileForNoClassName(file) {
        return {
            file,
            reason: analyzer_config_1.AnalyzerConfig.skipReasons.noClassName,
            suggestion: 'Ensure file follows naming convention: /path/ClassName.php',
        };
    }
    processBlocks(file, className, blocks, methodSignatures, result) {
        for (const block of blocks) {
            this.processBlock(file, className, block, methodSignatures, result);
        }
    }
    processBlock(file, className, block, methodSignatures, result) {
        // Check if block contains multiple method signatures (added or removed)
        const methodSignaturesInBlock = this.findMethodSignaturesInBlock(block);
        if (block.methodNameFromContext === null || methodSignaturesInBlock.length > 0) {
            this.processBlockWithoutMethodContext(file, className, block, methodSignatures, result);
            return;
        }
        const methodName = this.extractMethodNameFromBlock(block);
        if (!methodName)
            return;
        if (!this.blockHasChanges(block))
            return;
        const methodDetails = this.extractMethodDetails(block);
        const fqcn = `${this.phpParser.buildFQCN(file, className)}::${methodName}`;
        const changeType = this.determineChangeType(methodName, block, methodSignatures);
        if (changeType === analyzer_config_1.AnalyzerConfig.changeTypes.new) {
            result.newMethods.push(this.createNewMethodChange(methodName, className, fqcn, file, methodDetails, block));
            return;
        }
        if (changeType === analyzer_config_1.AnalyzerConfig.changeTypes.modified) {
            result.modifiedMethods.push(this.createModifiedMethodChange(methodName, className, fqcn, file, methodDetails, block, methodSignatures));
        }
    }
    findMethodSignaturesInBlock(block) {
        const methodNames = [];
        for (const line of block.lines) {
            if (!this.isAddition(line) && !this.isRemoval(line))
                continue;
            const cleanLine = this.removeDiffPrefix(line);
            // Only match complete method signatures (with 'function' keyword)
            const methodMatch = cleanLine.match(/^\s*(?:public|protected|private)?\s*(?:static\s+)?function\s+(\w+)\s*\(/);
            if (methodMatch) {
                methodNames.push(methodMatch[1]);
            }
        }
        return methodNames;
    }
    processBlockWithoutMethodContext(file, className, block, methodSignatures, result) {
        const methodsInBlock = new Map();
        let currentMethod = null;
        for (const line of block.lines) {
            const cleanLine = this.removeDiffPrefix(line);
            const methodMatch = cleanLine.match(analyzer_config_1.AnalyzerConfig.patterns.methodSignature);
            if (methodMatch) {
                currentMethod = methodMatch[1];
                if (!methodsInBlock.has(currentMethod)) {
                    methodsInBlock.set(currentMethod, { additions: [], removals: [], lines: [] });
                }
            }
            if (cleanLine.match(analyzer_config_1.AnalyzerConfig.patterns.closingBrace)) {
                currentMethod = null;
            }
            if (!currentMethod || !methodsInBlock.has(currentMethod))
                continue;
            const methodData = methodsInBlock.get(currentMethod);
            methodData.lines.push(line);
            if (this.isAddition(line)) {
                methodData.additions.push(line.slice(1));
            }
            if (this.isRemoval(line)) {
                methodData.removals.push(line.slice(1));
            }
        }
        for (const [methodName, methodData] of methodsInBlock.entries()) {
            if (methodData.additions.length === 0 && methodData.removals.length === 0)
                continue;
            const methodBlock = {
                context: block.context,
                lines: methodData.lines,
                additions: methodData.additions,
                removals: methodData.removals,
                methodNameFromContext: methodName,
            };
            const methodDetails = this.extractMethodDetails(methodBlock);
            const fqcn = `${this.phpParser.buildFQCN(file, className)}::${methodName}`;
            const changeType = this.determineChangeType(methodName, methodBlock, methodSignatures);
            if (changeType === analyzer_config_1.AnalyzerConfig.changeTypes.new) {
                result.newMethods.push(this.createNewMethodChange(methodName, className, fqcn, file, methodDetails, methodBlock));
                continue;
            }
            if (changeType === analyzer_config_1.AnalyzerConfig.changeTypes.modified) {
                result.modifiedMethods.push(this.createModifiedMethodChange(methodName, className, fqcn, file, methodDetails, methodBlock, methodSignatures));
            }
        }
    }
    buildMethodSignatureTracker(diffText) {
        const tracker = new Map();
        const lines = diffText.split('\n');
        for (const line of lines) {
            this.processSignatureLine(line, tracker);
        }
        return tracker;
    }
    processSignatureLine(line, tracker) {
        const methodMatch = line.match(analyzer_config_1.AnalyzerConfig.patterns.diffMethodSignature);
        if (!methodMatch)
            return;
        const [, prefix, , methodName] = methodMatch;
        this.ensureMethodInTracker(methodName, tracker);
        this.updateMethodSignature(methodName, prefix, tracker);
    }
    ensureMethodInTracker(methodName, tracker) {
        if (tracker.has(methodName))
            return;
        tracker.set(methodName, { added: false, removed: false });
    }
    updateMethodSignature(methodName, prefix, tracker) {
        const signature = tracker.get(methodName);
        if (prefix === analyzer_config_1.AnalyzerConfig.diffPrefixes.addition) {
            signature.added = true;
        }
        if (prefix === analyzer_config_1.AnalyzerConfig.diffPrefixes.removal) {
            signature.removed = true;
        }
    }
    extractMethodNameFromBlock(block) {
        const methodFromNewSignature = this.findMethodNameInAdditions(block);
        if (methodFromNewSignature)
            return methodFromNewSignature;
        // Check if changes contain a method signature - if so, use that instead of context
        const methodInChanges = this.findMethodNameInChanges(block);
        if (methodInChanges)
            return methodInChanges;
        // If context shows __construct but no actual changes to constructor, skip it
        if (block.methodNameFromContext === '__construct' && !this.hasConstructorChanges(block)) {
            return null;
        }
        if (block.methodNameFromContext)
            return block.methodNameFromContext;
        return this.findMethodNameInBlockLines(block);
    }
    hasConstructorChanges(block) {
        // Check if any additions or removals contain constructor-related code
        for (const line of [...block.additions, ...block.removals]) {
            // If the line contains the constructor signature, it's a real change
            if (line.match(/function\s+__construct/)) {
                return true;
            }
        }
        return false;
    }
    findMethodNameInChanges(block) {
        // Look for method signatures in actual changes (additions/removals)
        for (const line of [...block.additions, ...block.removals]) {
            const methodMatch = line.match(analyzer_config_1.AnalyzerConfig.patterns.methodSignature);
            if (methodMatch)
                return methodMatch[1];
        }
        return null;
    }
    findMethodNameInAdditions(block) {
        const hasOnlyAdditions = block.additions.length > 0 && block.removals.length === 0;
        if (!hasOnlyAdditions)
            return null;
        for (const line of block.additions) {
            const methodName = this.phpParser.extractMethodNameFromLine(line);
            if (methodName)
                return methodName;
        }
        return null;
    }
    findMethodNameInBlockLines(block) {
        for (const line of block.lines) {
            const methodName = this.phpParser.extractMethodNameFromLine(line);
            if (methodName)
                return methodName;
        }
        return null;
    }
    blockHasChanges(block) {
        return block.additions.length > 0 || block.removals.length > 0;
    }
    extractMethodDetails(block) {
        for (const line of block.lines) {
            const methodMatch = line.match(analyzer_config_1.AnalyzerConfig.patterns.methodSignature);
            if (!methodMatch)
                continue;
            const visibility = line.match(analyzer_config_1.AnalyzerConfig.patterns.visibilityModifier)?.[1] || analyzer_config_1.AnalyzerConfig.visibilityModifiers.public;
            return { visibility, params: '' };
        }
        return { visibility: analyzer_config_1.AnalyzerConfig.visibilityModifiers.public, params: '' };
    }
    determineChangeType(methodName, block, tracker) {
        const signature = tracker.get(methodName);
        const isNew = signature?.added && !signature.removed;
        const hasChanges = block.additions.length > 0 || block.removals.length > 0;
        if (isNew)
            return analyzer_config_1.AnalyzerConfig.changeTypes.new;
        if (hasChanges)
            return analyzer_config_1.AnalyzerConfig.changeTypes.modified;
        return analyzer_config_1.AnalyzerConfig.changeTypes.none;
    }
    createNewMethodChange(methodName, _className, fqcn, file, details, block) {
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
    createModifiedMethodChange(methodName, _className, fqcn, file, details, block, methodSignatures) {
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
    hasParameterChanges(block) {
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
    parseDiffBlocks(diffText) {
        const lines = diffText.split('\n');
        const blocks = [];
        let currentBlock = null;
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
    isBlockHeader(line) {
        return line.startsWith(analyzer_config_1.AnalyzerConfig.diffBlockMarker);
    }
    startNewBlock(line, blocks, currentBlock) {
        this.finalizeBlock(currentBlock, blocks);
        return {
            context: line,
            lines: [],
            additions: [],
            removals: [],
            methodNameFromContext: this.extractMethodNameFromContext(line),
        };
    }
    finalizeBlock(block, blocks) {
        if (!block || block.lines.length === 0)
            return;
        blocks.push(block);
    }
    extractMethodNameFromContext(contextLine) {
        const match = contextLine.match(/@@.*?@@\s*(?:public|protected|private)?\s*(?:static\s+)?function\s+(\w+)/);
        return match ? match[1] : null;
    }
    addLineToBlock(line, block) {
        block.lines.push(line);
        if (this.isAddition(line)) {
            block.additions.push(line.slice(1));
        }
        if (this.isRemoval(line)) {
            block.removals.push(line.slice(1));
        }
    }
    removeDiffPrefix(line) {
        const prefixes = [analyzer_config_1.AnalyzerConfig.diffPrefixChars.added, analyzer_config_1.AnalyzerConfig.diffPrefixChars.removed, analyzer_config_1.AnalyzerConfig.diffPrefixChars.unchanged];
        return prefixes.some(p => line.startsWith(p)) ? line.slice(1) : line;
    }
    isAddition(line) {
        return line.startsWith(analyzer_config_1.AnalyzerConfig.diffPrefixes.addition) &&
            !line.startsWith(analyzer_config_1.AnalyzerConfig.diffPrefixes.additionFileMarker);
    }
    isRemoval(line) {
        return line.startsWith(analyzer_config_1.AnalyzerConfig.diffPrefixes.removal) &&
            !line.startsWith(analyzer_config_1.AnalyzerConfig.diffPrefixes.removalFileMarker);
    }
}
exports.MethodAnalyzer = MethodAnalyzer;
//# sourceMappingURL=method-analyzer.js.map