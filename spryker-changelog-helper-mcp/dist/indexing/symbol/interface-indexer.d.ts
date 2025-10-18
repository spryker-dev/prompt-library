import { Interface } from '../../types/ast.types';
import { MethodMetadata, CanonicalKey, FullyQualifiedName, Logger } from '../../types/domain.types';
export declare class InterfaceIndexer {
    private logger;
    private methodIndexer;
    constructor(logger: Logger);
    indexInterface(interfaceNode: Interface, filePath: string, currentNamespace: string, methods: Map<CanonicalKey, MethodMetadata>): FullyQualifiedName | null;
    private extractInterfaceName;
    private buildFullyQualifiedName;
    private indexInterfaceMethods;
    private logInterface;
}
//# sourceMappingURL=interface-indexer.d.ts.map