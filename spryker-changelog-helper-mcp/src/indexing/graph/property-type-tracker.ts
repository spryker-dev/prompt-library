import { Property, Assign, Variable, PropertyLookup, New } from '../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap, Logger } from '../../types/domain.types';
import { NameResolver } from '../../utils/name-resolver';
import { PropertyTypeExtractor } from '../property/property-type-extractor';
import { AstNodeKind, SpecialVariables } from '../constants/ast-node-kinds';

export class PropertyTypeTracker {
  constructor(private logger: Logger) {}

  processPropertyDeclaration(
    property: Property,
    classFqn: FullyQualifiedName,
    propertyTypes: PropertyTypeMap,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): void {
    const propertyType = this.extractPropertyType(property, currentNamespace, currentUses);

    if (propertyType) {
      this.registerPropertyTypes(property, classFqn, propertyTypes, propertyType);
    }
  }

  trackPropertyAssignment(
    assign: Assign,
    classFqn: FullyQualifiedName,
    propertyTypes: PropertyTypeMap,
    resolveExprType: (expr: any) => FullyQualifiedName | null
  ): void {
    const propertyLookup = assign.left as PropertyLookup;
    const isThisProperty = propertyLookup.what?.kind === AstNodeKind.VARIABLE 
      && (propertyLookup.what as Variable).name === SpecialVariables.THIS;

    if (isThisProperty) {
      const propertyName = NameResolver.getIdentifierName(propertyLookup.offset);
      const propertyType = resolveExprType(assign.right);

      if (propertyName && propertyType) {
        propertyTypes[propertyName] = propertyType;
        this.logger?.('[prop-type]', `${classFqn}::$${propertyName}`, '=>', propertyType);
      }
    }
  }

  trackLocalVariable(
    assign: Assign,
    localTypes: Record<string, FullyQualifiedName>,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): void {
    const variableName = typeof (assign.left as Variable).name === 'string' 
      ? (assign.left as Variable).name 
      : null;
    const className = NameResolver.resolveName((assign.right as New).what, currentNamespace, currentUses);

    if (variableName && className) {
      localTypes[variableName] = className;
    }
  }

  private extractPropertyType(
    property: Property,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    const declaredType = this.extractDeclaredType(property, currentNamespace, currentUses);
    if (declaredType) return declaredType;

    const docText = PropertyTypeExtractor.collectCommentText(property);
    return PropertyTypeExtractor.extractVarFqnFromDoc(docText, currentNamespace, currentUses);
  }

  private extractDeclaredType(
    property: Property,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    if (!property.type) return null;

    const typeNode = (property.type as any).kind === AstNodeKind.NULLABLE_TYPE 
      ? (property.type as any).what 
      : property.type;

    return NameResolver.resolveName(typeNode, currentNamespace, currentUses);
  }

  private registerPropertyTypes(
    property: Property,
    classFqn: FullyQualifiedName,
    propertyTypes: PropertyTypeMap,
    propertyType: FullyQualifiedName
  ): void {
    for (const prop of property.properties || []) {
      const propertyName = this.extractPropertyName(prop);

      if (propertyName && !propertyTypes[propertyName]) {
        propertyTypes[propertyName] = propertyType;
        this.logger?.('[prop-decl]', `${classFqn}::$${propertyName}`, '=>', propertyType);
      }
    }
  }

  private extractPropertyName(property: any): string | null {
    if ((property.name as any)?.name) {
      return String((property.name as any).name);
    }
    if (typeof property.name === 'string') {
      return property.name;
    }
    return null;
  }
}
