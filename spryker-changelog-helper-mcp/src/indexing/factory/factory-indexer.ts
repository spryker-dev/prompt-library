import * as fs from 'fs';
import { ASTNode, Class, Method } from '../../types/ast.types';
import { FactoryIndex, Logger, FullyQualifiedName, CanonicalKey } from '../../types/domain.types';
import { PHPParser } from '../../parser/php-parser';
import { NameResolver } from '../../utils/name-resolver';
import { ensureFqn, canonKey } from '../../utils/canonical';
import { FactoryMethodDetector } from './factory-method-detector';
import { ReturnTypeExtractor } from './return-type-extractor';
import { MethodAnnotationParser } from './method-annotation-parser';
import { AstNodeKind } from '../constants/ast-node-kinds';

export class FactoryIndexer {
  private returnTypeExtractor: ReturnTypeExtractor;
  private annotationParser: MethodAnnotationParser;

  constructor(
    private parser: PHPParser,
    private logger: Logger
  ) {
    this.returnTypeExtractor = new ReturnTypeExtractor(parser);
    this.annotationParser = new MethodAnnotationParser(this.returnTypeExtractor, logger);
  }

  async indexFactoryReturnTypes(files: string[]): Promise<FactoryIndex> {
    const factoryReturnByClassMethod = new Map<CanonicalKey, FullyQualifiedName>();

    for (const filePath of files) {
      await this.processFile(filePath, factoryReturnByClassMethod);
    }

    return { factoryReturnByClassMethod };
  }

  private async processFile(
    filePath: string,
    factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>
  ): Promise<void> {
    const ast = await this.parseFile(filePath);
    if (!ast) return;

    let currentNamespace = '';
    let currentUses: Record<string, string> = {};

    this.parser.walk(ast, (node) => {
      this.updateNamespaceContext(node, currentNamespace, currentUses, (ns, uses) => {
        currentNamespace = ns;
        currentUses = uses;
      });

      if (node.kind === AstNodeKind.CLASS) {
        this.processClass(node as Class, currentNamespace, currentUses, factoryReturnByClassMethod);
      }
    });
  }

  private async parseFile(filePath: string): Promise<ASTNode | null> {
    const code = fs.readFileSync(filePath, 'utf8');

    try {
      return this.parser.parseCode(code, filePath);
    } catch {
      return null;
    }
  }

  private updateNamespaceContext(
    node: ASTNode,
    currentNamespace: string,
    currentUses: Record<string, string>,
    updateCallback: (ns: string, uses: Record<string, string>) => void
  ): void {
    if (node.kind === AstNodeKind.NAMESPACE) {
      const newNamespace = NameResolver.nsNameToString((node as any).name);
      updateCallback(newNamespace, {});
      return;
    }

    if (node.kind === AstNodeKind.USE_ITEM) {
      NameResolver.addUseItemToMap(node as any, currentNamespace, currentUses);
      return;
    }

    if (node.kind === AstNodeKind.USE_GROUP) {
      const baseName = NameResolver.nsNameToString((node as any).name);
      const base = baseName.startsWith('\\') ? baseName : '\\' + baseName;
      for (const item of ((node as any).items || [])) {
        NameResolver.addUseItemToMap(item, currentNamespace, currentUses, base);
      }
    }
  }

  private processClass(
    classNode: Class,
    currentNamespace: string,
    currentUses: Record<string, string>,
    factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>
  ): void {
    const className = classNode.name ? String(classNode.name.name) : null;
    if (!className) return;

    const classFqn = ensureFqn(currentNamespace ? `${currentNamespace}\\${className}` : className);

    this.annotationParser.extractAnnotations(
      classNode,
      classFqn,
      currentNamespace,
      currentUses,
      factoryReturnByClassMethod
    );

    if (!FactoryMethodDetector.isFactoryClass(classFqn)) return;
    if (!Array.isArray(classNode.body)) return;

    for (const statement of classNode.body) {
      if (statement.kind === AstNodeKind.METHOD) {
        this.processFactoryMethod(
          statement as Method,
          classFqn,
          currentNamespace,
          currentUses,
          factoryReturnByClassMethod
        );
      }
    }
  }

  private processFactoryMethod(
    method: Method,
    classFqn: FullyQualifiedName,
    currentNamespace: string,
    currentUses: Record<string, string>,
    factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>
  ): void {
    const methodName = method.name ? String(method.name.name) : '';
    if (!FactoryMethodDetector.isFactoryMethod(methodName)) return;

    const returnType = this.returnTypeExtractor.extractReturnType(method, currentNamespace, currentUses);
    if (returnType) {
      this.registerReturnType(classFqn, methodName, returnType, factoryReturnByClassMethod);
    }
  }

  private registerReturnType(
    classFqn: FullyQualifiedName,
    methodName: string,
    returnType: FullyQualifiedName,
    factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>
  ): void {
    const key = canonKey(classFqn, methodName);
    const normalizedReturnType = ensureFqn(returnType);

    factoryReturnByClassMethod.set(key, normalizedReturnType);
    this.logger?.('[factory-return]', key, '=>', normalizedReturnType);
  }
}
