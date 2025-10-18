import { FullyQualifiedName } from '../../types/domain.types';
export declare class PropertyTypeExtractor {
    static extractVarFqnFromDoc(text: string, currentNamespace: string, currentUses: Record<string, string>): FullyQualifiedName | null;
    private static resolveFirstNonPrimitiveType;
    private static resolveSingleType;
    static collectCommentText(node: any): string;
}
//# sourceMappingURL=property-type-extractor.d.ts.map