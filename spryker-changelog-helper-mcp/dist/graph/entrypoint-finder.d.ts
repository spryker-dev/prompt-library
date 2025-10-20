import { CanonicalKey, MethodMetadata, ImpactedMethod } from '../types/domain.types';
export declare class EntrypointFinder {
    static findImpactedEntrypoints(targetKey: CanonicalKey, methods: Map<CanonicalKey, MethodMetadata>, reverseAdjacencyMap: Map<CanonicalKey, Set<CanonicalKey>>, entrypointRegex: RegExp): ImpactedMethod[];
}
//# sourceMappingURL=entrypoint-finder.d.ts.map