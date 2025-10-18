import { ImpactReport } from './impact-report-generator';
import { VersionRecommendation } from './version-recommender';
export interface ModuleReport {
    moduleName: string;
    versionRecommendation: VersionRecommendation;
    publicApiChanges: ModulePublicApiChanges;
    pluginChanges: ModulePluginChanges;
    configChanges: ModuleConfigChanges;
    communicationChanges: ModuleCommunicationChanges;
    constantChanges: ModuleConstantChanges;
    internalChanges: ModuleInternalChanges;
    dataChanges: ModuleDataChanges;
    composerChanges?: ComposerChange;
    validationInfo: ModuleValidationInfo;
}
export interface ModulePublicApiChanges {
    newMethods: Array<{
        method: string;
        file: string;
        visibility: string;
        description?: string;
        isApiMethod?: boolean;
        isDeprecated?: boolean;
    }>;
    modifiedMethods: Array<{
        method: string;
        file: string;
        signatureChanged: boolean;
        description?: string;
        isApiMethod?: boolean;
        isDeprecated?: boolean;
    }>;
    removedMethods: Array<{
        method: string;
        file: string;
        description?: string;
        isApiMethod?: boolean;
        isDeprecated?: boolean;
    }>;
    affectedByInternal: Array<{
        method: string;
        affectedBy: Array<{
            internalMethod: string;
            hops: number;
        }>;
        description?: string;
        isApiMethod?: boolean;
        isDeprecated?: boolean;
    }>;
}
export interface ModulePluginChanges {
    newPlugins: Array<{
        method: string;
        file: string;
        visibility: string;
    }>;
    newPluginClasses: Array<{
        name: string;
        fqcn: string;
        file: string;
    }>;
    deprecatedPluginClasses: Array<{
        name: string;
        fqcn: string;
        file: string;
    }>;
    modifiedPlugins: Array<{
        method: string;
        file: string;
        signatureChanged: boolean;
    }>;
    removedPlugins: Array<{
        method: string;
        file: string;
    }>;
    affectedByInternal: Array<{
        method: string;
        affectedBy: Array<{
            internalMethod: string;
            hops: number;
        }>;
    }>;
}
export interface ModuleConfigChanges {
    newMethods: Array<{
        method: string;
        file: string;
        visibility: string;
    }>;
    modifiedMethods: Array<{
        method: string;
        file: string;
        signatureChanged: boolean;
    }>;
    removedMethods: Array<{
        method: string;
        file: string;
    }>;
}
export interface ModuleCommunicationChanges {
    adjustedMethods: Array<{
        method: string;
        file: string;
        signatureChanged: boolean;
        description?: string;
    }>;
}
export interface ModuleConstantChanges {
    addedConstants: Array<{
        name: string;
        className: string;
        value?: string;
        visibility: string;
    }>;
    removedConstants: Array<{
        name: string;
        className: string;
        value?: string;
        visibility: string;
    }>;
    modifiedConstants: Array<{
        name: string;
        className: string;
        oldValue?: string;
        newValue?: string;
        visibility: string;
    }>;
}
export interface ModuleInternalChanges {
    modifiedMethods: Array<{
        method: string;
        file: string;
        signatureChanged: boolean;
    }>;
    newMethods: Array<{
        method: string;
        file: string;
    }>;
    modifiedFiles: Array<{
        file: string;
        className: string;
        layer: string;
        changeType: string;
    }>;
}
export interface ModuleDataChanges {
    transfers: Array<{
        name: string;
        changeType: string;
        addedProperties?: string[];
        removedProperties?: string[];
        modifiedProperties?: string[];
        strictAdded?: boolean;
        strictAddedForProperties?: string[];
    }>;
    schemas: Array<{
        tableName: string;
        changeType: string;
        addedColumns?: Array<{
            name: string;
            type?: string;
        }>;
        removedColumns?: Array<{
            name: string;
        }>;
        modifiedColumns?: Array<{
            name: string;
            oldType?: string;
            newType?: string;
        }>;
        addedIndexes?: Array<{
            name: string;
            columns: string[];
        }>;
        removedIndexes?: Array<{
            name: string;
        }>;
    }>;
}
export interface ComposerChange {
    file: string;
    phpVersionChange?: {
        old: string;
        new: string;
        changeType: 'added' | 'removed' | 'upgraded' | 'downgraded';
    };
    dependencyChanges: Array<{
        package: string;
        changeType: 'added' | 'removed' | 'modified';
        oldConstraint?: string;
        newConstraint?: string;
        constraintChangeType?: 'major' | 'minor' | 'patch' | 'relaxed' | 'tightened';
    }>;
}
export interface ModuleValidationInfo {
    totalMethodChanges: number;
    totalFileChanges: number;
    hasBreakingChanges: boolean;
    requiresManualReview: boolean;
    notes: string[];
}
export declare class ModuleReportGenerator {
    private versionRecommender;
    constructor();
    generateModuleReports(report: ImpactReport): Map<string, ModuleReport>;
    private groupChangesByModule;
    private generateModuleReport;
    private parseComposerChanges;
    private extractModuleFromPath;
    private deduplicateByMethodName;
}
//# sourceMappingURL=module-report-generator.d.ts.map