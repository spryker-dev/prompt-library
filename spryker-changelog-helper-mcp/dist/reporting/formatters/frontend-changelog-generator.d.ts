import { FrontendChange } from '../../analysis/analyzers/frontend-analyzer';
export interface FrontendChangelogEntry {
    type: 'breaking' | 'improvement' | 'fix' | 'deprecation';
    category: string;
    description: string;
    component: string;
}
export declare class FrontendChangelogGenerator {
    generate(changes: FrontendChange[]): FrontendChangelogEntry[];
    private generateEntriesForChange;
    private generateAddedComponentEntries;
    private generateDeletedComponentEntries;
    private generateModifiedComponentEntries;
    private formatComponentReference;
}
//# sourceMappingURL=frontend-changelog-generator.d.ts.map