import { Method } from '../../types/ast.types';
import { MethodMetadata, CanonicalKey, FullyQualifiedName, Logger } from '../../types/domain.types';
export declare class MethodIndexer {
    private logger;
    constructor(logger: Logger);
    indexMethod(method: Method, classFqn: FullyQualifiedName, filePath: string, methods: Map<CanonicalKey, MethodMetadata>, isInterface?: boolean): void;
    private extractMethodName;
    private createMethodMetadata;
    private logMethod;
}
//# sourceMappingURL=method-indexer.d.ts.map