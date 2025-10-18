export declare class TextBuilder {
    private lines;
    add(text: string): this;
    addIf(condition: boolean, text: string): this;
    addSection(title: string, content: string[]): this;
    addList(items: string[], limit?: number): this;
    build(): string;
    clear(): this;
}
//# sourceMappingURL=text-builder.d.ts.map