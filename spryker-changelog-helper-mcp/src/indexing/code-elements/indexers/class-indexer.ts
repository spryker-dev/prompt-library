import { Class, Method } from '../../../types/ast.types';
import { MethodMetadata, CanonicalKey, FullyQualifiedName, Logger, ClassMetadata } from '../../../types/domain.types';
import { ensureFqn } from '../../../utils/canonical';
import { NameResolver } from '../../../utils/name-resolver';
import { MethodIndexer } from './method-indexer';
import { PhpDocParser } from '../parsers/php-doc-parser';
import { PhpDocPattern } from '../../constants/php-doc-patterns';
import { AstNodeKind, ClassKind } from '../../constants/ast-node-kinds';

export class ClassIndexer {
  private methodIndexer: MethodIndexer;

  constructor(private logger: Logger) {
    this.methodIndexer = new MethodIndexer(logger);
  }

  indexClass(
    classNode: Class,
    filePath: string,
    currentNamespace: string,
    currentUses: Record<string, string>,
    classes: Map<FullyQualifiedName, ClassMetadata>,
    methods: Map<CanonicalKey, MethodMetadata>,
    ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>,
    classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>
  ): void {
    const className = this.extractClassName(classNode);
    if (!className) return;

    const fqn = this.buildFullyQualifiedName(currentNamespace, className);
    
    classes.set(fqn, { file: filePath, kind: ClassKind.CLASS });
    this.logClass(fqn, filePath);

    this.indexImplementedInterfaces(classNode, fqn, currentNamespace, currentUses, classImplements);
    this.indexFactoryAnnotation(classNode, fqn, ownerToFactory);
    this.indexClassMethods(classNode, fqn, filePath, methods);
  }

  private extractClassName(classNode: Class): string | null {
    return classNode.name ? String(classNode.name.name) : null;
  }

  private buildFullyQualifiedName(namespace: string, name: string): FullyQualifiedName {
    return ensureFqn(namespace ? `${namespace}\\${name}` : name);
  }

  private indexImplementedInterfaces(
    classNode: Class,
    classFqn: FullyQualifiedName,
    currentNamespace: string,
    currentUses: Record<string, string>,
    classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>
  ): void {
    if (!Array.isArray(classNode.implements) || !classNode.implements.length) return;

    for (const interfaceName of classNode.implements) {
      const interfaceFqn = NameResolver.resolveName(interfaceName, currentNamespace, currentUses);
      if (!interfaceFqn) continue;

      if (!classImplements.has(classFqn)) {
        classImplements.set(classFqn, new Set());
      }
      
      classImplements.get(classFqn)!.add(interfaceFqn);
      this.logger?.('[implements]', classFqn, '->', interfaceFqn);
    }
  }

  private indexFactoryAnnotation(
    classNode: Class,
    classFqn: FullyQualifiedName,
    ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>
  ): void {
    const docText = PhpDocParser.collectCommentText(classNode);
    const factoryFqn = this.extractFactoryFromDoc(docText);
    
    if (factoryFqn) {
      ownerToFactory.set(classFqn, factoryFqn);
      this.logger?.('[factory-doc]', classFqn, '->', factoryFqn);
    }
  }

  private extractFactoryFromDoc(docText: string): FullyQualifiedName | null {
    if (!docText) return null;
    
    const match = docText.match(PhpDocPattern.FACTORY_METHOD);
    return match ? '\\' + match[1].replace(/^\\+/, '') : null;
  }

  private indexClassMethods(
    classNode: Class,
    classFqn: FullyQualifiedName,
    filePath: string,
    methods: Map<CanonicalKey, MethodMetadata>
  ): void {
    if (!Array.isArray(classNode.body)) return;

    for (const statement of classNode.body) {
      if (statement.kind !== AstNodeKind.METHOD) continue;
      
      this.methodIndexer.indexMethod(
        statement as Method,
        classFqn,
        filePath,
        methods,
        false
      );
    }
  }

  private logClass(fqn: FullyQualifiedName, filePath: string): void {
    this.logger?.('[class]', fqn, '@', filePath);
  }
}
