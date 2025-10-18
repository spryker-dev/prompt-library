"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayConfig = void 0;
const section_keys_1 = require("./section-keys");
const text_config_1 = require("./text-config");
class DisplayConfig {
    static getSectionTitle(key, includeEmoji = true) {
        const title = text_config_1.TextConfig.sectionTitles[key];
        const emoji = this.emojis[key];
        return includeEmoji && emoji ? `${emoji} ${title}` : title;
    }
    static getSectionDescription(key) {
        return text_config_1.TextConfig.sectionDescriptions[key] || '';
    }
    static getChangeEmoji(changeType) {
        const type = changeType;
        return this.changeTypes[type]?.emoji || '•';
    }
    static getRiskEmoji(level) {
        const riskLevel = level.toLowerCase();
        return this.riskLevels[riskLevel]?.emoji || '';
    }
    static formatCount(count, singular, plural) {
        const label = count === 1 ? singular : (plural || singular);
        return `${count} ${label}`;
    }
    static formatAffectsMessage(count) {
        return `${text_config_1.TextConfig.messages.affects} ${this.formatCount(count, text_config_1.TextConfig.labels.methods)}`;
    }
    static formatMoreMessage(remaining) {
        return `... ${text_config_1.TextConfig.messages.andMore} ${remaining} ${text_config_1.TextConfig.messages.more}`;
    }
    static formatModuleTitle(moduleName) {
        return `${moduleName} ${text_config_1.TextConfig.labels.module}`;
    }
    static formatFileTypeTitle(fileType, count) {
        return `${fileType.toUpperCase()} ${text_config_1.TextConfig.labels.files} (${count})`;
    }
    static formatTransferTitle(changeType, count) {
        const type = this.changeTypes[changeType];
        const label = text_config_1.TextConfig.transferTypes[changeType];
        return `${type.emoji} ${label} (${count})`;
    }
    static getCategoryLabel(key) {
        return text_config_1.TextConfig.categories[key];
    }
    static getLabel(key) {
        return text_config_1.TextConfig.labels[key];
    }
    static getMessage(key) {
        return text_config_1.TextConfig.messages[key];
    }
}
exports.DisplayConfig = DisplayConfig;
// Emojis only - all text comes from TextConfig
DisplayConfig.emojis = {
    [section_keys_1.SectionKeys.IMPACT_ANALYSIS]: '🎯',
    [section_keys_1.SectionKeys.EXECUTIVE_SUMMARY]: '',
    [section_keys_1.SectionKeys.RISK_ASSESSMENT]: '',
    [section_keys_1.SectionKeys.CHANGES_OVERVIEW]: '',
    [section_keys_1.SectionKeys.NEW_PUBLIC_API]: '🆕',
    [section_keys_1.SectionKeys.MODIFIED_PUBLIC_API]: '⚠️',
    [section_keys_1.SectionKeys.NEW_CONFIG_METHODS]: '⚙️',
    [section_keys_1.SectionKeys.MODIFIED_CONFIG_METHODS]: '⚙️',
    [section_keys_1.SectionKeys.INTERNAL_CHANGES]: '🔍',
    [section_keys_1.SectionKeys.SAFE_CHANGES]: '✅',
    [section_keys_1.SectionKeys.TRANSFER_CHANGES]: '📦',
    [section_keys_1.SectionKeys.NON_PHP_FILES]: '📄',
    [section_keys_1.SectionKeys.SKIPPED_FILES]: '⚠️',
    [section_keys_1.SectionKeys.ALL_NEW_METHODS]: '📝',
    [section_keys_1.SectionKeys.ALL_MODIFIED_METHODS]: '📝',
};
DisplayConfig.limits = {
    maxDisplayItems: 10,
    maxAffectedMethods: 5,
};
DisplayConfig.riskLevels = {
    high: { emoji: '🔴', label: 'HIGH' },
    medium: { emoji: '🟡', label: 'MEDIUM' },
    low: { emoji: '🟢', label: 'LOW' },
};
DisplayConfig.changeTypes = {
    added: { emoji: '➕', label: 'Added' },
    removed: { emoji: '➖', label: 'Removed' },
    modified: { emoji: '✏️', label: 'Modified' },
    new: { emoji: '➕', label: 'New' },
};
DisplayConfig.categoryEmojis = {
    newPublicAPI: '🆕',
    modifiedPublicAPI: '⚠️',
    newConfigMethods: '⚙️',
    modifiedConfigMethods: '⚙️',
    internalWithImpact: '🔍',
    internalNoImpact: '✅',
    transferChanges: '📦',
    nonPhpFiles: '📄',
};
//# sourceMappingURL=display-config.js.map