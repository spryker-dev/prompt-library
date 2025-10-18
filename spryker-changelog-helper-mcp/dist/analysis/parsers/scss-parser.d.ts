export declare class ScssParser {
    parse(content: string): ScssFeatures;
    private extractVariables;
    private extractCssVariables;
    private extractMixins;
    private extractClasses;
    private extractModifiers;
}
export interface ScssFeatures {
    variables: string[];
    cssVariables: string[];
    mixins: string[];
    classes: string[];
    modifiers: string[];
}
//# sourceMappingURL=scss-parser.d.ts.map