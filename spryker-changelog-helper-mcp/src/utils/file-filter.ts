import { NonPhpFile } from '../analysis/diff-analyzer';
import { FileExtension, FilePattern, RelevantNonPhpExtensions } from '../analysis/constants/file-constants';

export class FileFilter {
  constructor(private includeTests: boolean) {}

  filterPhpFiles(gitStatusLines: string[]): string[] {
    const phpFiles = gitStatusLines
      .filter((line) => {
        const parts = line.split(/\s+/);
        const file = parts[1] || '';
        return file.endsWith(FileExtension.PHP);
      })
      .map((line) => {
        const parts = line.split(/\s+/);
        return parts[1];
      });

    return this.includeTests
      ? phpFiles
      : phpFiles.filter((f) => !FilePattern.TEST_DIRECTORY.test(f));
  }

  filterPhpFilesWithStatus(gitStatusLines: string[]): Array<{ status: string; file: string }> {
    const phpFiles = gitStatusLines
      .filter((line) => {
        const file = line.split('\t')[1] || line.split(/\s+/)[1] || '';
        return file.endsWith(FileExtension.PHP);
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
      : phpFiles.filter((item) => !FilePattern.TEST_DIRECTORY.test(item.file));
  }

  identifyNonPhpFiles(gitStatusLines: string[], mapGitStatus: (status: string) => 'added' | 'modified' | 'deleted'): NonPhpFile[] {
    const nonPhpFiles: NonPhpFile[] = [];

    for (const line of gitStatusLines) {
      const parts = line.split(/\s+/);
      const status = parts[0];
      const file = parts[1];

      if (!file || file.endsWith(FileExtension.PHP)) continue;

      const hasRelevantExtension = RelevantNonPhpExtensions.some((ext) => file.endsWith(ext));
      if (!hasRelevantExtension) continue;

      const fileType = file.split('.').pop() || 'unknown';
      const changeType = mapGitStatus(status);

      nonPhpFiles.push({ file, fileType, changeType });
    }

    return nonPhpFiles;
  }
}
