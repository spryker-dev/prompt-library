"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskThreshold = exports.RiskLevel = void 0;
exports.RiskLevel = {
    HIGH: { level: 'HIGH', emoji: '🔴' },
    MEDIUM: { level: 'MEDIUM', emoji: '🟡' },
    LOW: { level: 'LOW', emoji: '🟢' },
};
exports.RiskThreshold = {
    MODIFIED_CONFIG_METHODS_HIGH: 3,
    NEW_PUBLIC_API_MEDIUM: 5,
    INTERNAL_WITH_IMPACT_MEDIUM: 10,
};
//# sourceMappingURL=risk-constants.js.map