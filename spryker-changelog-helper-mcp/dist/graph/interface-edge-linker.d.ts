import { FullyQualifiedName, MethodMetadata, CanonicalKey } from '../types/domain.types';
export declare class InterfaceEdgeLinker {
    static linkInterfaceEdges(methods: Map<CanonicalKey, MethodMetadata>, classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>, reverseAdjacencyMap: Map<CanonicalKey, Set<CanonicalKey>>): void;
}
//# sourceMappingURL=interface-edge-linker.d.ts.map