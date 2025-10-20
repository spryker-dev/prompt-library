import { ImpactReport } from '../generators/impact-report-generator';
import { ModuleReport } from '../generators/module-report-generator';
import { VersionBumpType } from '../constants/version-constants';
export interface ChangelogReport {
    modules: Map<string, ModuleChangelogData>;
    summary: ChangelogSummary;
}
export interface ModuleChangelogData {
    moduleName: string;
    versionBump: typeof VersionBumpType[keyof typeof VersionBumpType];
    breakingChanges: ChangelogEntry[];
    improvements: ChangelogEntry[];
    adjustments: ChangelogEntry[];
    deprecations: ChangelogEntry[];
    transfers?: ChangelogEntry[];
    frontendChanges?: ChangelogEntry[];
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
    private generateFrontendChangelogEntries;
    private generateSummary;
    private extractMethodName;
    private extractClassName;
    formatAsJson(changelogReport: ChangelogReport): string;
}
//# sourceMappingURL=changelog-formatter.d.ts.map