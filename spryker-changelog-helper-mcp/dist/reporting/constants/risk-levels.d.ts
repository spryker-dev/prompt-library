export declare const RiskLevel: {
    readonly HIGH: {
        readonly level: "HIGH";
        readonly emoji: "🔴";
    };
    readonly MEDIUM: {
        readonly level: "MEDIUM";
        readonly emoji: "🟡";
    };
    readonly LOW: {
        readonly level: "LOW";
        readonly emoji: "🟢";
    };
};
export declare const RiskThreshold: {
    readonly MODIFIED_CONFIG_METHODS_HIGH: 3;
    readonly NEW_PUBLIC_API_MEDIUM: 5;
    readonly INTERNAL_WITH_IMPACT_MEDIUM: 10;
};
export type RiskLevelType = typeof RiskLevel[keyof typeof RiskLevel];
import { RiskLevel } from './risk-levels';
//# sourceMappingURL=risk-levels.d.ts.map