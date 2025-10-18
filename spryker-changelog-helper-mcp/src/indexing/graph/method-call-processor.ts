import { Call, StaticCall } from '../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap, CanonicalKey, Logger } from '../../types/domain.types';
import { ChainUnwrapper } from '../../utils/chain-unwrapper';
import { StaticCallHandler } from './call-handlers/static-call-handler';
import { InstanceCallHandler } from './call-handlers/instance-call-handler';
import { FactoryCallHandler } from './call-handlers/factory-call-handler';

export class MethodCallProcessor {
  private staticCallHandler: StaticCallHandler;
  private instanceCallHandler: InstanceCallHandler;
  private factoryCallHandler: FactoryCallHandler;

  constructor(
    ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>,
    factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>,
    interfaceToImplementations: Map<FullyQualifiedName, Set<FullyQualifiedName>>,
    logger: Logger
  ) {
    this.staticCallHandler = new StaticCallHandler();
    this.instanceCallHandler = new InstanceCallHandler(interfaceToImplementations, logger);
    this.factoryCallHandler = new FactoryCallHandler(ownerToFactory, factoryReturnByClassMethod);
  }

  processStaticCall(
    staticCall: StaticCall,
    classFqn: FullyQualifiedName,
    currentNamespace: string,
    currentUses: Record<string, string>,
    addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void
  ): void {
    this.staticCallHandler.processStaticCall(staticCall, classFqn, currentNamespace, currentUses, addEdge);
  }

  processInstanceCall(
    call: Call,
    classFqn: FullyQualifiedName,
    methodName: string,
    propertyTypes: PropertyTypeMap,
    localTypes: Record<string, FullyQualifiedName>,
    paramTypes: Record<string, FullyQualifiedName>,
    addEdge: (calleeFqn: FullyQualifiedName | null, calleeName: string, kind: string) => void
  ): void {
    const chain = ChainUnwrapper.unwrapChain(call);
    const targetMethodName = chain.tail;

    if (!targetMethodName) return;

    this.instanceCallHandler.processDirectCall(chain, classFqn, targetMethodName, addEdge);
    this.instanceCallHandler.processPropertyCall(chain, classFqn, methodName, propertyTypes, targetMethodName, addEdge);
    this.instanceCallHandler.processVariableCall(chain, localTypes, paramTypes, targetMethodName, addEdge);
    this.factoryCallHandler.processFactoryCall(chain, classFqn, targetMethodName, addEdge);
  }
}
