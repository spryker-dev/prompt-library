import { Interface, Method } from '../../../types/ast.types';
import { MethodMetadata, CanonicalKey, FullyQualifiedName, Logger } from '../../../types/domain.types';
import { ensureFqn } from '../../../utils/canonical';
import { MethodIndexer } from './method-indexer';
import { AstNodeKind } from '../../constants/ast-node-kinds';

export class InterfaceIndexer {
  private methodIndexer: MethodIndexer;

  constructor(private logger: Logger) {
    this.methodIndexer = new MethodIndexer(logger);
  }

  indexInterface(
    interfaceNode: Interface,
    filePath: string,
    currentNamespace: string,
    methods: Map<CanonicalKey, MethodMetadata>
  ): FullyQualifiedName | null {
    const interfaceName = this.extractInterfaceName(interfaceNode);
    if (!interfaceName) return null;

    const fqn = this.buildFullyQualifiedName(currentNamespace, interfaceName);
    this.indexInterfaceMethods(interfaceNode, fqn, filePath, methods);
    this.logInterface(fqn, filePath);

    return fqn;
  }

  private extractInterfaceName(interfaceNode: Interface): string | null {
    return interfaceNode.name ? String(interfaceNode.name.name) : null;
  }

  private buildFullyQualifiedName(namespace: string, name: string): FullyQualifiedName {
    return ensureFqn(namespace ? `${namespace}\\${name}` : name);
  }

  private indexInterfaceMethods(
    interfaceNode: Interface,
    fqn: FullyQualifiedName,
    filePath: string,
    methods: Map<CanonicalKey, MethodMetadata>
  ): void {
    if (!Array.isArray(interfaceNode.body)) return;

    for (const statement of interfaceNode.body) {
      if (statement.kind !== AstNodeKind.METHOD) continue;
      
      this.methodIndexer.indexMethod(
        statement as Method,
        fqn,
        filePath,
        methods,
        true
      );
    }
  }

  private logInterface(fqn: FullyQualifiedName, filePath: string): void {
    this.logger?.('[interface]', fqn, '@', filePath);
  }
}
