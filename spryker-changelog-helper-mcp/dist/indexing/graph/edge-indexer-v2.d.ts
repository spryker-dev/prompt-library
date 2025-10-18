import Graph from 'graphology';
import { Logger, FullyQualifiedName, MethodMetadata, CanonicalKey } from '../../types/domain.types';
import { PHPParser } from '../../parser/php-parser';
interface EdgeIndexResult {
    graph: Graph;
    reverseAdjacencyMap: Map<CanonicalKey, Set<CanonicalKey>>;
}
export declare class EdgeIndexer {
    private graphBuilder;
    private fileProcessor;
    private astWalker;
    private classProcessor;
    private typeResolver;
    private factoryCallResolver;
    private propertyTypesByClass;
    constructor(parser: PHPParser, methods: Map<CanonicalKey, MethodMetadata>, ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>, factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>, classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>, logger: Logger, _debug: boolean);
    private buildInterfaceMap;
    indexEdges(files: string[]): Promise<EdgeIndexResult>;
}
export {};
//# sourceMappingURL=edge-indexer-v2.d.ts.map