import { execSync } from 'child_process';
import { DiffSettings, GitStatus } from '../analysis/constants/git-constants';

export class GitHelper {
  constructor(private root: string, private modules?: string[]) {}

  getMergeBase(baseRef: string): string {
    return execSync(`git merge-base ${baseRef} HEAD`, {
      cwd: this.root,
      encoding: 'utf-8',
    }).trim();
  }

  getAllChangedFiles(baseCommit: string): string[] {
    const path = require('path');
    const allFiles = execSync(`git diff --name-status ${baseCommit} HEAD`, {
      cwd: this.root,
      encoding: 'utf-8',
    })
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => line.trim());
    
    // Get the relative path from git root to the specified root
    const gitRoot = execSync('git rev-parse --show-toplevel', {
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
        if (!filePath) return false;
        
        // Check if file path contains any of the specified modules
        // Matches patterns like: Bundles/ModuleName/ or /ModuleName/
        return this.modules!.some(module => {
          const modulePattern = new RegExp(`[/\\\\]${module}[/\\\\]`, 'i');
          return modulePattern.test(filePath);
        });
      });
    }
    
    return filteredFiles;
  }

  getFileDiff(baseCommit: string, file: string): string {
    return execSync(`git diff --unified=${DiffSettings.CONTEXT_LINES} ${baseCommit} HEAD -- "${file}"`, {
      cwd: this.root,
      encoding: 'utf-8',
    }).toString();
  }

  getFileContent(ref: string, file: string): string {
    try {
      return execSync(`git show ${ref}:"${file}"`, {
        cwd: this.root,
        encoding: 'utf-8',
      }).toString();
    } catch {
      return '';
    }
  }

  getCurrentFileContent(file: string): string {
    try {
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(this.root, file);
      return fs.readFileSync(fullPath, 'utf-8');
    } catch {
      return '';
    }
  }

  mapGitStatusToChangeType(status: string): 'added' | 'modified' | 'deleted' {
    if (status.startsWith(GitStatus.ADDED)) return 'added';
    if (status.startsWith(GitStatus.DELETED)) return 'deleted';
    return 'modified';
  }
}
