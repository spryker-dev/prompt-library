import { ASTNode, Class } from '../../types/ast.types';
import { PHPParser } from '../../parser/php-parser';
import { NameResolver } from '../../utils/name-resolver';
import { AstNodeKind } from '../constants/ast-node-kinds';

export class AstWalker {
  constructor(private parser: PHPParser) {}

  walkAst(
    ast: ASTNode,
    processClass: (
      classNode: Class,
      currentNamespace: string,
      currentUses: Record<string, string>
    ) => void
  ): void {
    let currentNamespace = '';
    let currentUses: Record<string, string> = {};

    this.parser.walk(ast, (node) => {
      if (node.kind === AstNodeKind.NAMESPACE) {
        currentNamespace = NameResolver.nsNameToString((node as any).name);
        currentUses = {};
        return;
      }

      if (node.kind === AstNodeKind.USE_ITEM) {
        NameResolver.addUseItemToMap(node as any, currentNamespace, currentUses);
        return;
      }

      if (node.kind === AstNodeKind.USE_GROUP) {
        this.processUseGroup(node, currentNamespace, currentUses);
        return;
      }

      if (node.kind === AstNodeKind.CLASS) {
        processClass(node as Class, currentNamespace, currentUses);
      }
    });
  }

  private processUseGroup(
    node: any,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): void {
    const baseName = NameResolver.nsNameToString(node.name);
    const base = baseName.startsWith('\\') ? baseName : '\\' + baseName;
    
    for (const item of (node.items || [])) {
      NameResolver.addUseItemToMap(item, currentNamespace, currentUses, base);
    }
  }
}
