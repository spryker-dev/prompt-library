import Graph from 'graphology';
import { CanonicalKey, FullyQualifiedName, MethodMetadata } from '../../types/domain.types';
import { ensureFqn } from '../../utils/canonical';

export class GraphBuilder {
  private graph: Graph;
  private reverseAdjacencyMap: Map<CanonicalKey, Set<CanonicalKey>>;

  constructor(private methods: Map<CanonicalKey, MethodMetadata>) {
    this.graph = new Graph();
    this.reverseAdjacencyMap = new Map();
  }

  ensureMethodNode(
    key: CanonicalKey,
    classFqn: FullyQualifiedName,
    methodName: string
  ): void {
    if (!this.graph.hasNode(key)) {
      const metadata = this.methods.get(key);
      this.graph.addNode(
        key,
        metadata
          ? { classFQN: metadata.classFQN, method: metadata.name, visibility: metadata.visibility }
          : { classFQN: ensureFqn(classFqn), method: methodName, visibility: 'unknown' }
      );
    }
  }

  addEdge(
    callerKey: CanonicalKey,
    calleeKey: CanonicalKey,
    kind: string
  ): void {
    if (!this.graph.hasEdge(callerKey, calleeKey)) {
      this.graph.addEdge(callerKey, calleeKey, { kind });
    }

    if (!this.reverseAdjacencyMap.has(calleeKey)) {
      this.reverseAdjacencyMap.set(calleeKey, new Set());
    }
    this.reverseAdjacencyMap.get(calleeKey)!.add(callerKey);
  }

  getGraph(): Graph {
    return this.graph;
  }

  getReverseAdjacencyMap(): Map<CanonicalKey, Set<CanonicalKey>> {
    return this.reverseAdjacencyMap;
  }
}
