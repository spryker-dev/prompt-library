"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffAnalyzer = void 0;
const analyzer_config_1 = require("./config/analyzer-config");
const git_helper_1 = require("./utils/git-helper");
const file_filter_1 = require("./utils/file-filter");
const php_parser_1 = require("./utils/php-parser");
const transfer_analyzer_1 = require("./analyzers/transfer-analyzer");
const method_analyzer_1 = require("./analyzers/method-analyzer");
const schema_analyzer_1 = require("./analyzers/schema-analyzer");
const constant_analyzer_1 = require("./analyzers/constant-analyzer");
class DiffAnalyzer {
    constructor(root, baseCommit, includeTests, _logger, modules) {
        this.baseCommit = baseCommit;
        this.gitHelper = new git_helper_1.GitHelper(root, modules);
        this.fileFilter = new file_filter_1.FileFilter(includeTests);
        this.phpParser = new php_parser_1.PHPParser();
        this.transferAnalyzer = new transfer_analyzer_1.TransferAnalyzer(this.gitHelper);
        this.methodAnalyzer = new method_analyzer_1.MethodAnalyzer(this.phpParser, root);
        this.schemaAnalyzer = new schema_analyzer_1.SchemaAnalyzer(this.gitHelper);
        this.constantAnalyzer = new constant_analyzer_1.ConstantAnalyzer(this.gitHelper);
    }
    async analyze() {
        const baseCommit = this.gitHelper.getMergeBase(this.baseCommit);
        const allChangedFiles = this.gitHelper.getAllChangedFiles(baseCommit);
        const result = this.createEmptyResult();
        result.nonPhpFiles = this.fileFilter.identifyNonPhpFiles(allChangedFiles, (status) => this.gitHelper.mapGitStatusToChangeType(status));
        result.transferChanges = await this.transferAnalyzer.analyzeTransferChanges(allChangedFiles, baseCommit);
        result.schemaChanges = await this.schemaAnalyzer.analyzeSchemaChanges(allChangedFiles, baseCommit);
        result.constantChanges = await this.constantAnalyzer.analyzeConstantChanges(allChangedFiles, baseCommit);
        const phpFilesWithStatus = this.fileFilter.filterPhpFilesWithStatus(allChangedFiles);
        this.analyzePhpFiles(phpFilesWithStatus, baseCommit, result);
        return result;
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
    analyzePhpFiles(phpFiles, baseCommit, result) {
        for (const item of phpFiles) {
            this.analyzePhpFile(item.file, item.status, baseCommit, result);
        }
    }
    analyzePhpFile(file, status, baseCommit, result) {
        try {
            if (status === analyzer_config_1.AnalyzerConfig.gitStatus.added) {
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
        }
        catch (error) {
            result.skippedFiles.push(this.createSkippedFileForError(file, error));
        }
    }
    detectClassDeprecation(file, diff, result) {
        const deprecationPattern = /^\+\s*\*\s*@deprecated/m;
        if (!deprecationPattern.test(diff))
            return;
        const classPattern = /^[+ ]?\s*class\s+(\w+)/m;
        const classMatch = diff.match(classPattern);
        if (!classMatch)
            return;
        const className = classMatch[1];
        const fqcn = this.phpParser.buildFQCN(file, className);
        result.deprecatedClasses.push({ name: className, fqcn, file });
    }
    trackModifiedFile(file, analysis, result) {
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
    extractLayer(file) {
        const layers = analyzer_config_1.AnalyzerConfig.spryker.layers;
        const internalLayers = analyzer_config_1.AnalyzerConfig.spryker.internalApiLayers;
        // Check internal layers first
        for (const layer of internalLayers) {
            if (file.includes(`/${layer}/`))
                return layer;
        }
        // Check other layers
        for (const layer of layers) {
            if (file.includes(`/${layer}/`))
                return layer;
        }
        return 'Unknown';
    }
    createSkippedFileForEmptyDiff(file) {
        return {
            file,
            reason: analyzer_config_1.AnalyzerConfig.skipReasons.emptyDiff,
            suggestion: 'File may have only whitespace changes or be renamed without content changes',
        };
    }
    createSkippedFileForError(file, error) {
        return {
            file,
            reason: error.message || analyzer_config_1.AnalyzerConfig.skipReasons.unknownError,
            error: error.stack,
            suggestion: 'Review this file manually or check if it has syntax errors',
        };
    }
    mergeAnalysisResults(analysis, result) {
        result.newMethods.push(...analysis.newMethods);
        result.modifiedMethods.push(...analysis.modifiedMethods);
        result.removedMethods.push(...analysis.removedMethods);
        result.newClasses.push(...analysis.newClasses);
        result.deprecatedClasses.push(...analysis.deprecatedClasses);
        result.skippedFiles.push(...analysis.skippedFiles);
    }
}
exports.DiffAnalyzer = DiffAnalyzer;
//# sourceMappingURL=diff-analyzer.js.map