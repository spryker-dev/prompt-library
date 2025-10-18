import { ImpactReport } from './generators/impact-report-generator';
export declare class JsonFormatter {
    format(report: ImpactReport): string;
    private buildJsonOutput;
    private calculateRiskScore;
    private formatNewPublicAPI;
    private formatModifiedPublicAPI;
    private formatConfigMethods;
    private formatModifiedConfigMethods;
    private formatInternalChanges;
    private formatTransferChanges;
    private formatNonPhpFiles;
    private formatSkippedFiles;
    private formatInternalChangesNoImpact;
    private formatNewClasses;
    private formatAllNewMethods;
    private formatAllModifiedMethods;
    private formatModifiedInternalFiles;
    private formatSchemaChanges;
    private formatModuleReports;
    private formatConstantChanges;
}
//# sourceMappingURL=json-formatter.d.ts.map