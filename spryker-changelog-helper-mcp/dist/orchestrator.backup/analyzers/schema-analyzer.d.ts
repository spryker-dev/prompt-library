import { GitHelper } from '../../git/git-operations';
import { AnalyzerConfig } from '../../spryker/patterns/module-patterns';
export interface SchemaChange {
    file: string;
    tableName: string;
    changeType: typeof AnalyzerConfig.changeTypes[keyof typeof AnalyzerConfig.changeTypes];
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
export declare class SchemaAnalyzer {
    private gitHelper;
    constructor(gitHelper: GitHelper);
    analyzeSchemaChanges(files: string[], baseCommit: string): Promise<SchemaChange[]>;
    private parseSchemaChange;
    private extractTableName;
    private determineChangeType;
    private extractAddedColumns;
    private extractRemovedColumns;
    private detectModifiedColumns;
    private extractAddedIndexes;
    private extractRemovedIndexes;
    private parseColumnLine;
    private parseIndexBlock;
}
//# sourceMappingURL=schema-analyzer.d.ts.map