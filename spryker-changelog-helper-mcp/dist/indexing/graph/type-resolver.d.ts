import { FullyQualifiedName } from '../../types/domain.types';
export declare class TypeResolver {
    resolveExpressionType(expression: any, localTypes: Record<string, FullyQualifiedName>, paramTypes: Record<string, FullyQualifiedName>, currentNamespace: string, currentUses: Record<string, string>): FullyQualifiedName | null;
    private resolveNewExpression;
    private resolveVariableType;
}
//# sourceMappingURL=type-resolver.d.ts.map