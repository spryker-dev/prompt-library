"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrypointFinder = void 0;
class EntrypointFinder {
    static findImpactedEntrypoints(targetKey, methods, reverseAdjacencyMap, entrypointRegex) {
        const impacted = new Map();
        const queue = [{ key: targetKey, distance: 0 }];
        const seen = new Set([targetKey]);
        while (queue.length > 0) {
            const current = queue.shift();
            const predecessors = reverseAdjacencyMap.get(current.key);
            if (!predecessors)
                continue;
            for (const pred of predecessors) {
                if (!seen.has(pred)) {
                    seen.add(pred);
                    impacted.set(pred, current.distance + 1);
                    queue.push({ key: pred, distance: current.distance + 1 });
                }
            }
        }
        const result = [];
        for (const [key, hops] of impacted) {
            const metadata = methods.get(key);
            if (!metadata)
                continue;
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
exports.EntrypointFinder = EntrypointFinder;
//# sourceMappingURL=entrypoint-finder.js.map