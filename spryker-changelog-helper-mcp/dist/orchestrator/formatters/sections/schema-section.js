"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaSection = void 0;
const markdown_template_1 = require("../templates/markdown-template");
const display_config_1 = require("../config/display-config");
class SchemaSection {
    static generate(report) {
        if (report.schemaChanges.length === 0) {
            return '';
        }
        const sections = [
            markdown_template_1.MarkdownTemplate.heading2('📦 Database Schema Changes'),
            markdown_template_1.MarkdownTemplate.paragraph(`Changes to database schema files (${report.schemaChanges.length} table(s) affected).`),
        ];
        for (const schema of report.schemaChanges) {
            sections.push(markdown_template_1.MarkdownTemplate.heading3(`${display_config_1.DisplayConfig.changeTypes[schema.changeType].emoji} ${schema.tableName}`));
            sections.push(markdown_template_1.MarkdownTemplate.paragraph(markdown_template_1.MarkdownTemplate.bold('File: ') + markdown_template_1.MarkdownTemplate.code(schema.file)));
            if (schema.addedColumns && schema.addedColumns.length > 0) {
                sections.push(markdown_template_1.MarkdownTemplate.heading4(`${display_config_1.DisplayConfig.changeTypes.added.emoji} Added Columns (${schema.addedColumns.length})`));
                for (const col of schema.addedColumns) {
                    const details = [col.type, col.size].filter(Boolean).join(', ');
                    const desc = col.description ? ` - ${col.description}` : '';
                    sections.push(markdown_template_1.MarkdownTemplate.listItem(`${markdown_template_1.MarkdownTemplate.code(col.name)}${details ? ` (${details})` : ''}${desc}`));
                }
            }
            if (schema.removedColumns && schema.removedColumns.length > 0) {
                sections.push(markdown_template_1.MarkdownTemplate.heading4(`${display_config_1.DisplayConfig.changeTypes.removed.emoji} Removed Columns (${schema.removedColumns.length})`));
                for (const col of schema.removedColumns) {
                    const details = col.type ? ` (${col.type})` : '';
                    sections.push(markdown_template_1.MarkdownTemplate.listItem(`${markdown_template_1.MarkdownTemplate.code(col.name)}${details}`));
                }
            }
            if (schema.addedIndexes && schema.addedIndexes.length > 0) {
                sections.push(markdown_template_1.MarkdownTemplate.heading4(`${display_config_1.DisplayConfig.changeTypes.added.emoji} Added Indexes (${schema.addedIndexes.length})`));
                for (const idx of schema.addedIndexes) {
                    const unique = idx.unique ? ' (UNIQUE)' : '';
                    sections.push(markdown_template_1.MarkdownTemplate.listItem(`${markdown_template_1.MarkdownTemplate.code(idx.name)}${unique} on columns: ${idx.columns.map(c => markdown_template_1.MarkdownTemplate.code(c)).join(', ')}`));
                }
            }
            if (schema.removedIndexes && schema.removedIndexes.length > 0) {
                sections.push(markdown_template_1.MarkdownTemplate.heading4(`${display_config_1.DisplayConfig.changeTypes.removed.emoji} Removed Indexes (${schema.removedIndexes.length})`));
                for (const idx of schema.removedIndexes) {
                    sections.push(markdown_template_1.MarkdownTemplate.listItem(`${markdown_template_1.MarkdownTemplate.code(idx.name)} on columns: ${idx.columns.map(c => markdown_template_1.MarkdownTemplate.code(c)).join(', ')}`));
                }
            }
        }
        return sections.join('\n\n');
    }
}
exports.SchemaSection = SchemaSection;
//# sourceMappingURL=schema-section.js.map