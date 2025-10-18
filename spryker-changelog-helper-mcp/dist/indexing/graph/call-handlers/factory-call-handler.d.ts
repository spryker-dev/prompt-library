import { FullyQualifiedName, CanonicalKey } from '../../../types/domain.types';
export declare class FactoryCallHandler {
    private ownerToFactory;
    private factoryReturnByClassMethod;
    constructor(ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>, factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>);
    processFactoryCall(chain: {
        names: (string | null)[];
    }, classFqn: FullyQualifiedName, methodName: string, addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void): void;
    private findFactoryMethodIndex;
    private isFactoryMethod;
    private hasReturnType;
    private resolveReturnType;
}
//# sourceMappingURL=factory-call-handler.d.ts.map