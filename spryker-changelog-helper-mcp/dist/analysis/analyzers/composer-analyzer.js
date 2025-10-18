"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposerAnalyzer = void 0;
const file_constants_1 = require("../constants/file-constants");
const php_constants_1 = require("../constants/php-constants");
const change_constants_1 = require("../constants/change-constants");
const git_constants_1 = require("../constants/git-constants");
class ComposerAnalyzer {
    constructor(gitHelper) {
        this.gitHelper = gitHelper;
    }
    async analyzeComposerChanges(files, baseCommit) {
        const composerFiles = files.filter(f => f.includes(file_constants_1.FilePattern.COMPOSER_JSON));
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
        if (changeType === change_constants_1.ChangeType.REMOVED) {
            return {
                file,
                changeType: change_constants_1.ChangeType.REMOVED,
                dependencyChanges: [],
            };
        }
        if (changeType === change_constants_1.ChangeType.NEW) {
            return {
                file,
                changeType: change_constants_1.ChangeType.NEW,
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
            changeType: change_constants_1.ChangeType.MODIFIED,
            phpVersionChange,
            dependencyChanges,
        };
    }
    detectPhpVersionChange(oldJson, newJson) {
        const oldPhp = oldJson[php_constants_1.ComposerKey.REQUIRE]?.[php_constants_1.ComposerKey.PHP];
        const newPhp = newJson[php_constants_1.ComposerKey.REQUIRE]?.[php_constants_1.ComposerKey.PHP];
        if (oldPhp === newPhp) {
            return undefined;
        }
        if (!oldPhp && newPhp) {
            return {
                new: newPhp,
                changeType: change_constants_1.VersionChangeType.ADDED,
                requiresMajor: true,
            };
        }
        if (oldPhp && !newPhp) {
            return {
                old: oldPhp,
                changeType: change_constants_1.VersionChangeType.REMOVED,
                requiresMajor: true,
            };
        }
        if (oldPhp && newPhp) {
            const changeType = this.comparePhpVersions(oldPhp, newPhp);
            return {
                old: oldPhp,
                new: newPhp,
                changeType,
                requiresMajor: changeType === change_constants_1.VersionChangeType.UPGRADED,
            };
        }
        return undefined;
    }
    comparePhpVersions(oldVersion, newVersion) {
        // Extract minimum version from constraint
        const oldMin = this.extractMinVersion(oldVersion);
        const newMin = this.extractMinVersion(newVersion);
        if (oldMin === newMin) {
            return change_constants_1.VersionChangeType.UNCHANGED;
        }
        // Simple comparison - in reality would need proper semver comparison
        if (newMin > oldMin) {
            return change_constants_1.VersionChangeType.UPGRADED;
        }
        return change_constants_1.VersionChangeType.DOWNGRADED;
    }
    extractMinVersion(constraint) {
        // Remove operators and extract version
        // e.g., ">=7.4" -> "7.4", "^8.0" -> "8.0"
        return constraint.replace(/[^0-9.]/g, '');
    }
    detectDependencyChanges(oldJson, newJson) {
        const changes = [];
        const oldDeps = { ...oldJson[php_constants_1.ComposerKey.REQUIRE], ...oldJson[php_constants_1.ComposerKey.REQUIRE_DEV] };
        const newDeps = { ...newJson[php_constants_1.ComposerKey.REQUIRE], ...newJson[php_constants_1.ComposerKey.REQUIRE_DEV] };
        const allPackages = new Set([...Object.keys(oldDeps), ...Object.keys(newDeps)]);
        for (const pkg of allPackages) {
            if (pkg === php_constants_1.ComposerKey.PHP)
                continue; // Already handled separately
            const oldConstraint = oldDeps[pkg];
            const newConstraint = newDeps[pkg];
            if (!oldConstraint && newConstraint) {
                changes.push({
                    package: pkg,
                    changeType: change_constants_1.ChangeType.ADDED,
                    newConstraint,
                    requiresMajor: false,
                });
            }
            else if (oldConstraint && !newConstraint) {
                changes.push({
                    package: pkg,
                    changeType: change_constants_1.ChangeType.REMOVED,
                    oldConstraint,
                    requiresMajor: true,
                });
            }
            else if (oldConstraint !== newConstraint) {
                const constraintChangeType = this.compareConstraints(oldConstraint, newConstraint);
                changes.push({
                    package: pkg,
                    changeType: change_constants_1.ChangeType.MODIFIED,
                    oldConstraint,
                    newConstraint,
                    constraintChangeType,
                    requiresMajor: constraintChangeType === change_constants_1.ConstraintChangeType.MAJOR || constraintChangeType === change_constants_1.ConstraintChangeType.TIGHTENED,
                });
            }
        }
        return changes;
    }
    compareConstraints(oldConstraint, newConstraint) {
        if (oldConstraint === newConstraint) {
            return change_constants_1.ConstraintChangeType.UNCHANGED;
        }
        // Detect if constraint was relaxed (e.g., ^1.0 -> ^1.0 || ^2.0)
        if (newConstraint.includes(git_constants_1.DiffMarkers.OR_OPERATOR) && !oldConstraint.includes(git_constants_1.DiffMarkers.OR_OPERATOR)) {
            return change_constants_1.ConstraintChangeType.RELAXED;
        }
        // Detect if constraint was tightened (e.g., ^1.0 || ^2.0 -> ^2.0)
        if (oldConstraint.includes(git_constants_1.DiffMarkers.OR_OPERATOR) && !newConstraint.includes(git_constants_1.DiffMarkers.OR_OPERATOR)) {
            return change_constants_1.ConstraintChangeType.TIGHTENED;
        }
        // Extract major versions
        const oldMajor = this.extractMajorVersion(oldConstraint);
        const newMajor = this.extractMajorVersion(newConstraint);
        if (oldMajor !== newMajor) {
            return change_constants_1.ConstraintChangeType.MAJOR;
        }
        // Extract minor versions
        const oldMinor = this.extractMinorVersion(oldConstraint);
        const newMinor = this.extractMinorVersion(newConstraint);
        if (oldMinor !== newMinor) {
            return change_constants_1.ConstraintChangeType.MINOR;
        }
        return change_constants_1.ConstraintChangeType.PATCH;
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
        if (diff.includes(git_constants_1.DiffMarkers.NEW_FILE)) {
            return change_constants_1.ChangeType.NEW;
        }
        if (diff.includes(git_constants_1.DiffMarkers.DELETED_FILE)) {
            return change_constants_1.ChangeType.REMOVED;
        }
        return change_constants_1.ChangeType.MODIFIED;
    }
}
exports.ComposerAnalyzer = ComposerAnalyzer;
//# sourceMappingURL=composer-analyzer.js.map