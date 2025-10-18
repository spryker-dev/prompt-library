import * as fs from 'fs';
import { ASTNode, UseGroup } from '../../../types/ast.types';
import { SymbolIndex, Logger, FullyQualifiedName, MethodMetadata, CanonicalKey, ClassMetadata } from '../../../types/domain.types';
import { PHPParser } from '../../../parser/php-parser';
import { NameResolver } from '../../../utils/name-resolver';
import { ClassIndexer } from './class-indexer';
import { InterfaceIndexer } from './interface-indexer';
import { InheritDocResolver } from '../resolvers/inherit-doc-resolver';
import { AstNodeKind, ClassKind } from '../../constants/ast-node-kinds';

export class CodeElementIndexer {
  private classIndexer: ClassIndexer;
  private interfaceIndexer: InterfaceIndexer;
  private inheritDocResolver: InheritDocResolver;

  constructor(
    private parser: PHPParser,
    logger: Logger
  ) {
    this.classIndexer = new ClassIndexer(logger);
    this.interfaceIndexer = new InterfaceIndexer(logger);
    this.inheritDocResolver = new InheritDocResolver();
  }

  async indexSymbols(files: string[]): Promise<SymbolIndex> {
    const classes = new Map<FullyQualifiedName, ClassMetadata>();
    const methods = new Map<CanonicalKey, MethodMetadata>();
    const ownerToFactory = new Map<FullyQualifiedName, FullyQualifiedName>();
    const classImplements = new Map<FullyQualifiedName, Set<FullyQualifiedName>>();

    for (const filePath of files) {
      await this.indexFile(filePath, classes, methods, ownerToFactory, classImplements);
    }
    
    this.inheritDocResolver.resolve(methods, classImplements);

    return { classes, methods, ownerToFactory, classImplements };
  }

  private async indexFile(
    filePath: string,
    classes: Map<FullyQualifiedName, ClassMetadata>,
    methods: Map<CanonicalKey, MethodMetadata>,
    ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>,
    classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>
  ): Promise<void> {
    const code = fs.readFileSync(filePath, 'utf8');
    const ast = await this.parseCode(code, filePath);
    
    if (!ast) return;

    this.processAst(ast, filePath, classes, methods, ownerToFactory, classImplements);
  }

  private async parseCode(code: string, filePath: string): Promise<ASTNode | null> {
    try {
      return this.parser.parseCode(code, filePath);
    } catch {
      return null;
    }
  }

  private processAst(
    ast: ASTNode,
    filePath: string,
    classes: Map<FullyQualifiedName, ClassMetadata>,
    methods: Map<CanonicalKey, MethodMetadata>,
    ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>,
    classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>
  ): void {
    let currentNamespace = '';
    let currentUses: Record<string, string> = {};

    this.parser.walk(ast, (node) => {
      if (node.kind === AstNodeKind.NAMESPACE) {
        currentNamespace = NameResolver.nsNameToString((node as any).name);
        currentUses = {};
      }

      if (node.kind === AstNodeKind.USE_ITEM) {
        NameResolver.addUseItemToMap(node as any, currentNamespace, currentUses);
      }

      if (node.kind === AstNodeKind.USE_GROUP) {
        this.processUseGroup(node as UseGroup, currentNamespace, currentUses);
      }

      if (node.kind === AstNodeKind.INTERFACE) {
        const fqn = this.interfaceIndexer.indexInterface(
          node as any,
          filePath,
          currentNamespace,
          methods
        );
        if (fqn) {
          classes.set(fqn, { file: filePath, kind: ClassKind.INTERFACE });
        }
        return;
      }

      if (node.kind === AstNodeKind.CLASS) {
        this.classIndexer.indexClass(
          node as any,
          filePath,
          currentNamespace,
          currentUses,
          classes,
          methods,
          ownerToFactory,
          classImplements
        );
      }
    });
  }

  private processUseGroup(
    useGroup: UseGroup,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): void {
    const baseName = NameResolver.nsNameToString(useGroup.name);
    const base = baseName.startsWith('\\') ? baseName : '\\' + baseName;
    
    for (const item of useGroup.items || []) {
      NameResolver.addUseItemToMap(item, currentNamespace, currentUses, base);
    }
  }
}
