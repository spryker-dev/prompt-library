export declare class TwigParser {
    parse(content: string): TwigFeatures;
    private extractDataAttributes;
    private extractDefineDataVariables;
    private extractAttributesKeys;
    private extractMolecules;
    private extractWidgets;
    private extractIncludes;
    private extractBlocks;
    private extractVariables;
    private extractMacros;
}
export interface TwigFeatures {
    dataAttributes: string[];
    includes: string[];
    blocks: string[];
    variables: string[];
    macros: string[];
    defineDataVariables: string[];
    attributesKeys: string[];
    molecules: string[];
    widgets: string[];
}
//# sourceMappingURL=twig-parser.d.ts.map