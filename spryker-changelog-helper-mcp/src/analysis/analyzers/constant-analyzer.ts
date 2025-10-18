import { AnalyzerConfig } from '../constants/analyzer-config';
import { GitHelper } from '../../git/git-helper';
import { ConstantChange, ConstantInfo, ConstantModification } from '../diff-analyzer';
import { ChangeType } from '../constants/change-constants';
import { DiffMarkers } from '../constants/git-constants';

export class ConstantAnalyzer {
  constructor(private gitHelper: GitHelper) {}

  async analyzeConstantChanges(files: string[], baseCommit: string): Promise<ConstantChange[]> {
    const changes: ConstantChange[] = [];
    const phpFiles = files.filter(f => f.endsWith(AnalyzerConfig.filePatterns.phpExtension));

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

  private async analyzeFile(file: string, diff: string, baseCommit: string): Promise<ConstantChange | null> {
    const changeType = this.determineChangeType(diff);
    
    if (changeType === ChangeType.NEW || changeType === ChangeType.REMOVED) {
      // For new/removed files, we don't track individual constants
      return null;
    }

    const oldContent = this.gitHelper.getFileContent(baseCommit, file);
    const newContent = this.gitHelper.getCurrentFileContent(file);

    const oldConstants = this.extractConstants(oldContent);
    const newConstants = this.extractConstants(newContent);

    const addedConstants: ConstantInfo[] = [];
    const removedConstants: ConstantInfo[] = [];
    const modifiedConstants: ConstantModification[] = [];

    // Find added constants
    for (const [name, info] of newConstants) {
      if (!oldConstants.has(name)) {
        addedConstants.push(info);
      } else {
        const oldInfo = oldConstants.get(name)!;
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
      changeType: ChangeType.MODIFIED,
      isConfigOrConstants,
      addedConstants: addedConstants.length > 0 ? addedConstants : undefined,
      removedConstants: removedConstants.length > 0 ? removedConstants : undefined,
      modifiedConstants: modifiedConstants.length > 0 ? modifiedConstants : undefined,
    };
  }

  private extractConstants(content: string): Map<string, ConstantInfo> {
    const constants = new Map<string, ConstantInfo>();
    if (!content) return constants;

    // Match: public const NAME = 'value';
    // Match: protected const NAME = 'value';
    // Match: private const NAME = 'value';
    // Match: const NAME = 'value'; (defaults to public)
    const constPattern = /^\s*(public|protected|private)?\s*const\s+([A-Z_][A-Z0-9_]*)\s*=\s*(.+?);/gm;
    
    let match;
    while ((match = constPattern.exec(content)) !== null) {
      const visibility = (match[1] || 'public') as 'public' | 'protected' | 'private';
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

  private extractClassName(file: string): string {
    const parts = file.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace('.php', '');
  }

  private extractFQCN(content: string, file: string): string {
    const namespaceMatch = content.match(/namespace\s+([\w\\]+);/);
    const className = this.extractClassName(file);
    
    if (namespaceMatch) {
      return `${namespaceMatch[1]}\\${className}`;
    }
    
    return className;
  }

  private determineChangeType(diff: string): typeof ChangeType[keyof typeof ChangeType] {
    if (diff.includes(DiffMarkers.NEW_FILE)) {
      return ChangeType.NEW;
    }
    if (diff.includes(DiffMarkers.DELETED_FILE)) {
      return ChangeType.REMOVED;
    }
    return ChangeType.MODIFIED;
  }

  private hasConstantChanges(change: ConstantChange): boolean {
    return !!(
      (change.addedConstants && change.addedConstants.length > 0) ||
      (change.removedConstants && change.removedConstants.length > 0) ||
      (change.modifiedConstants && change.modifiedConstants.length > 0)
    );
  }

  private isConfigOrConstantsFile(file: string, className: string): boolean {
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
