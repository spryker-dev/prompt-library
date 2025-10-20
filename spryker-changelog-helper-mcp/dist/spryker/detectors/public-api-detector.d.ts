export interface MethodInfo {
    fqcn: string;
    visibility: string;
}
export declare class PublicApiDetector {
    static isPlugin(className: string): boolean;
    static isConfig(className: string): boolean;
    static isPublicApiClass(className: string): boolean;
    static isPublicApi(method: MethodInfo): boolean;
    static extractModuleName(fqcn: string): string;
    static isInternalApiLayer(fqcn: string): boolean;
}
//# sourceMappingURL=public-api-detector.d.ts.map