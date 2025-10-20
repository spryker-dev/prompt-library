import Graph from 'graphology';
import { CanonicalKey, FullyQualifiedName, MethodMetadata } from '../../types/domain.types';
export declare class GraphBuilder {
    private methods;
    private graph;
    private reverseAdjacencyMap;
    constructor(methods: Map<CanonicalKey, MethodMetadata>);
    ensureMethodNode(key: CanonicalKey, classFqn: FullyQualifiedName, methodName: string): void;
    addEdge(callerKey: CanonicalKey, calleeKey: CanonicalKey, kind: string): void;
    getGraph(): Graph;
    getReverseAdjacencyMap(): Map<CanonicalKey, Set<CanonicalKey>>;
}
//# sourceMappingURL=graph-builder.d.ts.map