import Graph from 'graphology';
import { Logger, FullyQualifiedName, MethodMetadata, CanonicalKey } from '../types/domain.types';
import { PHPParser } from '../parser/php-parser';
interface EdgeIndexResult {
    graph: Graph;
    reverseAdjacencyMap: Map<CanonicalKey, Set<CanonicalKey>>;
}
export declare class EdgeIndexer {
    private parser;
    private methods;
    private ownerToFactory;
    private factoryReturnByClassMethod;
    private classImplements;
    private logger;
    private graph;
    private reverseAdjacencyMap;
    private propTypesByClass;
    private interfaceToImplementations;
    constructor(parser: PHPParser, methods: Map<CanonicalKey, MethodMetadata>, ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>, factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>, classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>, logger: Logger, _debug: boolean);
    private buildInterfaceToImplementationsMap;
    indexEdges(files: string[]): Promise<EdgeIndexResult>;
    private processFile;
    private processMethodParameters;
    private extractParameters;
    private extractParameterName;
    private resolveParameterType;
    private isPromotedProperty;
    private ensureMethodNodeExists;
    private resolveFactoryCallType;
    private processClass;
    private processPropertyDeclaration;
    private extractPropertyType;
    private extractDeclaredType;
    private registerPropertyTypes;
    private extractPropertyName;
    private processMethodBody;
    private handleAssignment;
    private trackLocalVariableType;
    private trackPropertyType;
    private processStaticCall;
    private resolveStaticCallReceiver;
    private processCall;
    private logCallChain;
    private handleDirectMethodCall;
    private handlePropertyMethodCall;
    private handleVariableMethodCall;
    private handleFactoryMethodCall;
    private findFactoryMethodIndex;
    private resolveFactoryReturnType;
    private addInterfaceImplementationEdges;
}
export {};
//# sourceMappingURL=edge-indexer.d.ts.map