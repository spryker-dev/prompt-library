import { ImpactReport } from '../impact-report-generator';
export declare class ConsoleFormatter {
    format(report: ImpactReport): void;
    private printRiskLevel;
    private printSummary;
    private printTransferChanges;
    private printNewTransfers;
    private printModifiedTransfers;
    private printRemovedTransfers;
    private printNonPhpFiles;
    private printSkippedFiles;
    private printConfigMethods;
    private printNewConfigMethods;
    private printModifiedConfigMethods;
    private printInternalChanges;
    private groupByFileType;
    private groupByModule;
    private parseMethodSignature;
    private getChangeEmoji;
}
//# sourceMappingURL=console-formatter-old.d.ts.map