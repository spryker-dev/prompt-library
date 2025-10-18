import { ImpactReport } from '../impact-report-generator';
export declare class ConsoleFormatter {
    private moduleFormatter;
    constructor();
    format(report: ImpactReport): void;
    private buildOutput;
    private buildVersionRecommendation;
    private buildSummaryLines;
    private buildSchemaSection;
    private buildTransferSection;
    private buildNonPhpFilesSection;
    private buildSkippedFilesSection;
    private buildConfigMethodsSection;
    private formatMethodCall;
    private buildInternalChangesSection;
}
//# sourceMappingURL=console-formatter.d.ts.map