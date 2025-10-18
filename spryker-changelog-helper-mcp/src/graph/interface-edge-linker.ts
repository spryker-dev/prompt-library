import { FullyQualifiedName, MethodMetadata, CanonicalKey } from '../types/domain.types';
import { canonKey } from '../utils/canonical';

export class InterfaceEdgeLinker {
  static linkInterfaceEdges(
    methods: Map<CanonicalKey, MethodMetadata>,
    classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>,
    reverseAdjacencyMap: Map<CanonicalKey, Set<CanonicalKey>>
  ): void {
    const methodsByClass = new Map<FullyQualifiedName, Set<string>>();

    for (const [, md] of methods) {
      if (!methodsByClass.has(md.classFQN)) {
        methodsByClass.set(md.classFQN, new Set());
      }
      methodsByClass.get(md.classFQN)!.add(md.name);
    }

    for (const [classFqn, interfaces] of classImplements) {
      const classMethods = methodsByClass.get(classFqn);
      if (!classMethods) continue;

      for (const iface of interfaces) {
        for (const methodName of classMethods) {
          const classKey = canonKey(classFqn, methodName);
          const ifaceKey = canonKey(iface, methodName);

          if (!reverseAdjacencyMap.has(classKey)) {
            reverseAdjacencyMap.set(classKey, new Set());
          }
          reverseAdjacencyMap.get(classKey)!.add(ifaceKey);
        }
      }
    }
  }
}
