export interface MethodDetails {
    visibility: string;
    params: string;
    isStatic: boolean;
}
export interface MethodPhpDoc {
    description?: string;
    isApiMethod?: boolean;
    isDeprecated?: boolean;
}
export declare class PHPParser {
    extractClassNameFromFilePath(file: string): string | null;
    buildFQCN(file: string, className: string): string;
    private convertPathToNamespace;
    private buildSprykerFQCN;
    private buildGenericFQCN;
    extractMethodNameFromLine(line: string): string | null;
    extractMethodDetails(line: string): MethodDetails;
    isMethodSignatureLine(line: string): boolean;
}
//# sourceMappingURL=php-parser.d.ts.map