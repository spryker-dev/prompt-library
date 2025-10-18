import { GitHelper } from '../../git/git-helper';
import { FilePattern } from '../constants/file-constants';
import { ComposerKey } from '../constants/php-constants';
import { ChangeType, ConstraintChangeType, VersionChangeType } from '../constants/change-constants';
import { DiffMarkers } from '../constants/git-constants';

export interface ComposerChange {
  file: string;
  changeType: typeof ChangeType[keyof typeof ChangeType];
  phpVersionChange?: PhpVersionChange;
  dependencyChanges: DependencyChange[];
}

export interface PhpVersionChange {
  old?: string;
  new?: string;
  changeType: typeof VersionChangeType[keyof typeof VersionChangeType];
  requiresMajor: boolean;
}

export interface DependencyChange {
  package: string;
  changeType: typeof ChangeType[keyof typeof ChangeType];
  oldConstraint?: string;
  newConstraint?: string;
  constraintChangeType?: typeof ConstraintChangeType[keyof typeof ConstraintChangeType];
  requiresMajor: boolean;
}

export class ComposerAnalyzer {
  constructor(private gitHelper: GitHelper) {}

  async analyzeComposerChanges(files: string[], baseCommit: string): Promise<ComposerChange[]> {
    const composerFiles = files.filter(f => f.includes(FilePattern.COMPOSER_JSON));
    const changes: ComposerChange[] = [];

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

  private async parseComposerChange(file: string, diff: string, baseCommit: string): Promise<ComposerChange | null> {
    const changeType = this.determineChangeType(diff);
    
    if (changeType === ChangeType.REMOVED) {
      return {
        file,
        changeType: ChangeType.REMOVED,
        dependencyChanges: [],
      };
    }

    if (changeType === ChangeType.NEW) {
      return {
        file,
        changeType: ChangeType.NEW,
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
      changeType: ChangeType.MODIFIED,
      phpVersionChange,
      dependencyChanges,
    };
  }

  private detectPhpVersionChange(oldJson: any, newJson: any): PhpVersionChange | undefined {
    const oldPhp = oldJson[ComposerKey.REQUIRE]?.[ComposerKey.PHP];
    const newPhp = newJson[ComposerKey.REQUIRE]?.[ComposerKey.PHP];

    if (oldPhp === newPhp) {
      return undefined;
    }

    if (!oldPhp && newPhp) {
      return {
        new: newPhp,
        changeType: VersionChangeType.ADDED,
        requiresMajor: true,
      };
    }

    if (oldPhp && !newPhp) {
      return {
        old: oldPhp,
        changeType: VersionChangeType.REMOVED,
        requiresMajor: true,
      };
    }

    if (oldPhp && newPhp) {
      const changeType = this.comparePhpVersions(oldPhp, newPhp);
      return {
        old: oldPhp,
        new: newPhp,
        changeType,
        requiresMajor: changeType === VersionChangeType.UPGRADED,
      };
    }

    return undefined;
  }

  private comparePhpVersions(oldVersion: string, newVersion: string): typeof VersionChangeType[keyof typeof VersionChangeType] {
    // Extract minimum version from constraint
    const oldMin = this.extractMinVersion(oldVersion);
    const newMin = this.extractMinVersion(newVersion);

    if (oldMin === newMin) {
      return VersionChangeType.UNCHANGED;
    }

    // Simple comparison - in reality would need proper semver comparison
    if (newMin > oldMin) {
      return VersionChangeType.UPGRADED;
    }

    return VersionChangeType.DOWNGRADED;
  }

  private extractMinVersion(constraint: string): string {
    // Remove operators and extract version
    // e.g., ">=7.4" -> "7.4", "^8.0" -> "8.0"
    return constraint.replace(/[^0-9.]/g, '');
  }

  private detectDependencyChanges(oldJson: any, newJson: any): DependencyChange[] {
    const changes: DependencyChange[] = [];

    const oldDeps = { ...oldJson[ComposerKey.REQUIRE], ...oldJson[ComposerKey.REQUIRE_DEV] };
    const newDeps = { ...newJson[ComposerKey.REQUIRE], ...newJson[ComposerKey.REQUIRE_DEV] };

    const allPackages = new Set([...Object.keys(oldDeps), ...Object.keys(newDeps)]);

    for (const pkg of allPackages) {
      if (pkg === ComposerKey.PHP) continue; // Already handled separately

      const oldConstraint = oldDeps[pkg];
      const newConstraint = newDeps[pkg];

      if (!oldConstraint && newConstraint) {
        changes.push({
          package: pkg,
          changeType: ChangeType.ADDED,
          newConstraint,
          requiresMajor: false,
        });
      } else if (oldConstraint && !newConstraint) {
        changes.push({
          package: pkg,
          changeType: ChangeType.REMOVED,
          oldConstraint,
          requiresMajor: true,
        });
      } else if (oldConstraint !== newConstraint) {
        const constraintChangeType = this.compareConstraints(oldConstraint, newConstraint);
        changes.push({
          package: pkg,
          changeType: ChangeType.MODIFIED,
          oldConstraint,
          newConstraint,
          constraintChangeType,
          requiresMajor: constraintChangeType === ConstraintChangeType.MAJOR || constraintChangeType === ConstraintChangeType.TIGHTENED,
        });
      }
    }

    return changes;
  }

  private compareConstraints(oldConstraint: string, newConstraint: string): typeof ConstraintChangeType[keyof typeof ConstraintChangeType] {
    if (oldConstraint === newConstraint) {
      return ConstraintChangeType.UNCHANGED;
    }

    // Detect if constraint was relaxed (e.g., ^1.0 -> ^1.0 || ^2.0)
    if (newConstraint.includes(DiffMarkers.OR_OPERATOR) && !oldConstraint.includes(DiffMarkers.OR_OPERATOR)) {
      return ConstraintChangeType.RELAXED;
    }

    // Detect if constraint was tightened (e.g., ^1.0 || ^2.0 -> ^2.0)
    if (oldConstraint.includes(DiffMarkers.OR_OPERATOR) && !newConstraint.includes(DiffMarkers.OR_OPERATOR)) {
      return ConstraintChangeType.TIGHTENED;
    }

    // Extract major versions
    const oldMajor = this.extractMajorVersion(oldConstraint);
    const newMajor = this.extractMajorVersion(newConstraint);

    if (oldMajor !== newMajor) {
      return ConstraintChangeType.MAJOR;
    }

    // Extract minor versions
    const oldMinor = this.extractMinorVersion(oldConstraint);
    const newMinor = this.extractMinorVersion(newConstraint);

    if (oldMinor !== newMinor) {
      return ConstraintChangeType.MINOR;
    }

    return ConstraintChangeType.PATCH;
  }

  private extractMajorVersion(constraint: string): string {
    const match = constraint.match(/(\d+)\./);
    return match ? match[1] : '0';
  }

  private extractMinorVersion(constraint: string): string {
    const match = constraint.match(/\d+\.(\d+)/);
    return match ? match[1] : '0';
  }

  private parseJson(content: string): any {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
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
}
