import { Call, StaticCall } from '../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap, CanonicalKey, Logger } from '../../types/domain.types';
export declare class MethodCallProcessor {
    private staticCallHandler;
    private instanceCallHandler;
    private factoryCallHandler;
    constructor(ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>, factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>, interfaceToImplementations: Map<FullyQualifiedName, Set<FullyQualifiedName>>, logger: Logger);
    processStaticCall(staticCall: StaticCall, classFqn: FullyQualifiedName, currentNamespace: string, currentUses: Record<string, string>, addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void): void;
    processInstanceCall(call: Call, classFqn: FullyQualifiedName, methodName: string, propertyTypes: PropertyTypeMap, localTypes: Record<string, FullyQualifiedName>, paramTypes: Record<string, FullyQualifiedName>, addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void): void;
}
//# sourceMappingURL=method-call-processor.d.ts.map