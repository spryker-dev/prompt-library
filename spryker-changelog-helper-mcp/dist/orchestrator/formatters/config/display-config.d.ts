import { SectionKey } from './section-keys';
import { TextConfig } from './text-config';
export interface SectionConfig {
    title: string;
    emoji: string;
    description?: string;
}
export declare class DisplayConfig {
    static readonly emojis: {
        impactAnalysis: string;
        executiveSummary: string;
        riskAssessment: string;
        changesOverview: string;
        newPublicAPI: string;
        modifiedPublicAPI: string;
        newConfigMethods: string;
        modifiedConfigMethods: string;
        internalChanges: string;
        safeChanges: string;
        transferChanges: string;
        nonPhpFiles: string;
        skippedFiles: string;
        allNewMethods: string;
        allModifiedMethods: string;
    };
    static readonly limits: {
        maxDisplayItems: number;
        maxAffectedMethods: number;
    };
    static readonly riskLevels: {
        high: {
            emoji: string;
            label: string;
        };
        medium: {
            emoji: string;
            label: string;
        };
        low: {
            emoji: string;
            label: string;
        };
    };
    static readonly changeTypes: {
        added: {
            emoji: string;
            label: string;
        };
        removed: {
            emoji: string;
            label: string;
        };
        modified: {
            emoji: string;
            label: string;
        };
        new: {
            emoji: string;
            label: string;
        };
    };
    static readonly categoryEmojis: {
        newPublicAPI: string;
        modifiedPublicAPI: string;
        newConfigMethods: string;
        modifiedConfigMethods: string;
        internalWithImpact: string;
        internalNoImpact: string;
        transferChanges: string;
        nonPhpFiles: string;
    };
    static getSectionTitle(key: SectionKey, includeEmoji?: boolean): string;
    static getSectionDescription(key: SectionKey): string;
    static getChangeEmoji(changeType: string): string;
    static getRiskEmoji(level: string): string;
    static formatCount(count: number, singular: string, plural?: string): string;
    static formatAffectsMessage(count: number): string;
    static formatMoreMessage(remaining: number): string;
    static formatModuleTitle(moduleName: string): string;
    static formatFileTypeTitle(fileType: string, count: number): string;
    static formatTransferTitle(changeType: keyof typeof DisplayConfig.changeTypes, count: number): string;
    static getCategoryLabel(key: keyof typeof TextConfig.categories): string;
    static getLabel(key: keyof typeof TextConfig.labels): string;
    static getMessage(key: keyof typeof TextConfig.messages): string;
}
//# sourceMappingURL=display-config.d.ts.map