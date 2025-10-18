import { Call } from '../../types/ast.types';
import { FullyQualifiedName, CanonicalKey } from '../../types/domain.types';
export declare class FactoryCallResolver {
    private ownerToFactory;
    private factoryReturnByClassMethod;
    constructor(ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>, factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>);
    resolveFactoryCallReturnType(callExpression: Call, classFqn: FullyQualifiedName | null): FullyQualifiedName | null;
    private isFactoryMethodChain;
    private findFactoryMethodIndex;
    private isFactoryMethod;
    private lookupFactoryReturnType;
}
//# sourceMappingURL=factory-call-resolver.d.ts.map