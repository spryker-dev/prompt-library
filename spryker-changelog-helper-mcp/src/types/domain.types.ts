export type FullyQualifiedName = string;
export type MethodName = string;
export type CanonicalKey = string;
export type Visibility = 'public' | 'protected' | 'private' | 'unknown';

export interface MethodMetadata {
  classFQN: FullyQualifiedName;
  name: MethodName;
  visibility: Visibility;
  file: string;
  start: number | null;
  end: number | null;
  isInterface?: boolean;
  description?: string;
  isApiMethod?: boolean;
  isDeprecated?: boolean;
}

export interface ClassMetadata {
  file: string;
  kind: 'class' | 'interface';
}

export interface GraphNode {
  classFQN: FullyQualifiedName;
  method: MethodName;
  visibility: Visibility;
}

export interface GraphEdge {
  kind: 'static' | 'intra' | 'this-prop' | 'method' | 'factory-return' | 'iface-impl';
}

export interface ImpactedMethod {
  key: CanonicalKey;
  class: FullyQualifiedName;
  method: MethodName;
  hops: number;
  description?: string;
  isApiMethod?: boolean;
  isDeprecated?: boolean;
}

export interface AnalysisResult {
  entrypointRegex: string;
  targets: CanonicalKey[];
  counts: {
    classes: number;
    methods: number;
    nodes: number;
    edges: number;
  };
  impacted: Record<CanonicalKey, ImpactedMethod[]>;
  symbolIndex?: SymbolIndex;
}

export interface SymbolIndex {
  classes: Map<FullyQualifiedName, ClassMetadata>;
  methods: Map<CanonicalKey, MethodMetadata>;
  ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>;
  classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>;
}

export interface FactoryIndex {
  factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>;
}

export interface PropertyTypeMap {
  [propertyName: string]: FullyQualifiedName;
}

export interface UseMap {
  [alias: string]: FullyQualifiedName;
}

export type Logger = ((...args: any[]) => void) | null;
