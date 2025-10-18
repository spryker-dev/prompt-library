"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileFilter = void 0;
const file_constants_1 = require("../analysis/constants/file-constants");
class FileFilter {
    constructor(includeTests) {
        this.includeTests = includeTests;
    }
    filterPhpFiles(gitStatusLines) {
        const phpFiles = gitStatusLines
            .filter((line) => {
            const parts = line.split(/\s+/);
            const file = parts[1] || '';
            return file.endsWith(file_constants_1.FileExtension.PHP);
        })
            .map((line) => {
            const parts = line.split(/\s+/);
            return parts[1];
        });
        return this.includeTests
            ? phpFiles
            : phpFiles.filter((f) => !file_constants_1.FilePattern.TEST_DIRECTORY.test(f));
    }
    filterPhpFilesWithStatus(gitStatusLines) {
        const phpFiles = gitStatusLines
            .filter((line) => {
            const file = line.split('\t')[1] || line.split(/\s+/)[1] || '';
            return file.endsWith(file_constants_1.FileExtension.PHP);
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
            : phpFiles.filter((item) => !file_constants_1.FilePattern.TEST_DIRECTORY.test(item.file));
    }
    identifyNonPhpFiles(gitStatusLines, mapGitStatus) {
        const nonPhpFiles = [];
        for (const line of gitStatusLines) {
            const parts = line.split(/\s+/);
            const status = parts[0];
            const file = parts[1];
            if (!file || file.endsWith(file_constants_1.FileExtension.PHP))
                continue;
            const hasRelevantExtension = file_constants_1.RelevantNonPhpExtensions.some((ext) => file.endsWith(ext));
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