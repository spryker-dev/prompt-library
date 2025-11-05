import { ASTNode } from '../../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap, Logger } from '../../../types/domain.types';
export declare class InstanceCallHandler {
    private interfaceToImplementations;
    private logger;
    constructor(interfaceToImplementations: Map<FullyQualifiedName, Set<FullyQualifiedName>>, logger: Logger);
    processDirectCall(chain: {
        names: (string | null)[];
        base: ASTNode | null;
    }, classFqn: FullyQualifiedName, methodName: string, addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void): void;
    processPropertyCall(chain: {
        names: (string | null)[];
        base: ASTNode | null;
    }, classFqn: FullyQualifiedName, currentMethodName: string, propertyTypes: PropertyTypeMap, targetMethodName: string, addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void): void;
    processVariableCall(chain: {
        base: ASTNode | null;
    }, localTypes: Record<string, FullyQualifiedName>, paramTypes: Record<string, FullyQualifiedName>, methodName: string, addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void): void;
    private isThisCall;
    private isSingleMethodCall;
    private hasPropertyAccess;
    private extractVariableName;
    private addInterfaceEdges;
}
//# sourceMappingURL=instance-call-handler.d.ts.map