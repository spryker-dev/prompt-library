import { Variable, ASTNode } from '../../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap, Logger } from '../../../types/domain.types';
import { canonKey, ensureFqn } from '../../../utils/canonical';
import { AstNodeKind, SpecialVariables } from '../../constants/ast-node-kinds';
import { EdgeKind } from '../../constants/edge-kinds';

export class InstanceCallHandler {
  constructor(
    private interfaceToImplementations: Map<FullyQualifiedName, Set<FullyQualifiedName>>,
    private logger: Logger
  ) {}

  processDirectCall(
    chain: { names: (string | null)[]; base: ASTNode | null },
    classFqn: FullyQualifiedName,
    methodName: string,
    addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void
  ): void {
    if (this.isThisCall(chain) && this.isSingleMethodCall(chain)) {
      addEdge(classFqn, methodName, EdgeKind.INTRA);
    }
  }

  processPropertyCall(
    chain: { names: (string | null)[]; base: ASTNode | null },
    classFqn: FullyQualifiedName,
    currentMethodName: string,
    propertyTypes: PropertyTypeMap,
    targetMethodName: string,
    addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void
  ): void {
    if (!this.isThisCall(chain) || !this.hasPropertyAccess(chain)) return;

    const propertyName = chain.names[0];
    const propertyType = propertyTypes[propertyName as string];

    if (propertyType) {
      addEdge(propertyType, targetMethodName, EdgeKind.THIS_PROPERTY);
      this.logger?.('[this-prop]', canonKey(classFqn, currentMethodName), '->', `${propertyType}::${targetMethodName}`);
      this.addInterfaceEdges(propertyType, targetMethodName, addEdge);
      return;
    }
    
    this.logger?.('[prop-miss]', canonKey(classFqn, currentMethodName), 'prop', propertyName, 'no type found');
  }

  processVariableCall(
    chain: { base: ASTNode | null },
    localTypes: Record<string, FullyQualifiedName>,
    paramTypes: Record<string, FullyQualifiedName>,
    methodName: string,
    addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void
  ): void {
    const variableName = this.extractVariableName(chain);
    if (!variableName || variableName === SpecialVariables.THIS) return;

    const variableType = localTypes[variableName] || paramTypes[variableName] || null;

    if (variableType) {
      addEdge(variableType, methodName, EdgeKind.METHOD);
      this.addInterfaceEdges(variableType, methodName, addEdge);
    }
  }

  private isThisCall(chain: { base: ASTNode | null }): boolean {
    return chain.base?.kind === AstNodeKind.VARIABLE && 
           (chain.base as Variable).name === SpecialVariables.THIS;
  }

  private isSingleMethodCall(chain: { names: (string | null)[] }): boolean {
    return chain.names.length === 1;
  }

  private hasPropertyAccess(chain: { names: (string | null)[] }): boolean {
    return chain.names.length >= 2;
  }

  private extractVariableName(chain: { base: ASTNode | null }): string | null {
    if (chain.base?.kind !== AstNodeKind.VARIABLE) return null;
    
    const name = (chain.base as Variable).name;
    return typeof name === 'string' ? name : null;
  }

  private addInterfaceEdges(
    typeFqn: FullyQualifiedName,
    methodName: string,
    addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void
  ): void {
    const implementations = this.interfaceToImplementations.get(ensureFqn(typeFqn));
    
    if (implementations) {
      for (const implementation of implementations) {
        addEdge(implementation, methodName, EdgeKind.INTERFACE_IMPL);
        this.logger?.('[iface-impl]', String(typeFqn), '⇒', `${String(implementation)}::${methodName}`);
      }
    }
  }
}
