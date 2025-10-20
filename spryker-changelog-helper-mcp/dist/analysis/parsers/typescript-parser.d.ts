export declare class TypescriptParser {
    parse(content: string): TypescriptFeatures;
    private extractClasses;
    private extractMethods;
    private extractProperties;
    private extractEvents;
}
export interface TypescriptFeatures {
    classes: string[];
    methods: MethodInfo[];
    properties: PropertyInfo[];
    events: string[];
}
export interface MethodInfo {
    name: string;
    visibility: 'public' | 'protected' | 'private';
}
export interface PropertyInfo {
    name: string;
    visibility: 'public' | 'protected' | 'private';
}
//# sourceMappingURL=typescript-parser.d.ts.map