"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHelper = void 0;
const child_process_1 = require("child_process");
const module_patterns_1 = require("../../spryker/patterns/module-patterns");
class GitHelper {
    constructor(root, modules) {
        this.root = root;
        this.modules = modules;
    }
    getMergeBase(baseRef) {
        return (0, child_process_1.execSync)(`git merge-base ${baseRef} HEAD`, {
            cwd: this.root,
            encoding: 'utf-8',
        }).trim();
    }
    getAllChangedFiles(baseCommit) {
        const path = require('path');
        const allFiles = (0, child_process_1.execSync)(`git diff --name-status ${baseCommit} HEAD`, {
            cwd: this.root,
            encoding: 'utf-8',
        })
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => line.trim());
        // Get the relative path from git root to the specified root
        const gitRoot = (0, child_process_1.execSync)('git rev-parse --show-toplevel', {
            cwd: this.root,
            encoding: 'utf-8',
        }).trim();
        const relativePath = path.relative(gitRoot, this.root);
        // Filter files by root path
        let filteredFiles = allFiles;
        if (relativePath && relativePath !== '.') {
            filteredFiles = allFiles.filter(line => {
                const filePath = line.split('\t')[1] || line.split(/\s+/)[1];
                return filePath && filePath.startsWith(relativePath);
            });
        }
        // Filter by modules if specified
        if (this.modules && this.modules.length > 0) {
            filteredFiles = filteredFiles.filter(line => {
                const filePath = line.split('\t')[1] || line.split(/\s+/)[1];
                if (!filePath)
                    return false;
                // Check if file path contains any of the specified modules
                // Matches patterns like: Bundles/ModuleName/ or /ModuleName/
                return this.modules.some(module => {
                    const modulePattern = new RegExp(`[/\\\\]${module}[/\\\\]`, 'i');
                    return modulePattern.test(filePath);
                });
            });
        }
        return filteredFiles;
    }
    getFileDiff(baseCommit, file) {
        return (0, child_process_1.execSync)(`git diff --unified=${module_patterns_1.AnalyzerConfig.diffSettings.contextLines} ${baseCommit} HEAD -- "${file}"`, {
            cwd: this.root,
            encoding: 'utf-8',
        }).toString();
    }
    getFileContent(ref, file) {
        try {
            return (0, child_process_1.execSync)(`git show ${ref}:"${file}"`, {
                cwd: this.root,
                encoding: 'utf-8',
            }).toString();
        }
        catch {
            return '';
        }
    }
    getCurrentFileContent(file) {
        try {
            const fs = require('fs');
            const path = require('path');
            const fullPath = path.join(this.root, file);
            return fs.readFileSync(fullPath, 'utf-8');
        }
        catch {
            return '';
        }
    }
    mapGitStatusToChangeType(status) {
        if (status.startsWith(module_patterns_1.AnalyzerConfig.gitStatus.added))
            return 'added';
        if (status.startsWith(module_patterns_1.AnalyzerConfig.gitStatus.deleted))
            return 'deleted';
        return 'modified';
    }
}
exports.GitHelper = GitHelper;
//# sourceMappingURL=git-helper.js.map