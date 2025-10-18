import { Method, Assign, Variable, New, Return } from '../../types/ast.types';
import { FullyQualifiedName } from '../../types/domain.types';
import { PHPParser } from '../../parser/php-parser';
import { NameResolver } from '../../utils/name-resolver';
import { FactoryPattern } from '../constants/factory-patterns';
import { AstNodeKind, AstResolution } from '../constants/ast-node-kinds';

export class ReturnTypeExtractor {
  constructor(private parser: PHPParser) {}

  extractReturnType(
    method: Method,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    const returnTypeFromCode = this.extractFromCode(method, currentNamespace, currentUses);
    if (returnTypeFromCode) return returnTypeFromCode;

    return this.extractFromDocBlock(method, currentNamespace, currentUses);
  }

  private extractFromCode(
    method: Method,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    const localVariableTypes = new Map<string, FullyQualifiedName>();
    let returnType: FullyQualifiedName | null = null;

    this.parser.walk(method as any, (node) => {
      if (returnType) return;

      if (this.isVariableInstantiation(node)) {
        this.trackVariableInstantiation(node, localVariableTypes, currentNamespace, currentUses);
      }

      if (this.isReturnStatement(node)) {
        returnType = this.resolveReturnExpression(node, localVariableTypes, currentNamespace, currentUses);
      }
    });

    return returnType;
  }

  private isVariableInstantiation(node: any): boolean {
    return node.kind === AstNodeKind.ASSIGN && 
           node.left?.kind === AstNodeKind.VARIABLE && 
           node.right?.kind === AstNodeKind.NEW;
  }

  private trackVariableInstantiation(
    node: any,
    localVariableTypes: Map<string, FullyQualifiedName>,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): void {
    const assign = node as Assign;
    const variableName = typeof (assign.left as Variable).name === 'string'
      ? (assign.left as Variable).name
      : null;
    const className = NameResolver.resolveName((assign.right as New).what, currentNamespace, currentUses);

    if (variableName && className) {
      localVariableTypes.set(variableName, className);
    }
  }

  private isReturnStatement(node: any): boolean {
    return node.kind === AstNodeKind.RETURN && node.expr;
  }

  private resolveReturnExpression(
    node: any,
    localVariableTypes: Map<string, FullyQualifiedName>,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    const returnStmt = node as Return;
    const expr = returnStmt.expr;

    if (expr.kind === AstNodeKind.NEW) {
      return NameResolver.resolveName((expr as New).what, currentNamespace, currentUses);
    }

    if (expr.kind === AstNodeKind.VARIABLE && typeof (expr as Variable).name === 'string') {
      return localVariableTypes.get((expr as Variable).name) || null;
    }

    return null;
  }

  private extractFromDocBlock(
    method: Method,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    const docText = this.collectCommentText(method);
    return this.extractFromDoc(docText, currentNamespace, currentUses);
  }

  private collectCommentText(node: any): string {
    const chunks: string[] = [];
    
    if (Array.isArray(node.leadingComments)) {
      chunks.push(...node.leadingComments.map((c: any) => c.value || ''));
    }
    
    if (node.doc && typeof node.doc === 'string') {
      chunks.push(node.doc);
    }
    
    if (Array.isArray(node.comments)) {
      chunks.push(...node.comments.map((c: any) => c.value || ''));
    }
    
    return chunks.join('\n');
  }

  private extractFromDoc(
    text: string,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    if (!text) return null;

    const returnTypeString = this.parseReturnAnnotation(text);
    if (!returnTypeString) return null;

    return this.resolveTypeString(returnTypeString, currentNamespace, currentUses);
  }

  private parseReturnAnnotation(text: string): string | null {
    const match = text.match(FactoryPattern.RETURN_ANNOTATION);
    if (!match) return null;

    const typeWithUnions = match[1];
    const firstType = typeWithUnions.split('|')[0].trim();
    const typeWithoutArray = firstType.replace(/\[\]$/, '');

    return typeWithoutArray || null;
  }

  resolveTypeString(
    typeString: string,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    const isFullyQualified = typeString.startsWith('\\');
    const nameNode = {
      kind: AstNodeKind.NAME,
      name: typeString,
      resolution: isFullyQualified ? AstResolution.FQN : null,
    };

    return NameResolver.resolveName(nameNode as any, currentNamespace, currentUses);
  }
}
