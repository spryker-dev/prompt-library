"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaAnalyzer = void 0;
const analyzer_config_1 = require("../constants/analyzer-config");
const php_constants_1 = require("../constants/php-constants");
const change_constants_1 = require("../constants/change-constants");
const git_constants_1 = require("../constants/git-constants");
class SchemaAnalyzer {
    constructor(gitHelper) {
        this.gitHelper = gitHelper;
    }
    async analyzeSchemaChanges(files, baseCommit) {
        const schemaFiles = files.filter(f => f.endsWith(analyzer_config_1.AnalyzerConfig.filePatterns.schemaXml));
        const changes = [];
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
    parseSchemaChange(file, diff) {
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
    extractTableName(diff) {
        const match = diff.match(new RegExp(`${php_constants_1.SchemaTag.TABLE}"([^"]+)"`));
        return match ? match[1] : null;
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
    extractAddedColumns(diff) {
        const columns = [];
        const lines = diff.split('\n');
        for (const line of lines) {
            if (line.startsWith(analyzer_config_1.AnalyzerConfig.diffPrefixChars.added) && line.includes(php_constants_1.SchemaTag.COLUMN)) {
                const column = this.parseColumnLine(line.substring(1));
                if (column) {
                    columns.push(column);
                }
            }
        }
        return columns;
    }
    extractRemovedColumns(diff) {
        const columns = [];
        const lines = diff.split('\n');
        for (const line of lines) {
            if (line.startsWith(analyzer_config_1.AnalyzerConfig.diffPrefixChars.removed) && line.includes(php_constants_1.SchemaTag.COLUMN)) {
                const column = this.parseColumnLine(line.substring(1));
                if (column) {
                    columns.push(column);
                }
            }
        }
        return columns;
    }
    detectModifiedColumns(addedColumns, removedColumns) {
        const modifiedColumns = [];
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
    extractAddedIndexes(diff) {
        const indexes = [];
        const lines = diff.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith(analyzer_config_1.AnalyzerConfig.diffPrefixChars.added) && lines[i].includes(php_constants_1.SchemaTag.INDEX_NAME)) {
                const index = this.parseIndexBlock(lines, i);
                if (index) {
                    indexes.push(index);
                }
            }
        }
        return indexes;
    }
    extractRemovedIndexes(diff) {
        const indexes = [];
        const lines = diff.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith(analyzer_config_1.AnalyzerConfig.diffPrefixChars.removed) && lines[i].includes(php_constants_1.SchemaTag.INDEX_NAME)) {
                const index = this.parseIndexBlock(lines, i);
                if (index) {
                    indexes.push(index);
                }
            }
        }
        return indexes;
    }
    parseColumnLine(line) {
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
            required: requiredMatch ? requiredMatch[1] === php_constants_1.XmlAttribute.TRUE_VALUE : undefined,
            description: descMatch ? descMatch[1] : undefined,
        };
    }
    parseIndexBlock(lines, startIndex) {
        const line = lines[startIndex];
        const nameMatch = line.match(/name="([^"]+)"/);
        const uniqueMatch = line.match(/unique="([^"]+)"/);
        if (!nameMatch) {
            return null;
        }
        const columns = [];
        for (let i = startIndex + 1; i < lines.length; i++) {
            const currentLine = lines[i];
            if (currentLine.includes(php_constants_1.SchemaTag.INDEX_CLOSE)) {
                break;
            }
            if (currentLine.includes(php_constants_1.SchemaTag.INDEX_COLUMN)) {
                const colMatch = currentLine.match(/name="([^"]+)"/);
                if (colMatch) {
                    columns.push(colMatch[1]);
                }
            }
        }
        return {
            name: nameMatch[1],
            columns,
            unique: uniqueMatch ? uniqueMatch[1] === php_constants_1.XmlAttribute.TRUE_VALUE : undefined,
        };
    }
}
exports.SchemaAnalyzer = SchemaAnalyzer;
//# sourceMappingURL=schema-analyzer.js.map