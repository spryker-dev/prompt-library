import { FullyQualifiedName } from '../../types/domain.types';
import { NameResolver } from '../../utils/name-resolver';
import { PhpDocPattern } from '../constants/php-doc-patterns';

const PRIMITIVE_TYPES = /^(int|float|string|bool|array|iterable|callable|mixed|object|null)$/i;

export class PropertyTypeExtractor {
  static extractVarFqnFromDoc(
    text: string,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    if (!text) return null;

    const match = text.match(PhpDocPattern.VAR_TYPE);
    if (!match) return null;

    return this.resolveFirstNonPrimitiveType(match[1], currentNamespace, currentUses);
  }

  private static resolveFirstNonPrimitiveType(
    typeString: string,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    for (const part of typeString.split('|')) {
      const cleanType = part.replace(/\[\]$/, '').trim();
      
      if (!cleanType || PRIMITIVE_TYPES.test(cleanType)) {
        continue;
      }

      const fqn = this.resolveSingleType(cleanType, currentNamespace, currentUses);
      if (fqn) return fqn;
    }

    return null;
  }

  private static resolveSingleType(
    rawType: string,
    currentNamespace: string,
    currentUses: Record<string, string>
  ): FullyQualifiedName | null {
    const nameNode = rawType.startsWith('\\')
      ? { kind: 'name', name: rawType, resolution: 'fqn' }
      : { kind: 'name', name: rawType, resolution: null };

    return NameResolver.resolveName(nameNode as any, currentNamespace, currentUses);
  }

  static collectCommentText(node: any): string {
    const chunks: string[] = [];
    const addComment = (comment: any) => {
      if (comment && typeof comment.value === 'string') {
        chunks.push(comment.value);
      }
    };

    if (Array.isArray(node.leadingComments)) {
      node.leadingComments.forEach(addComment);
    }
    
    if (Array.isArray(node.comments)) {
      node.comments.forEach(addComment);
    }

    return chunks.join('\n');
  }
}
