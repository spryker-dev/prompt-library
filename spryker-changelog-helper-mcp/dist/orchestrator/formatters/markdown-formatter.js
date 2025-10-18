"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownFormatter = void 0;
const summary_section_1 = require("./sections/summary-section");
const transfer_section_1 = require("./sections/transfer-section");
const schema_section_1 = require("./sections/schema-section");
const method_parser_1 = require("./utils/method-parser");
const data_grouper_1 = require("./utils/data-grouper");
const markdown_template_1 = require("./templates/markdown-template");
const display_config_1 = require("./config/display-config");
const section_keys_1 = require("./config/section-keys");
const text_config_1 = require("./config/text-config");
class MarkdownFormatter {
    generate(report) {
        const sections = [
            summary_section_1.SummarySection.generate(report),
            this.generatePublicAPISection(report),
            this.generateConfigMethodsSection(report),
            this.generateInternalChangesSection(report),
            this.generateSafeChangesSection(report),
            schema_section_1.SchemaSection.generate(report),
            transfer_section_1.TransferSection.generate(report),
            this.generateNonPhpFilesSection(report),
            this.generateSkippedFilesSection(report),
            this.generateAllMethodsSection(report),
        ].filter(Boolean).join('\n\n');
        return sections;
    }
    generatePublicAPISection(report) {
        const sections = [];
        if (report.newPublicAPI.length > 0) {
            sections.push(markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.NEW_PUBLIC_API)));
            sections.push(markdown_template_1.MarkdownTemplate.paragraph(`${display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.NEW_PUBLIC_API)} (${report.summary.newPublicAPI} methods).`));
            for (const item of report.newPublicAPI) {
                sections.push(markdown_template_1.MarkdownTemplate.heading3(item.method));
                sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.file, markdown_template_1.MarkdownTemplate.code(item.file)));
                sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.visibility, item.visibility));
                sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
            }
        }
        if (report.modifiedPublicAPI.length > 0) {
            sections.push(markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.MODIFIED_PUBLIC_API)));
            sections.push(markdown_template_1.MarkdownTemplate.paragraph(`${display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.MODIFIED_PUBLIC_API)} (${report.summary.modifiedPublicAPI} methods).`));
            for (const item of report.modifiedPublicAPI) {
                sections.push(markdown_template_1.MarkdownTemplate.heading3(item.method));
                sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.file, markdown_template_1.MarkdownTemplate.code(item.file)));
                sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
            }
        }
        return sections.join('\n');
    }
    generateConfigMethodsSection(report) {
        const sections = [];
        if (report.newConfigMethods.length > 0) {
            sections.push(markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.NEW_CONFIG_METHODS)));
            sections.push(markdown_template_1.MarkdownTemplate.paragraph(`${display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.NEW_CONFIG_METHODS)} (${report.summary.newConfigMethods} methods).`));
            for (const item of report.newConfigMethods) {
                const formatted = method_parser_1.MethodParser.formatMethodCall(item.method);
                sections.push(markdown_template_1.MarkdownTemplate.heading3(formatted));
                sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.file, markdown_template_1.MarkdownTemplate.code(item.file)));
                sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.visibility, item.visibility));
                sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
            }
        }
        if (report.modifiedConfigMethods.length > 0) {
            sections.push(markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.MODIFIED_CONFIG_METHODS)));
            sections.push(markdown_template_1.MarkdownTemplate.paragraph(`${display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.MODIFIED_CONFIG_METHODS)} (${report.summary.modifiedConfigMethods} methods).`));
            for (const item of report.modifiedConfigMethods) {
                const formatted = method_parser_1.MethodParser.formatMethodCall(item.method);
                sections.push(markdown_template_1.MarkdownTemplate.heading3(formatted));
                sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.file, markdown_template_1.MarkdownTemplate.code(item.file)));
                sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
            }
        }
        return sections.join('\n');
    }
    generateInternalChangesSection(report) {
        if (report.internalChangesWithImpact.length === 0) {
            return markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.INTERNAL_CHANGES)) + '\n' +
                markdown_template_1.MarkdownTemplate.paragraph(text_config_1.TextConfig.messages.noInternalChanges);
        }
        const sections = [
            markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.INTERNAL_CHANGES)),
            markdown_template_1.MarkdownTemplate.paragraph(`${display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.INTERNAL_CHANGES)} (${report.summary.internalWithImpact} methods).`),
        ];
        const grouped = data_grouper_1.DataGrouper.groupByModule(report.internalChangesWithImpact);
        for (const [moduleName, changes] of grouped) {
            sections.push(markdown_template_1.MarkdownTemplate.heading3(display_config_1.DisplayConfig.formatModuleTitle(moduleName)));
            for (const item of changes) {
                const formatted = method_parser_1.MethodParser.formatMethodCall(item.method);
                sections.push(markdown_template_1.MarkdownTemplate.heading4(formatted));
                sections.push(markdown_template_1.MarkdownTemplate.paragraph(markdown_template_1.MarkdownTemplate.bold(text_config_1.TextConfig.labels.affectedFacadeMethods + ':')));
                for (const affected of item.affectedMethods) {
                    if (affected.class && affected.method) {
                        const facadeClass = affected.class.split('\\').pop() || '';
                        sections.push(markdown_template_1.MarkdownTemplate.listItem(`${markdown_template_1.MarkdownTemplate.code(`${facadeClass}::${affected.method}()`)} (${affected.hops} hops)`, 1));
                    }
                }
                sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
            }
        }
        return sections.join('\n');
    }
    generateSafeChangesSection(report) {
        return markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.SAFE_CHANGES)) + '\n' +
            markdown_template_1.MarkdownTemplate.paragraph(`${display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.SAFE_CHANGES)} (${report.summary.internalNoImpact} methods).`);
    }
    generateNonPhpFilesSection(report) {
        if (report.nonPhpFiles.length === 0)
            return '';
        const sections = [
            markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.NON_PHP_FILES)),
            markdown_template_1.MarkdownTemplate.paragraph(display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.NON_PHP_FILES)),
        ];
        const grouped = data_grouper_1.DataGrouper.groupByFileType(report.nonPhpFiles);
        for (const [fileType, files] of grouped) {
            sections.push(markdown_template_1.MarkdownTemplate.heading3(display_config_1.DisplayConfig.formatFileTypeTitle(fileType, files.length)));
            for (const file of files) {
                const emoji = display_config_1.DisplayConfig.getChangeEmoji(file.changeType);
                sections.push(markdown_template_1.MarkdownTemplate.listItem(`${emoji} ${markdown_template_1.MarkdownTemplate.code(file.file)}`));
            }
            sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
        }
        return sections.join('\n');
    }
    generateSkippedFilesSection(report) {
        if (report.skippedFiles.length === 0)
            return '';
        const sections = [
            markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.SKIPPED_FILES)),
            markdown_template_1.MarkdownTemplate.paragraph(display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.SKIPPED_FILES)),
        ];
        for (const skipped of report.skippedFiles) {
            sections.push(markdown_template_1.MarkdownTemplate.heading3(skipped.file));
            sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.reason, skipped.reason));
            sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
        }
        return sections.join('\n');
    }
    generateAllMethodsSection(report) {
        const sections = [];
        if (report.newMethods && report.newMethods.length > 0) {
            sections.push(markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.ALL_NEW_METHODS)));
            sections.push(markdown_template_1.MarkdownTemplate.paragraph(display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.ALL_NEW_METHODS)));
            const grouped = data_grouper_1.DataGrouper.groupByFile(report.newMethods);
            for (const [file, methods] of grouped) {
                sections.push(markdown_template_1.MarkdownTemplate.heading3(file));
                for (const method of methods) {
                    sections.push(markdown_template_1.MarkdownTemplate.heading4(`${method.visibility} function ${method.name}(${method.params || ''})`));
                    sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.class, markdown_template_1.MarkdownTemplate.code(method.class)));
                    sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.fqcn, markdown_template_1.MarkdownTemplate.code(method.fqcn)));
                    sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
                }
            }
        }
        if (report.modifiedMethods && report.modifiedMethods.length > 0) {
            sections.push(markdown_template_1.MarkdownTemplate.heading2(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.ALL_MODIFIED_METHODS)));
            sections.push(markdown_template_1.MarkdownTemplate.paragraph(display_config_1.DisplayConfig.getSectionDescription(section_keys_1.SectionKeys.ALL_MODIFIED_METHODS)));
            const grouped = data_grouper_1.DataGrouper.groupByFile(report.modifiedMethods);
            for (const [file, methods] of grouped) {
                sections.push(markdown_template_1.MarkdownTemplate.heading3(file));
                for (const method of methods) {
                    sections.push(markdown_template_1.MarkdownTemplate.heading4(`${method.name}()`));
                    sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.class, markdown_template_1.MarkdownTemplate.code(method.class)));
                    sections.push(markdown_template_1.MarkdownTemplate.keyValue(text_config_1.TextConfig.labels.signatureChanged, method.signatureChanged ? 'Yes' : 'No'));
                    sections.push(markdown_template_1.MarkdownTemplate.emptyLine());
                }
            }
        }
        return sections.join('\n');
    }
}
exports.MarkdownFormatter = MarkdownFormatter;
//# sourceMappingURL=markdown-formatter.js.map