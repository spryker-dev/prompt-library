import { StaticCall } from '../../../types/ast.types';
import { FullyQualifiedName } from '../../../types/domain.types';
import { NameResolver } from '../../../utils/name-resolver';
import { AstNodeKind, SelfReferences } from '../../constants/ast-node-kinds';
import { EdgeKind } from '../../constants/edge-kinds';

export class StaticCallHandler {
  processStaticCall(
    staticCall: StaticCall,
    classFqn: FullyQualifiedName,
    currentNamespace: string,
    currentUses: Record<string, string>,
    addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void
  ): void {
    const receiverClass = this.resolveReceiver(staticCall, classFqn, currentNamespace, currentUses);
    const methodName = NameResolver.getIdentifierName(staticCall.what);

    if (methodName) {
      addEdge(receiverClass, methodName, EdgeKind.STATIC);
    }
  }

  private resolveReceiver(
    staticCall: StaticCall,
    classFqn: FullyQualifiedName,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    if (staticCall.class?.kind === AstNodeKind.NAME) {
      const className = String(staticCall.class.name).toLowerCase();
      
      if (this.isSelfReference(className)) {
        return classFqn;
      }
    }

    return NameResolver.resolveName(staticCall.class, currentNamespace, currentUses);
  }

  private isSelfReference(className: string): boolean {
    return className === SelfReferences.SELF || 
           className === SelfReferences.STATIC || 
           className === SelfReferences.PARENT;
  }
}
