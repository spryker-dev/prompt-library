import { Call } from '../../types/ast.types';
import { FullyQualifiedName, CanonicalKey } from '../../types/domain.types';
import { ChainUnwrapper } from '../../utils/chain-unwrapper';
import { canonKey } from '../../utils/canonical';
import { FactoryResolver } from '../factory/factory-resolver';
import { SpecialMethods } from '../constants/ast-node-kinds';
import { FactoryPattern } from '../constants/factory-patterns';

export class FactoryCallResolver {
  constructor(
    private ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>,
    private factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>
  ) {}

  resolveFactoryCallReturnType(
    callExpression: Call,
    classFqn: FullyQualifiedName | null
  ): FullyQualifiedName | null {
    if (!classFqn) return null;

    const chain = ChainUnwrapper.unwrapChain(callExpression);
    const names = chain.names;
    
    if (!this.isFactoryMethodChain(names)) return null;

    const factoryMethodIndex = this.findFactoryMethodIndex(names);
    if (factoryMethodIndex === -1) return null;

    const factoryMethod = names[factoryMethodIndex];
    if (typeof factoryMethod !== 'string') return null;

    return this.lookupFactoryReturnType(classFqn, factoryMethod);
  }

  private isFactoryMethodChain(names: (string | null)[]): boolean {
    return names.includes(SpecialMethods.GET_FACTORY) || 
           names.includes(SpecialMethods.GET_BUSINESS_FACTORY);
  }

  private findFactoryMethodIndex(names: (string | null)[]): number {
    for (let i = names.length - 1; i >= 0; i--) {
      const name = names[i];
      
      if (name === SpecialMethods.GET_FACTORY || name === SpecialMethods.GET_BUSINESS_FACTORY) {
        break;
      }
      
      if (typeof name === 'string' && this.isFactoryMethod(name)) {
        return i;
      }
    }
    return -1;
  }

  private isFactoryMethod(methodName: string): boolean {
    return FactoryPattern.METHOD_PREFIXES.some(prefix => methodName.startsWith(prefix));
  }

  private lookupFactoryReturnType(
    classFqn: FullyQualifiedName,
    factoryMethodName: string
  ): FullyQualifiedName | null {
    const factoryFqn = FactoryResolver.factoryClassFor(classFqn, this.ownerToFactory);
    if (!factoryFqn) return null;

    const lookupKey = canonKey(factoryFqn, factoryMethodName);
    return this.factoryReturnByClassMethod.get(lookupKey) || null;
  }
}
