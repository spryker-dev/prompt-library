import { FullyQualifiedName } from '../types/domain.types';
export declare class PropertyTypeExtractor {
    static extractVarFqnFromDoc(text: string, currentNs: string, currentUses: Record<string, string>): FullyQualifiedName | null;
    static collectCommentText(node: any): string;
}
//# sourceMappingURL=property-type-extractor.d.ts.map