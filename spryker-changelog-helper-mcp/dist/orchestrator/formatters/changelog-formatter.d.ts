import { ImpactReport } from '../impact-report-generator';
import { ModuleReport } from '../module-report-generator';
import { AnalyzerConfig } from '../config/analyzer-config';
export interface ChangelogReport {
    modules: Map<string, ModuleChangelogData>;
    summary: ChangelogSummary;
}
export interface ModuleChangelogData {
    moduleName: string;
    versionBump: typeof AnalyzerConfig.versionBumpTypes[keyof typeof AnalyzerConfig.versionBumpTypes];
    breakingChanges: ChangelogEntry[];
    improvements: ChangelogEntry[];
    adjustments: ChangelogEntry[];
    deprecations: ChangelogEntry[];
    transfers?: ChangelogEntry[];
}
export interface ChangelogEntry {
    type: string;
    action: string;
    item: string;
    details?: string;
    signatureChanged?: boolean;
    oldValue?: string;
    newValue?: string;
    columns?: string[];
    visibility?: string;
    file?: string;
    pluginClass?: string;
    context?: {
        description?: string;
        isApiMethod?: boolean;
        isDeprecated?: boolean;
    };
}
export interface ChangelogSummary {
    totalModules: number;
    majorReleases: number;
    minorReleases: number;
    patchReleases: number;
    overallRisk: string;
}
export declare class ChangelogFormatter {
    format(_report: ImpactReport, moduleReports: Map<string, ModuleReport>): ChangelogReport;
    private formatModuleChangelog;
    private generateSummary;
    private extractMethodName;
    private extractClassName;
    formatAsJson(changelogReport: ChangelogReport): string;
}
//# sourceMappingURL=changelog-formatter.d.ts.map