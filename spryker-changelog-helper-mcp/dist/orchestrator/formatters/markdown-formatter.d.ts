import { ImpactReport } from '../impact-report-generator';
export declare class MarkdownFormatter {
    generate(report: ImpactReport): string;
    private generatePublicAPISection;
    private generateConfigMethodsSection;
    private generateInternalChangesSection;
    private generateSafeChangesSection;
    private generateNonPhpFilesSection;
    private generateSkippedFilesSection;
    private generateAllMethodsSection;
}
//# sourceMappingURL=markdown-formatter.d.ts.map