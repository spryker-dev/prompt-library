"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummarySection = void 0;
const markdown_template_1 = require("../templates/markdown-template");
const display_config_1 = require("../config/display-config");
const section_keys_1 = require("../config/section-keys");
const text_config_1 = require("../config/text-config");
class SummarySection {
    static generate(report) {
        const sections = [
            markdown_template_1.MarkdownTemplate.heading1(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.IMPACT_ANALYSIS)),
            markdown_template_1.MarkdownTemplate.paragraph(`${text_config_1.TextConfig.messages.generated}: ${report.timestamp}`),
            markdown_template_1.MarkdownTemplate.heading2(text_config_1.TextConfig.sectionTitles.executiveSummary),
            markdown_template_1.MarkdownTemplate.heading3(text_config_1.TextConfig.sectionTitles.riskAssessment),
            markdown_template_1.MarkdownTemplate.paragraph(`${markdown_template_1.MarkdownTemplate.bold(text_config_1.TextConfig.messages.overallRiskLevel)}: ${report.riskLevel.emoji} ${report.riskLevel.level}`),
            markdown_template_1.MarkdownTemplate.heading3(text_config_1.TextConfig.sectionTitles.changesOverview),
            this.buildTable(report.summary, report),
        ];
        return sections.join('\n');
    }
    static buildTable(summary, report) {
        const headers = ['Category', 'Count'];
        const rows = [
            [display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.NEW_PUBLIC_API), summary.newPublicAPI.toString()],
            [display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.MODIFIED_PUBLIC_API), summary.modifiedPublicAPI.toString()],
            [display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.NEW_CONFIG_METHODS), summary.newConfigMethods.toString()],
            [display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.MODIFIED_CONFIG_METHODS), summary.modifiedConfigMethods.toString()],
            [display_config_1.DisplayConfig.categoryEmojis.internalWithImpact + ' ' + text_config_1.TextConfig.categories.internalWithImpact, summary.internalWithImpact.toString()],
            [display_config_1.DisplayConfig.categoryEmojis.internalNoImpact + ' ' + text_config_1.TextConfig.categories.internalNoImpact, summary.internalNoImpact.toString()],
            [display_config_1.DisplayConfig.categoryEmojis.transferChanges + ' ' + text_config_1.TextConfig.categories.transferChanges, report.transferChanges.length.toString()],
            [display_config_1.DisplayConfig.categoryEmojis.nonPhpFiles + ' ' + text_config_1.TextConfig.categories.nonPhpFiles, report.nonPhpFiles.length.toString()],
        ];
        return markdown_template_1.MarkdownTemplate.table(headers, rows);
    }
}
exports.SummarySection = SummarySection;
//# sourceMappingURL=summary-section.js.map