import { CanonicalKey, MethodMetadata, ImpactedMethod } from '../types/domain.types';

export class EntrypointFinder {
  static findImpactedEntrypoints(
    targetKey: CanonicalKey,
    methods: Map<CanonicalKey, MethodMetadata>,
    reverseAdjacencyMap: Map<CanonicalKey, Set<CanonicalKey>>,
    entrypointRegex: RegExp
  ): ImpactedMethod[] {
    const impacted = new Map<CanonicalKey, number>();
    const queue: Array<{ key: CanonicalKey; distance: number }> = [{ key: targetKey, distance: 0 }];
    const seen = new Set<CanonicalKey>([targetKey]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const predecessors = reverseAdjacencyMap.get(current.key);

      if (!predecessors) continue;

      for (const pred of predecessors) {
        if (!seen.has(pred)) {
          seen.add(pred);
          impacted.set(pred, current.distance + 1);
          queue.push({ key: pred, distance: current.distance + 1 });
        }
      }
    }

    const result: ImpactedMethod[] = [];

    for (const [key, hops] of impacted) {
      const metadata = methods.get(key);
      if (!metadata) continue;

      const isPublic = (metadata.visibility || 'public') === 'public';
      if (entrypointRegex.test(metadata.classFQN) && isPublic) {
        result.push({
          key,
          class: metadata.classFQN,
          method: metadata.name,
          hops,
          description: metadata.description,
          isApiMethod: metadata.isApiMethod,
          isDeprecated: metadata.isDeprecated,
        });
      }
    }

    result.sort((a, b) => a.hops - b.hops || a.key.localeCompare(b.key));
    return result;
  }
}
