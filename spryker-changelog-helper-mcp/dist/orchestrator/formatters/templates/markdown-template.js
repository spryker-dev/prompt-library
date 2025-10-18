"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownTemplate = void 0;
class MarkdownTemplate {
    static heading1(text) {
        return `# ${text}\n`;
    }
    static heading2(text) {
        return `## ${text}\n`;
    }
    static heading3(text) {
        return `### ${text}\n`;
    }
    static heading4(text) {
        return `#### ${text}\n`;
    }
    static bold(text) {
        return `**${text}**`;
    }
    static code(text) {
        return `\`${text}\``;
    }
    static listItem(text, indent = 0) {
        return `${'  '.repeat(indent)}- ${text}`;
    }
    static keyValue(key, value) {
        return `- ${this.bold(key)}: ${value}`;
    }
    static table(headers, rows) {
        const headerRow = `| ${headers.join(' | ')} |`;
        const separator = `| ${headers.map(() => '---').join(' | ')} |`;
        const dataRows = rows.map(row => `| ${row.join(' | ')} |`);
        return [headerRow, separator, ...dataRows].join('\n') + '\n';
    }
    static paragraph(text) {
        return `${text}\n`;
    }
    static emptyLine() {
        return '';
    }
}
exports.MarkdownTemplate = MarkdownTemplate;
//# sourceMappingURL=markdown-template.js.map