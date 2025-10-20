interface PhpDocResult {
    description?: string;
    isApiMethod?: boolean;
    isDeprecated?: boolean;
}
export declare class PhpDocParser {
    static parse(docText: string): PhpDocResult;
    static extractDescription(docText: string): string | undefined;
    static collectCommentText(node: any): string;
    private static shouldSkipLine;
}
export {};
//# sourceMappingURL=php-doc-parser.d.ts.map