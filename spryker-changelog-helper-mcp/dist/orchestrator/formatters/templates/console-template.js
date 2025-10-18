"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleTemplate = void 0;
class ConsoleTemplate {
    static section(title) {
        return `\n${title}`;
    }
    static subsection(title, indent = 0) {
        return `${'  '.repeat(indent)}${title}`;
    }
    static listItem(text, indent = 0) {
        return `${'  '.repeat(indent)}- ${text}`;
    }
    static bulletItem(text, indent = 0) {
        return `${'  '.repeat(indent)}• ${text}`;
    }
    static keyValue(key, value, indent = 0) {
        return `${'  '.repeat(indent)}- ${key}: ${value}`;
    }
    static indentedText(text, indent = 0) {
        return `${'  '.repeat(indent)}${text}`;
    }
    static arrow(text, indent = 0) {
        return `${'  '.repeat(indent)}→ ${text}`;
    }
    static emptyLine() {
        return '';
    }
    static separator() {
        return '\n';
    }
}
exports.ConsoleTemplate = ConsoleTemplate;
//# sourceMappingURL=console-template.js.map