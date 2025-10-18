import { ImpactReport } from '../impact-report-generator';
export declare class MarkdownFormatter {
    generate(report: ImpactReport): string;
    private generateHeader;
    private generateExecutiveSummary;
    private generateChangesOverview;
    private generateNewPublicAPI;
    private generateModifiedPublicAPI;
    private generateNewConfigMethods;
    private generateModifiedConfigMethods;
    private generateInternalChangesWithImpact;
    private generateSafeInternalChanges;
    private generateTransferChanges;
    private generateNonPhpFiles;
    private generateSkippedFiles;
    private generateAllNewMethods;
    private generateAllModifiedMethods;
    private generateDetailedCodeChanges;
    private groupByModule;
    private groupByFileType;
    private groupMethodsByFile;
    private parseMethodSignature;
    private getChangeEmoji;
}
//# sourceMappingURL=markdown-formatter-old.d.ts.map