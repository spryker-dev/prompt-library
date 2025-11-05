import { Property, Assign } from '../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap, Logger } from '../../types/domain.types';
export declare class PropertyTypeTracker {
    private logger;
    constructor(logger: Logger);
    processPropertyDeclaration(property: Property, classFqn: FullyQualifiedName, propertyTypes: PropertyTypeMap, currentNamespace: string, currentUses: Record<string, string>): void;
    trackPropertyAssignment(assign: Assign, classFqn: FullyQualifiedName, propertyTypes: PropertyTypeMap, resolveExprType: (expr: any) => FullyQualifiedName | null): void;
    trackLocalVariable(assign: Assign, localTypes: Record<string, FullyQualifiedName>, currentNamespace: string, currentUses: Record<string, string>): void;
    private extractPropertyType;
    private extractDeclaredType;
    private registerPropertyTypes;
    private extractPropertyName;
}
//# sourceMappingURL=property-type-tracker.d.ts.map