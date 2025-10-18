export declare class MarkdownTemplate {
    static heading1(text: string): string;
    static heading2(text: string): string;
    static heading3(text: string): string;
    static heading4(text: string): string;
    static bold(text: string): string;
    static code(text: string): string;
    static listItem(text: string, indent?: number): string;
    static keyValue(key: string, value: string): string;
    static table(headers: string[], rows: string[][]): string;
    static paragraph(text: string): string;
    static emptyLine(): string;
}
//# sourceMappingURL=markdown-template.d.ts.map