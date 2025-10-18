"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleFormatter = void 0;
const text_builder_1 = require("./utils/text-builder");
const data_grouper_1 = require("./utils/data-grouper");
const console_template_1 = require("./templates/console-template");
const display_config_1 = require("./config/display-config");
const section_keys_1 = require("./config/section-keys");
const text_config_1 = require("./config/text-config");
const console_module_formatter_v2_1 = require("./console-module-formatter-v2");
class ConsoleFormatter {
    constructor() {
        this.moduleFormatter = new console_module_formatter_v2_1.ConsoleModuleFormatterV2();
    }
    format(report) {
        console.log(this.buildOutput(report));
        // Show module-grouped report
        if (report.moduleReports && report.moduleReports.size > 0) {
            console.log('\n');
            this.moduleFormatter.format(report.moduleReports);
        }
    }
    buildOutput(report) {
        const builder = new text_builder_1.TextBuilder();
        builder
            .add(console_template_1.ConsoleTemplate.section(`${display_config_1.DisplayConfig.riskLevels[report.riskLevel.level.toLowerCase()].emoji} ${text_config_1.TextConfig.messages.riskLevel}: ${report.riskLevel.emoji} ${report.riskLevel.level}`))
            .add(this.buildVersionRecommendation(report.versionRecommendation))
            .add(console_template_1.ConsoleTemplate.section(`${display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.CHANGES_OVERVIEW)}:`))
            .add(this.buildSummaryLines(report.summary))
            .add(this.buildSchemaSection(report.schemaChanges))
            .add(this.buildTransferSection(report.transferChanges))
            .add(this.buildNonPhpFilesSection(report.nonPhpFiles))
            .add(this.buildSkippedFilesSection(report.skippedFiles))
            .add(this.buildConfigMethodsSection(report))
            .add(this.buildInternalChangesSection(report.internalChangesWithImpact));
        return builder.build();
    }
    buildVersionRecommendation(recommendation) {
        if (!recommendation)
            return '';
        const builder = new text_builder_1.TextBuilder();
        const bumpEmoji = recommendation.recommendedBump === 'MAJOR' ? '🔴' :
            recommendation.recommendedBump === 'MINOR' ? '🟡' : '🟢';
        builder.add(console_template_1.ConsoleTemplate.section(`📌 Version Recommendation: ${bumpEmoji} ${recommendation.recommendedBump} (${recommendation.confidence} confidence)`));
        if (recommendation.reasons.length > 0) {
            builder.add(console_template_1.ConsoleTemplate.subsection('Reasons:', 1));
            for (const reason of recommendation.reasons) {
                const emoji = reason.type === 'MAJOR' ? '🔴' : reason.type === 'MINOR' ? '🟡' : '🟢';
                builder.add(console_template_1.ConsoleTemplate.listItem(`${emoji} ${reason.description} (${reason.count})`, 2));
            }
        }
        if (recommendation.requiresManualReview) {
            builder.add(console_template_1.ConsoleTemplate.subsection('⚠️  Manual Review Required', 1));
        }
        if (recommendation.notes.length > 0) {
            builder.add(console_template_1.ConsoleTemplate.subsection('Notes:', 1));
            for (const note of recommendation.notes) {
                builder.add(console_template_1.ConsoleTemplate.listItem(note, 2));
            }
        }
        return builder.build();
    }
    buildSummaryLines(summary) {
        const lines = [
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.newPublicAPI, summary.newPublicAPI, 1),
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.modifiedPublicAPI, summary.modifiedPublicAPI, 1),
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.newConfigMethods, summary.newConfigMethods, 1),
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.modifiedConfigMethods, summary.modifiedConfigMethods, 1),
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.internalWithImpact, summary.internalWithImpact, 1),
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.internalNoImpact, summary.internalNoImpact, 1),
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.newMethods, summary.newMethods, 1),
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.modifiedMethods, summary.modifiedMethods, 1),
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.removedMethods, summary.removedMethods, 1),
            console_template_1.ConsoleTemplate.keyValue(text_config_1.TextConfig.categories.newClasses, summary.newClasses, 1),
        ];
        return lines.join('\n');
    }
    buildSchemaSection(schemas) {
        if (schemas.length === 0)
            return '';
        const builder = new text_builder_1.TextBuilder();
        builder.add(console_template_1.ConsoleTemplate.section('📦 Database Schema Changes'));
        for (const schema of schemas) {
            builder.add(console_template_1.ConsoleTemplate.subsection(`${display_config_1.DisplayConfig.changeTypes[schema.changeType].emoji} ${schema.tableName}`, 1));
            if (schema.addedColumns && schema.addedColumns.length > 0) {
                builder.add(console_template_1.ConsoleTemplate.indentedText(`${display_config_1.DisplayConfig.changeTypes.added.emoji} Added Columns (${schema.addedColumns.length}):`, 2));
                for (const col of schema.addedColumns) {
                    const details = [col.type, col.size].filter(Boolean).join(', ');
                    builder.add(console_template_1.ConsoleTemplate.listItem(`${col.name}${details ? ` (${details})` : ''}`, 3));
                }
            }
            if (schema.removedColumns && schema.removedColumns.length > 0) {
                builder.add(console_template_1.ConsoleTemplate.indentedText(`${display_config_1.DisplayConfig.changeTypes.removed.emoji} Removed Columns (${schema.removedColumns.length}):`, 2));
                for (const col of schema.removedColumns) {
                    builder.add(console_template_1.ConsoleTemplate.listItem(col.name, 3));
                }
            }
            if (schema.addedIndexes && schema.addedIndexes.length > 0) {
                builder.add(console_template_1.ConsoleTemplate.indentedText(`${display_config_1.DisplayConfig.changeTypes.added.emoji} Added Indexes (${schema.addedIndexes.length}):`, 2));
                for (const idx of schema.addedIndexes) {
                    builder.add(console_template_1.ConsoleTemplate.listItem(`${idx.name} (${idx.columns.join(', ')})`, 3));
                }
            }
            if (schema.removedIndexes && schema.removedIndexes.length > 0) {
                builder.add(console_template_1.ConsoleTemplate.indentedText(`${display_config_1.DisplayConfig.changeTypes.removed.emoji} Removed Indexes (${schema.removedIndexes.length}):`, 2));
                for (const idx of schema.removedIndexes) {
                    builder.add(console_template_1.ConsoleTemplate.listItem(`${idx.name} (${idx.columns.join(', ')})`, 3));
                }
            }
        }
        return builder.build();
    }
    buildTransferSection(transfers) {
        if (transfers.length === 0)
            return '';
        const builder = new text_builder_1.TextBuilder();
        const grouped = data_grouper_1.DataGrouper.groupByType(transfers);
        builder.add(console_template_1.ConsoleTemplate.section(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.TRANSFER_CHANGES)));
        const newTransfers = grouped.get('new') || [];
        if (newTransfers.length > 0) {
            builder.add(console_template_1.ConsoleTemplate.subsection(display_config_1.DisplayConfig.formatTransferTitle('new', newTransfers.length) + ':', 1));
            builder.addList(newTransfers.map(t => console_template_1.ConsoleTemplate.listItem(t.transferName, 2)), display_config_1.DisplayConfig.limits.maxDisplayItems);
        }
        const modifiedTransfers = grouped.get('modified') || [];
        if (modifiedTransfers.length > 0) {
            builder.add(console_template_1.ConsoleTemplate.subsection(display_config_1.DisplayConfig.formatTransferTitle('modified', modifiedTransfers.length) + ':', 1));
            const lines = modifiedTransfers.slice(0, display_config_1.DisplayConfig.limits.maxDisplayItems).flatMap(t => {
                const result = [console_template_1.ConsoleTemplate.listItem(t.transferName, 2)];
                if (t.addedProperties?.length) {
                    result.push(console_template_1.ConsoleTemplate.indentedText(`${display_config_1.DisplayConfig.changeTypes.added.emoji} ${text_config_1.TextConfig.labels.addedProperties}: ${t.addedProperties.join(', ')}`, 3));
                }
                if (t.removedProperties?.length) {
                    result.push(console_template_1.ConsoleTemplate.indentedText(`${display_config_1.DisplayConfig.changeTypes.removed.emoji} ${text_config_1.TextConfig.labels.removedProperties}: ${t.removedProperties.join(', ')}`, 3));
                }
                return result;
            });
            builder.addList(lines);
            if (modifiedTransfers.length > display_config_1.DisplayConfig.limits.maxDisplayItems) {
                builder.add(console_template_1.ConsoleTemplate.indentedText(display_config_1.DisplayConfig.formatMoreMessage(modifiedTransfers.length - display_config_1.DisplayConfig.limits.maxDisplayItems), 2));
            }
        }
        const removedTransfers = grouped.get('removed') || [];
        if (removedTransfers.length > 0) {
            builder.add(console_template_1.ConsoleTemplate.subsection(display_config_1.DisplayConfig.formatTransferTitle('removed', removedTransfers.length) + ':', 1));
            builder.addList(removedTransfers.map(t => console_template_1.ConsoleTemplate.listItem(t.transferName, 2)), display_config_1.DisplayConfig.limits.maxDisplayItems);
        }
        return builder.build();
    }
    buildNonPhpFilesSection(files) {
        if (files.length === 0)
            return '';
        const builder = new text_builder_1.TextBuilder();
        const grouped = data_grouper_1.DataGrouper.groupByFileType(files);
        builder.add(console_template_1.ConsoleTemplate.section(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.NON_PHP_FILES)));
        for (const [fileType, fileList] of grouped) {
            builder.add(console_template_1.ConsoleTemplate.subsection(display_config_1.DisplayConfig.formatFileTypeTitle(fileType, fileList.length) + ':', 1));
            builder.addList(fileList.map(f => console_template_1.ConsoleTemplate.indentedText(`${display_config_1.DisplayConfig.getChangeEmoji(f.changeType)} ${f.file}`, 2)), display_config_1.DisplayConfig.limits.maxDisplayItems);
        }
        return builder.build();
    }
    buildSkippedFilesSection(files) {
        if (files.length === 0)
            return '';
        const builder = new text_builder_1.TextBuilder();
        builder.add(console_template_1.ConsoleTemplate.section(`${display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.SKIPPED_FILES)} (${text_config_1.TextConfig.messages.couldNotAnalyze}):`));
        for (const skipped of files) {
            builder.add(console_template_1.ConsoleTemplate.listItem(skipped.file, 1));
            builder.add(console_template_1.ConsoleTemplate.indentedText(`${text_config_1.TextConfig.labels.reason}: ${skipped.reason}`, 2));
        }
        return builder.build();
    }
    buildConfigMethodsSection(report) {
        const builder = new text_builder_1.TextBuilder();
        if (report.newConfigMethods.length > 0) {
            builder.add(console_template_1.ConsoleTemplate.section(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.NEW_CONFIG_METHODS)));
            builder.addList(report.newConfigMethods.map(m => console_template_1.ConsoleTemplate.listItem(this.formatMethodCall(m.method), 1)));
        }
        if (report.modifiedConfigMethods.length > 0) {
            builder.add(console_template_1.ConsoleTemplate.section(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.MODIFIED_CONFIG_METHODS)));
            builder.addList(report.modifiedConfigMethods.map(m => console_template_1.ConsoleTemplate.listItem(this.formatMethodCall(m.method), 1)));
        }
        return builder.build();
    }
    formatMethodCall(fqcn) {
        const parts = fqcn.split('::');
        const className = parts[0]?.split('\\').pop() || '';
        const methodName = parts[1] || '';
        return `${className}::${methodName}()`;
    }
    buildInternalChangesSection(changes) {
        if (changes.length === 0)
            return '';
        const builder = new text_builder_1.TextBuilder();
        const grouped = data_grouper_1.DataGrouper.groupByModule(changes);
        builder.add(console_template_1.ConsoleTemplate.section(display_config_1.DisplayConfig.getSectionTitle(section_keys_1.SectionKeys.INTERNAL_CHANGES)));
        for (const [moduleName, moduleChanges] of grouped) {
            builder.add(console_template_1.ConsoleTemplate.subsection(`${display_config_1.DisplayConfig.categoryEmojis.transferChanges} ${display_config_1.DisplayConfig.formatModuleTitle(moduleName)}:`, 1));
            for (const item of moduleChanges) {
                const methodCall = this.formatMethodCall(item.method);
                builder.add(console_template_1.ConsoleTemplate.bulletItem(methodCall, 2));
                if (item.affectedMethods.length > 0) {
                    builder.add(console_template_1.ConsoleTemplate.indentedText(display_config_1.DisplayConfig.formatAffectsMessage(item.affectedMethods.length) + ':', 3));
                    const affectedLines = item.affectedMethods.slice(0, display_config_1.DisplayConfig.limits.maxAffectedMethods)
                        .filter(a => a.class && a.method)
                        .map(a => {
                        const facadeClass = a.class.split('\\').pop() || '';
                        return console_template_1.ConsoleTemplate.arrow(`${facadeClass}::${a.method}() (${a.hops} hops)`, 4);
                    });
                    builder.addList(affectedLines);
                    if (item.affectedMethods.length > display_config_1.DisplayConfig.limits.maxAffectedMethods) {
                        builder.add(console_template_1.ConsoleTemplate.indentedText(display_config_1.DisplayConfig.formatMoreMessage(item.affectedMethods.length - display_config_1.DisplayConfig.limits.maxAffectedMethods), 4));
                    }
                }
            }
        }
        return builder.build();
    }
}
exports.ConsoleFormatter = ConsoleFormatter;
//# sourceMappingURL=console-formatter.js.map