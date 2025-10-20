import { Method, Parameter } from '../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap, Logger } from '../../types/domain.types';
import { NameResolver } from '../../utils/name-resolver';
import { AstNodeKind, SpecialMethods } from '../constants/ast-node-kinds';

export class ParameterProcessor {
  constructor(private logger: Logger) {}

  processMethodParameters(
    method: Method,
    methodName: string,
    classFqn: FullyQualifiedName,
    propertyTypes: PropertyTypeMap,
    currentNamespace: string,
    currentUses: Record<string, string>,
    parameterTypes: Record<string, FullyQualifiedName>
  ): void {
    const parameters = this.extractParameters(method);

    for (const param of parameters) {
      const parameterName = this.extractParameterName(param);
      const parameterType = this.resolveParameterType(param, currentNamespace, currentUses);

      if (parameterName && parameterType) {
        parameterTypes[parameterName] = parameterType;

        const isConstructor = methodName === SpecialMethods.CONSTRUCT;
        if (isConstructor && this.isPromotedProperty(param)) {
          propertyTypes[parameterName] = parameterType;
          this.logger?.('[prop-promoted]', `${classFqn}::$${parameterName}`, '=>', parameterType);
        }
      }
    }
  }

  private extractParameters(method: Method): Parameter[] {
    if (Array.isArray(method?.params)) return method.params;
    if (Array.isArray(method?.arguments)) return method.arguments;
    return [];
  }

  private extractParameterName(param: Parameter): string | null {
    if (param.name && typeof (param.name as any).name === 'string') {
      return String((param.name as any).name);
    }
    if (typeof param.name === 'string') {
      return param.name;
    }
    return null;
  }

  private resolveParameterType(
    param: Parameter,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    if (!param.type) return null;

    const typeNode = (param.type as any).kind === AstNodeKind.NULLABLE_TYPE 
      ? (param.type as any).what 
      : param.type;

    return NameResolver.resolveName(typeNode, currentNamespace, currentUses);
  }

  private isPromotedProperty(param: Parameter): boolean {
    const hasFlagsSet = !!(param.flags && param.flags !== 0);
    const hasVisibility = !!(param.visibility && param.visibility !== null);
    return hasFlagsSet || hasVisibility;
  }
}
