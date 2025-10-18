export declare class MethodParser {
    static parseSignature(fqcn: string): {
        className: string;
        methodName: string;
        fullClass: string;
    };
    static formatMethodCall(fqcn: string): string;
    static getChangeEmoji(changeType: string): string;
}
//# sourceMappingURL=method-parser.d.ts.map