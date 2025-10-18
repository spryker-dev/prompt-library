"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposerAnalyzer = void 0;
const module_patterns_1 = require("../../spryker/patterns/module-patterns");
class ComposerAnalyzer {
    constructor(gitHelper) {
        this.gitHelper = gitHelper;
    }
    async analyzeComposerChanges(files, baseCommit) {
        const composerFiles = files.filter(f => f.includes(module_patterns_1.AnalyzerConfig.filePatterns.composerJson));
        const changes = [];
        for (const file of composerFiles) {
            const filePath = file.split('\t')[1] || file;
            const diff = this.gitHelper.getFileDiff(baseCommit, filePath);
            if (!diff || diff.trim() === '') {
                continue;
            }
            const change = await this.parseComposerChange(filePath, diff, baseCommit);
            if (change) {
                changes.push(change);
            }
        }
        return changes;
    }
    async parseComposerChange(file, diff, baseCommit) {
        const changeType = this.determineChangeType(diff);
        if (changeType === module_patterns_1.AnalyzerConfig.changeTypes.removed) {
            return {
                file,
                changeType: module_patterns_1.AnalyzerConfig.changeTypes.removed,
                dependencyChanges: [],
            };
        }
        if (changeType === module_patterns_1.AnalyzerConfig.changeTypes.new) {
            return {
                file,
                changeType: module_patterns_1.AnalyzerConfig.changeTypes.new,
                dependencyChanges: [],
            };
        }
        const oldContent = this.gitHelper.getFileContent(baseCommit, file);
        const newContent = this.gitHelper.getCurrentFileContent(file);
        const oldJson = this.parseJson(oldContent);
        const newJson = this.parseJson(newContent);
        if (!oldJson || !newJson) {
            return null;
        }
        const phpVersionChange = this.detectPhpVersionChange(oldJson, newJson);
        const dependencyChanges = this.detectDependencyChanges(oldJson, newJson);
        return {
            file,
            changeType: module_patterns_1.AnalyzerConfig.changeTypes.modified,
            phpVersionChange,
            dependencyChanges,
        };
    }
    detectPhpVersionChange(oldJson, newJson) {
        const oldPhp = oldJson[module_patterns_1.AnalyzerConfig.composerKeys.require]?.[module_patterns_1.AnalyzerConfig.composerKeys.php];
        const newPhp = newJson[module_patterns_1.AnalyzerConfig.composerKeys.require]?.[module_patterns_1.AnalyzerConfig.composerKeys.php];
        if (oldPhp === newPhp) {
            return undefined;
        }
        if (!oldPhp && newPhp) {
            return {
                new: newPhp,
                changeType: module_patterns_1.AnalyzerConfig.versionChangeTypes.added,
                requiresMajor: true,
            };
        }
        if (oldPhp && !newPhp) {
            return {
                old: oldPhp,
                changeType: module_patterns_1.AnalyzerConfig.versionChangeTypes.removed,
                requiresMajor: true,
            };
        }
        if (oldPhp && newPhp) {
            const changeType = this.comparePhpVersions(oldPhp, newPhp);
            return {
                old: oldPhp,
                new: newPhp,
                changeType,
                requiresMajor: changeType === module_patterns_1.AnalyzerConfig.versionChangeTypes.upgraded,
            };
        }
        return undefined;
    }
    comparePhpVersions(oldVersion, newVersion) {
        // Extract minimum version from constraint
        const oldMin = this.extractMinVersion(oldVersion);
        const newMin = this.extractMinVersion(newVersion);
        if (oldMin === newMin) {
            return module_patterns_1.AnalyzerConfig.versionChangeTypes.unchanged;
        }
        // Simple comparison - in reality would need proper semver comparison
        if (newMin > oldMin) {
            return module_patterns_1.AnalyzerConfig.versionChangeTypes.upgraded;
        }
        return module_patterns_1.AnalyzerConfig.versionChangeTypes.downgraded;
    }
    extractMinVersion(constraint) {
        // Remove operators and extract version
        // e.g., ">=7.4" -> "7.4", "^8.0" -> "8.0"
        return constraint.replace(/[^0-9.]/g, '');
    }
    detectDependencyChanges(oldJson, newJson) {
        const changes = [];
        const oldDeps = { ...oldJson[module_patterns_1.AnalyzerConfig.composerKeys.require], ...oldJson[module_patterns_1.AnalyzerConfig.composerKeys.requireDev] };
        const newDeps = { ...newJson[module_patterns_1.AnalyzerConfig.composerKeys.require], ...newJson[module_patterns_1.AnalyzerConfig.composerKeys.requireDev] };
        const allPackages = new Set([...Object.keys(oldDeps), ...Object.keys(newDeps)]);
        for (const pkg of allPackages) {
            if (pkg === module_patterns_1.AnalyzerConfig.composerKeys.php)
                continue; // Already handled separately
            const oldConstraint = oldDeps[pkg];
            const newConstraint = newDeps[pkg];
            if (!oldConstraint && newConstraint) {
                changes.push({
                    package: pkg,
                    changeType: module_patterns_1.AnalyzerConfig.changeTypes.added,
                    newConstraint,
                    requiresMajor: false,
                });
            }
            else if (oldConstraint && !newConstraint) {
                changes.push({
                    package: pkg,
                    changeType: module_patterns_1.AnalyzerConfig.changeTypes.removed,
                    oldConstraint,
                    requiresMajor: true,
                });
            }
            else if (oldConstraint !== newConstraint) {
                const constraintChangeType = this.compareConstraints(oldConstraint, newConstraint);
                changes.push({
                    package: pkg,
                    changeType: module_patterns_1.AnalyzerConfig.changeTypes.modified,
                    oldConstraint,
                    newConstraint,
                    constraintChangeType,
                    requiresMajor: constraintChangeType === module_patterns_1.AnalyzerConfig.constraintChangeTypes.major || constraintChangeType === module_patterns_1.AnalyzerConfig.constraintChangeTypes.tightened,
                });
            }
        }
        return changes;
    }
    compareConstraints(oldConstraint, newConstraint) {
        if (oldConstraint === newConstraint) {
            return module_patterns_1.AnalyzerConfig.constraintChangeTypes.unchanged;
        }
        // Detect if constraint was relaxed (e.g., ^1.0 -> ^1.0 || ^2.0)
        if (newConstraint.includes(module_patterns_1.AnalyzerConfig.diffMarkers.orOperator) && !oldConstraint.includes(module_patterns_1.AnalyzerConfig.diffMarkers.orOperator)) {
            return module_patterns_1.AnalyzerConfig.constraintChangeTypes.relaxed;
        }
        // Detect if constraint was tightened (e.g., ^1.0 || ^2.0 -> ^2.0)
        if (oldConstraint.includes(module_patterns_1.AnalyzerConfig.diffMarkers.orOperator) && !newConstraint.includes(module_patterns_1.AnalyzerConfig.diffMarkers.orOperator)) {
            return module_patterns_1.AnalyzerConfig.constraintChangeTypes.tightened;
        }
        // Extract major versions
        const oldMajor = this.extractMajorVersion(oldConstraint);
        const newMajor = this.extractMajorVersion(newConstraint);
        if (oldMajor !== newMajor) {
            return module_patterns_1.AnalyzerConfig.constraintChangeTypes.major;
        }
        // Extract minor versions
        const oldMinor = this.extractMinorVersion(oldConstraint);
        const newMinor = this.extractMinorVersion(newConstraint);
        if (oldMinor !== newMinor) {
            return module_patterns_1.AnalyzerConfig.constraintChangeTypes.minor;
        }
        return module_patterns_1.AnalyzerConfig.constraintChangeTypes.patch;
    }
    extractMajorVersion(constraint) {
        const match = constraint.match(/(\d+)\./);
        return match ? match[1] : '0';
    }
    extractMinorVersion(constraint) {
        const match = constraint.match(/\d+\.(\d+)/);
        return match ? match[1] : '0';
    }
    parseJson(content) {
        try {
            return JSON.parse(content);
        }
        catch {
            return null;
        }
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
}
exports.ComposerAnalyzer = ComposerAnalyzer;
//# sourceMappingURL=composer-analyzer.js.map