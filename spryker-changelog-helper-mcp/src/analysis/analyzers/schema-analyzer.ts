import { AnalyzerConfig } from '../constants/analyzer-config';
import { GitHelper } from '../../git/git-helper';
import { SchemaTag, XmlAttribute } from '../constants/php-constants';
import { ChangeType } from '../constants/change-constants';
import { DiffMarkers } from '../constants/git-constants';

export interface SchemaChange {
  file: string;
  tableName: string;
  changeType: typeof ChangeType[keyof typeof ChangeType];
  addedColumns?: ColumnChange[];
  removedColumns?: ColumnChange[];
  modifiedColumns?: ColumnChange[];
  addedIndexes?: IndexChange[];
  removedIndexes?: IndexChange[];
}

export interface ColumnChange {
  name: string;
  type?: string;
  size?: string;
  required?: boolean;
  description?: string;
  oldType?: string;
  newType?: string;
}

export interface IndexChange {
  name: string;
  columns: string[];
  unique?: boolean;
}

export class SchemaAnalyzer {
  constructor(private gitHelper: GitHelper) {}

  async analyzeSchemaChanges(files: string[], baseCommit: string): Promise<SchemaChange[]> {
    const schemaFiles = files.filter(f => f.endsWith(AnalyzerConfig.filePatterns.schemaXml));
    const changes: SchemaChange[] = [];

    for (const file of schemaFiles) {
      const filePath = file.split('\t')[1] || file;
      const diff = this.gitHelper.getFileDiff(baseCommit, filePath);
      
      if (!diff || diff.trim() === '') {
        continue;
      }

      const schemaChange = this.parseSchemaChange(filePath, diff);
      if (schemaChange) {
        changes.push(schemaChange);
      }
    }

    return changes;
  }

  private parseSchemaChange(file: string, diff: string): SchemaChange | null {
    const tableName = this.extractTableName(diff);
    if (!tableName) {
      return null;
    }

    let addedColumns = this.extractAddedColumns(diff);
    let removedColumns = this.extractRemovedColumns(diff);
    const modifiedColumns = this.detectModifiedColumns(addedColumns, removedColumns);
    
    // Remove modified columns from added/removed lists
    const modifiedColumnNames = new Set(modifiedColumns.map(c => c.name));
    addedColumns = addedColumns.filter(c => !modifiedColumnNames.has(c.name));
    removedColumns = removedColumns.filter(c => !modifiedColumnNames.has(c.name));
    
    const addedIndexes = this.extractAddedIndexes(diff);
    const removedIndexes = this.extractRemovedIndexes(diff);

    const changeType = this.determineChangeType(diff);

    return {
      file,
      tableName,
      changeType,
      addedColumns: addedColumns.length > 0 ? addedColumns : undefined,
      removedColumns: removedColumns.length > 0 ? removedColumns : undefined,
      modifiedColumns: modifiedColumns.length > 0 ? modifiedColumns : undefined,
      addedIndexes: addedIndexes.length > 0 ? addedIndexes : undefined,
      removedIndexes: removedIndexes.length > 0 ? removedIndexes : undefined,
    };
  }

  private extractTableName(diff: string): string | null {
    const match = diff.match(new RegExp(`${SchemaTag.TABLE}"([^"]+)"`));
    return match ? match[1] : null;
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

  private extractAddedColumns(diff: string): ColumnChange[] {
    const columns: ColumnChange[] = [];
    const lines = diff.split('\n');

    for (const line of lines) {
      if (line.startsWith(AnalyzerConfig.diffPrefixChars.added) && line.includes(SchemaTag.COLUMN)) {
        const column = this.parseColumnLine(line.substring(1));
        if (column) {
          columns.push(column);
        }
      }
    }

    return columns;
  }

  private extractRemovedColumns(diff: string): ColumnChange[] {
    const columns: ColumnChange[] = [];
    const lines = diff.split('\n');

    for (const line of lines) {
      if (line.startsWith(AnalyzerConfig.diffPrefixChars.removed) && line.includes(SchemaTag.COLUMN)) {
        const column = this.parseColumnLine(line.substring(1));
        if (column) {
          columns.push(column);
        }
      }
    }

    return columns;
  }

  private detectModifiedColumns(addedColumns: ColumnChange[], removedColumns: ColumnChange[]): ColumnChange[] {
    const modifiedColumns: ColumnChange[] = [];
    const addedByName = new Map(addedColumns.map(c => [c.name, c]));
    
    for (const removed of removedColumns) {
      const added = addedByName.get(removed.name);
      if (added) {
        // Same column name in both added and removed = modification
        modifiedColumns.push({
          name: removed.name,
          oldType: removed.type,
          newType: added.type,
          type: added.type,
          size: added.size,
          required: added.required,
          description: added.description,
        });
      }
    }
    
    return modifiedColumns;
  }

  private extractAddedIndexes(diff: string): IndexChange[] {
    const indexes: IndexChange[] = [];
    const lines = diff.split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(AnalyzerConfig.diffPrefixChars.added) && lines[i].includes(SchemaTag.INDEX_NAME)) {
        const index = this.parseIndexBlock(lines, i);
        if (index) {
          indexes.push(index);
        }
      }
    }

    return indexes;
  }

  private extractRemovedIndexes(diff: string): IndexChange[] {
    const indexes: IndexChange[] = [];
    const lines = diff.split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(AnalyzerConfig.diffPrefixChars.removed) && lines[i].includes(SchemaTag.INDEX_NAME)) {
        const index = this.parseIndexBlock(lines, i);
        if (index) {
          indexes.push(index);
        }
      }
    }

    return indexes;
  }

  private parseColumnLine(line: string): ColumnChange | null {
    const nameMatch = line.match(/name="([^"]+)"/);
    const typeMatch = line.match(/type="([^"]+)"/);
    const sizeMatch = line.match(/size="([^"]+)"/);
    const requiredMatch = line.match(/required="([^"]+)"/);
    const descMatch = line.match(/description="([^"]+)"/);

    if (!nameMatch) {
      return null;
    }

    return {
      name: nameMatch[1],
      type: typeMatch ? typeMatch[1] : undefined,
      size: sizeMatch ? sizeMatch[1] : undefined,
      required: requiredMatch ? requiredMatch[1] === XmlAttribute.TRUE_VALUE : undefined,
      description: descMatch ? descMatch[1] : undefined,
    };
  }

  private parseIndexBlock(lines: string[], startIndex: number): IndexChange | null {
    const line = lines[startIndex];
    const nameMatch = line.match(/name="([^"]+)"/);
    const uniqueMatch = line.match(/unique="([^"]+)"/);

    if (!nameMatch) {
      return null;
    }

    const columns: string[] = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
      const currentLine = lines[i];
      if (currentLine.includes(SchemaTag.INDEX_CLOSE)) {
        break;
      }
      if (currentLine.includes(SchemaTag.INDEX_COLUMN)) {
        const colMatch = currentLine.match(/name="([^"]+)"/);
        if (colMatch) {
          columns.push(colMatch[1]);
        }
      }
    }

    return {
      name: nameMatch[1],
      columns,
      unique: uniqueMatch ? uniqueMatch[1] === XmlAttribute.TRUE_VALUE : undefined,
    };
  }
}
