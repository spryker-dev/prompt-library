"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferSection = void 0;
const data_grouper_1 = require("../utils/data-grouper");
const markdown_template_1 = require("../templates/markdown-template");
const display_config_1 = require("../config/display-config");
const section_keys_1 = require("../config/section-keys");
const text_config_1 = require("../config/text-config");
class TransferSection {
    static generate(report) {
        if (report.transferChanges.length === 0)
            return '';
        const sections = [
            markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.TRANSFER_CHANGES)),
            markdown_template_1.MarkdownTemplate.paragraph(display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.TRANSFER_CHANGES)),
        ];
        const grouped = data_grouper_1.DataGrouper.groupByType(report.transferChanges);
        const newTransfers = grouped.get('new') || [];
        if (newTransfers.length > 0) {
            sections.push(markdown_template_1.MarkdownTemplate.heading3(display_config_1.DisplayConfig.formatTransferTitle('new', newTransfers.length)));
            for (const transfer of newTransfers) {
                sections.push(markdown_template_1.MarkdownTemplate.listItem(markdown_template_1.MarkdownTemplate.bold(transfer.transferName)));
                sections.push(markdown_template_1.MarkdownTemplate.listItem(`${text_config_1.TextConfig.labels.file}: ${markdown_template_1.MarkdownTemplate.code(transfer.file)}`, 1));
            }
            sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
        }
        const modifiedTransfers = grouped.get('modified') || [];
        if (modifiedTransfers.length > 0) {
            sections.push(markdown_template_1.MarkdownTemplate.heading3(display_config_1.DisplayConfig.formatTransferTitle('modified', modifiedTransfers.length)));
            for (const transfer of modifiedTransfers) {
                sections.push(markdown_template_1.MarkdownTemplate.heading4(transfer.transferName));
                sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.file, markdown_template_1.MarkdownTemplate.code(transfer.file)));
                if (transfer.addedProperties?.length) {
                    const props = transfer.addedProperties.map(p => markdown_template_1.MarkdownTemplate.code(p)).join(', ');
                    sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.addedProperties, props));
                }
                if (transfer.removedProperties?.length) {
                    const props = transfer.removedProperties.map(p => markdown_template_1.MarkdownTemplate.code(p)).join(', ');
                    sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.removedProperties, props));
                }
                sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
            }
        }
        const removedTransfers = grouped.get('removed') || [];
        if (removedTransfers.length > 0) {
            sections.push(markdown_template_1.MarkdownTemplate.heading3(display_config_1.DisplayConfig.formatTransferTitle('removed', removedTransfers.length)));
            for (const transfer of removedTransfers) {
                sections.push(markdown_template_1.MarkdownTemplate.listItem(markdown_template_1.MarkdownTemplate.bold(transfer.transferName)));
                sections.push(markdown_template_1.MarkdownTemplate.listItem(`${text_config_1.TextConfig.labels.file}: ${markdown_template_1.MarkdownTemplate.code(transfer.file)}`, 1));
            }
            sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
        }
        return sections.join('\n');
    }
}
exports.TransferSection = TransferSection;
//# sourceMappingURL=transfer-section.js.map