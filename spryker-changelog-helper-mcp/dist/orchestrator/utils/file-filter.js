"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileFilter = void 0;
const analyzer_config_1 = require("../config/analyzer-config");
class FileFilter {
    constructor(includeTests) {
        this.includeTests = includeTests;
    }
    filterPhpFiles(gitStatusLines) {
        const phpFiles = gitStatusLines
            .filter((line) => {
            const parts = line.split(/\s+/);
            const file = parts[1] || '';
            return file.endsWith(analyzer_config_1.AnalyzerConfig.fileExtensions.php);
        })
            .map((line) => {
            const parts = line.split(/\s+/);
            return parts[1];
        });
        return this.includeTests
            ? phpFiles
            : phpFiles.filter((f) => !analyzer_config_1.AnalyzerConfig.patterns.testDirectory.test(f));
    }
    filterPhpFilesWithStatus(gitStatusLines) {
        const phpFiles = gitStatusLines
            .filter((line) => {
            const file = line.split('\t')[1] || line.split(/\s+/)[1] || '';
            return file.endsWith(analyzer_config_1.AnalyzerConfig.fileExtensions.php);
        })
            .map((line) => {
            const parts = line.split('\t');
            if (parts.length >= 2) {
                return { status: parts[0], file: parts[1] };
            }
            // Fallback to whitespace split
            const spaceParts = line.split(/\s+/);
            return { status: spaceParts[0], file: spaceParts[1] };
        });
        return this.includeTests
            ? phpFiles
            : phpFiles.filter((item) => !analyzer_config_1.AnalyzerConfig.patterns.testDirectory.test(item.file));
    }
    identifyNonPhpFiles(gitStatusLines, mapGitStatus) {
        const nonPhpFiles = [];
        for (const line of gitStatusLines) {
            const parts = line.split(/\s+/);
            const status = parts[0];
            const file = parts[1];
            if (!file || file.endsWith(analyzer_config_1.AnalyzerConfig.fileExtensions.php))
                continue;
            const hasRelevantExtension = analyzer_config_1.AnalyzerConfig.relevantNonPhpExtensions.some((ext) => file.endsWith(ext));
            if (!hasRelevantExtension)
                continue;
            const fileType = file.split('.').pop() || 'unknown';
            const changeType = mapGitStatus(status);
            nonPhpFiles.push({ file, fileType, changeType });
        }
        return nonPhpFiles;
    }
}
exports.FileFilter = FileFilter;
//# sourceMappingURL=file-filter.js.map