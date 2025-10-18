"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantAnalyzer = void 0;
const module_patterns_1 = require("../../spryker/patterns/module-patterns");
class ConstantAnalyzer {
    constructor(gitHelper) {
        this.gitHelper = gitHelper;
    }
    async analyzeConstantChanges(files, baseCommit) {
        const changes = [];
        const phpFiles = files.filter(f => f.endsWith(module_patterns_1.AnalyzerConfig.filePatterns.phpExtension));
        for (const file of phpFiles) {
            const filePath = file.split('\t')[1] || file;
            const diff = this.gitHelper.getFileDiff(baseCommit, filePath);
            if (!diff || diff.trim() === '') {
                continue;
            }
            const constantChange = await this.analyzeFile(filePath, diff, baseCommit);
            if (constantChange && this.hasConstantChanges(constantChange)) {
                changes.push(constantChange);
            }
        }
        return changes;
    }
    async analyzeFile(file, diff, baseCommit) {
        const changeType = this.determineChangeType(diff);
        if (changeType === module_patterns_1.AnalyzerConfig.changeTypes.new || changeType === module_patterns_1.AnalyzerConfig.changeTypes.removed) {
            // For new/removed files, we don't track individual constants
            return null;
        }
        const oldContent = this.gitHelper.getFileContent(baseCommit, file);
        const newContent = this.gitHelper.getCurrentFileContent(file);
        const oldConstants = this.extractConstants(oldContent);
        const newConstants = this.extractConstants(newContent);
        const addedConstants = [];
        const removedConstants = [];
        const modifiedConstants = [];
        // Find added constants
        for (const [name, info] of newConstants) {
            if (!oldConstants.has(name)) {
                addedConstants.push(info);
            }
            else {
                const oldInfo = oldConstants.get(name);
                if (oldInfo.value !== info.value) {
                    modifiedConstants.push({
                        name,
                        oldValue: oldInfo.value,
                        newValue: info.value,
                        visibility: info.visibility,
                    });
                }
            }
        }
        // Find removed constants
        for (const [name, info] of oldConstants) {
            if (!newConstants.has(name)) {
                removedConstants.push(info);
            }
        }
        const className = this.extractClassName(file);
        const fqcn = this.extractFQCN(newContent || oldContent, file);
        const isConfigOrConstants = this.isConfigOrConstantsFile(file, className);
        return {
            file,
            className,
            fqcn,
            changeType: module_patterns_1.AnalyzerConfig.changeTypes.modified,
            isConfigOrConstants,
            addedConstants: addedConstants.length > 0 ? addedConstants : undefined,
            removedConstants: removedConstants.length > 0 ? removedConstants : undefined,
            modifiedConstants: modifiedConstants.length > 0 ? modifiedConstants : undefined,
        };
    }
    extractConstants(content) {
        const constants = new Map();
        if (!content)
            return constants;
        // Match: public const NAME = 'value';
        // Match: protected const NAME = 'value';
        // Match: private const NAME = 'value';
        // Match: const NAME = 'value'; (defaults to public)
        const constPattern = /^\s*(public|protected|private)?\s*const\s+([A-Z_][A-Z0-9_]*)\s*=\s*(.+?);/gm;
        let match;
        while ((match = constPattern.exec(content)) !== null) {
            const visibility = (match[1] || 'public');
            const name = match[2];
            const value = match[3].trim();
            constants.set(name, {
                name,
                value,
                visibility,
            });
        }
        return constants;
    }
    extractClassName(file) {
        const parts = file.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.php', '');
    }
    extractFQCN(content, file) {
        const namespaceMatch = content.match(/namespace\s+([\w\\]+);/);
        const className = this.extractClassName(file);
        if (namespaceMatch) {
            return `${namespaceMatch[1]}\\${className}`;
        }
        return className;
    }
    determineChangeType(diff) {
        if (diff.includes(module_patterns_1.AnalyzerConfig.diffMarkers.newFile)) {
            return module_patterns_1.AnalyzerConfig.changeTypes.new;
        }
        if (diff.includes(module_patterns_1.AnalyzerConfig.diffMarkers.deletedFile)) {
            return module_patterns_1.AnalyzerConfig.changeTypes.removed;
        }
        return module_patterns_1.AnalyzerConfig.changeTypes.modified;
    }
    hasConstantChanges(change) {
        return !!((change.addedConstants && change.addedConstants.length > 0) ||
            (change.removedConstants && change.removedConstants.length > 0) ||
            (change.modifiedConstants && change.modifiedConstants.length > 0));
    }
    isConfigOrConstantsFile(file, className) {
        // Check if class name ends with Config or Constants
        if (className.endsWith('Config') || className.endsWith('Constants')) {
            return true;
        }
        // Check if file path contains /Config/ directory
        if (file.includes('/Config/')) {
            return true;
        }
        return false;
    }
}
exports.ConstantAnalyzer = ConstantAnalyzer;
//# sourceMappingURL=constant-analyzer.js.map