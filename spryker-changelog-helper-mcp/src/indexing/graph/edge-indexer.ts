import Graph from 'graphology';
import { Logger, FullyQualifiedName, MethodMetadata, PropertyTypeMap, CanonicalKey } from '../../types/domain.types';
import { PHPParser } from '../../parser/php-parser';
import { GraphBuilder } from './graph-builder';
import { ParameterProcessor } from './parameter-processor';
import { PropertyTypeTracker } from './property-type-tracker';
import { TypeResolver } from './type-resolver';
import { FactoryCallResolver } from './factory-call-resolver';
import { MethodCallProcessor } from './method-call-processor';
import { FileProcessor } from './file-processor';
import { AstWalker } from './ast-walker';
import { ClassProcessor } from './class-processor';
import { AstNodeKind } from '../constants/ast-node-kinds';
import { ensureFqn } from '../../utils/canonical';

interface EdgeIndexResult {
  graph: Graph;
  reverseAdjacencyMap: Map<CanonicalKey, Set<CanonicalKey>>;
}

export class EdgeIndexer {
  private graphBuilder: GraphBuilder;
  private fileProcessor: FileProcessor;
  private astWalker: AstWalker;
  private classProcessor: ClassProcessor;
  private typeResolver: TypeResolver;
  private factoryCallResolver: FactoryCallResolver;
  private propertyTypesByClass: Map<FullyQualifiedName, PropertyTypeMap>;

  constructor(
    parser: PHPParser,
    methods: Map<CanonicalKey, MethodMetadata>,
    ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>,
    factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>,
    classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>,
    logger: Logger,
    _debug: boolean
  ) {
    this.graphBuilder = new GraphBuilder(methods);
    this.fileProcessor = new FileProcessor(parser);
    this.astWalker = new AstWalker(parser);
    this.typeResolver = new TypeResolver();
    this.factoryCallResolver = new FactoryCallResolver(ownerToFactory, factoryReturnByClassMethod);
    
    const parameterProcessor = new ParameterProcessor(logger);
    const propertyTypeTracker = new PropertyTypeTracker(logger);
    const methodCallProcessor = new MethodCallProcessor(
      ownerToFactory,
      factoryReturnByClassMethod,
      this.buildInterfaceMap(classImplements),
      logger
    );

    this.propertyTypesByClass = new Map();
    this.classProcessor = new ClassProcessor(
      parser,
      this.graphBuilder,
      parameterProcessor,
      propertyTypeTracker,
      methodCallProcessor,
      this.propertyTypesByClass
    );
  }

  private buildInterfaceMap(
    classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>
  ): Map<FullyQualifiedName, Set<FullyQualifiedName>> {
    const map = new Map<FullyQualifiedName, Set<FullyQualifiedName>>();
    
    for (const [classFqn, interfaces] of classImplements) {
      for (const interfaceFqn of interfaces) {
        const key = ensureFqn(interfaceFqn);
        if (!map.has(key)) {
          map.set(key, new Set());
        }
        map.get(key)!.add(ensureFqn(classFqn));
      }
    }
    
    return map;
  }

  async indexEdges(files: string[]): Promise<EdgeIndexResult> {
    await this.fileProcessor.processFiles(files, (ast) => {
      this.astWalker.walkAst(ast, (classNode, namespace, uses) => {
        const className = classNode.name ? String(classNode.name.name) : null;
        if (!className) return;
        
        const classFqn = ensureFqn(namespace ? `${namespace}\\${className}` : className);
        
        this.classProcessor.processClass(classNode, namespace, uses, (expr) => {
          const basicType = this.typeResolver.resolveExpressionType(
            expr,
            {},
            {},
            namespace,
            uses
          );
          
          if (basicType) return basicType;
          
          if (expr?.kind === AstNodeKind.CALL) {
            return this.factoryCallResolver.resolveFactoryCallReturnType(expr, classFqn);
          }
          
          return null;
        });
      });
    });

    return {
      graph: this.graphBuilder.getGraph(),
      reverseAdjacencyMap: this.graphBuilder.getReverseAdjacencyMap(),
    };
  }
}
