import { FullyQualifiedName, CanonicalKey } from '../../../types/domain.types';
import { canonKey } from '../../../utils/canonical';
import { FactoryResolver } from '../../factory/factory-resolver';
import { FactoryPattern } from '../../constants/factory-patterns';
import { EdgeKind } from '../../constants/edge-kinds';

export class FactoryCallHandler {
  constructor(
    private ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>,
    private factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>
  ) {}

  processFactoryCall(
    chain: { names: (string | null)[] },
    classFqn: FullyQualifiedName,
    methodName: string,
    addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void
  ): void {
    const factoryMethodIndex = this.findFactoryMethodIndex(chain.names, classFqn);

    if (factoryMethodIndex !== -1) {
      const factoryMethodName = chain.names[factoryMethodIndex];
      const returnType = this.resolveReturnType(classFqn, factoryMethodName as string);

      if (returnType) {
        addEdge(returnType, methodName, EdgeKind.FACTORY_RETURN);
      }
    }
  }

  private findFactoryMethodIndex(names: (string | null)[], classFqn: FullyQualifiedName): number {
    for (let i = names.length - 2; i >= 0; i--) {
      const name = names[i];
      if (typeof name !== 'string') continue;
      
      if (this.isFactoryMethod(name) && this.hasReturnType(classFqn, name)) {
        return i;
      }
    }
    return -1;
  }

  private isFactoryMethod(methodName: string): boolean {
    return FactoryPattern.METHOD_PREFIXES.some(prefix => methodName.startsWith(prefix));
  }

  private hasReturnType(classFqn: FullyQualifiedName, methodName: string): boolean {
    const lookupKey = canonKey(classFqn, methodName);
    if (this.factoryReturnByClassMethod.has(lookupKey)) return true;

    const factoryClass = FactoryResolver.factoryClassFor(classFqn, this.ownerToFactory);
    if (factoryClass) {
      const factoryLookupKey = canonKey(factoryClass, methodName);
      return this.factoryReturnByClassMethod.has(factoryLookupKey);
    }

    return false;
  }

  private resolveReturnType(classFqn: FullyQualifiedName, factoryMethodName: string): FullyQualifiedName | null {
    const factoryClass = FactoryResolver.factoryClassFor(classFqn, this.ownerToFactory);
    if (!factoryClass) return null;

    const lookupKey = canonKey(factoryClass, factoryMethodName);
    return this.factoryReturnByClassMethod.get(lookupKey) || null;
  }
}
