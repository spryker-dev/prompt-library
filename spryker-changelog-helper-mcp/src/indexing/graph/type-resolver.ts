import { New, Variable } from '../../types/ast.types';
import { FullyQualifiedName } from '../../types/domain.types';
import { NameResolver } from '../../utils/name-resolver';
import { AstNodeKind } from '../constants/ast-node-kinds';

export class TypeResolver {
  resolveExpressionType(
    expression: any,
    localTypes: Record<string, FullyQualifiedName>,
    paramTypes: Record<string, FullyQualifiedName>,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    if (!expression) return null;

    if (expression.kind === AstNodeKind.NEW) {
      return this.resolveNewExpression(expression, currentNamespace, currentUses);
    }

    if (expression.kind === AstNodeKind.VARIABLE) {
      return this.resolveVariableType(expression, localTypes, paramTypes);
    }

    return null;
  }

  private resolveNewExpression(
    expression: New,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    return NameResolver.resolveName(expression.what, currentNamespace, currentUses);
  }

  private resolveVariableType(
    expression: Variable,
    localTypes: Record<string, FullyQualifiedName>,
    paramTypes: Record<string, FullyQualifiedName>
  ): FullyQualifiedName | null {
    const variableName = expression.name;
    
    if (typeof variableName !== 'string') return null;
    
    return localTypes[variableName] || paramTypes[variableName] || null;
  }
}
