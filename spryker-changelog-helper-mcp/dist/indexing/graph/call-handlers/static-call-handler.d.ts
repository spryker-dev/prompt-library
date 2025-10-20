import { StaticCall } from '../../../types/ast.types';
import { FullyQualifiedName } from '../../../types/domain.types';
export declare class StaticCallHandler {
    processStaticCall(staticCall: StaticCall, classFqn: FullyQualifiedName, currentNamespace: string, currentUses: Record<string, string>, addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void): void;
    private resolveReceiver;
    private isSelfReference;
}
//# sourceMappingURL=static-call-handler.d.ts.map