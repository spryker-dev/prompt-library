import { PhpDocMarker } from '../../constants/php-doc-patterns';

interface PhpDocResult {
  description?: string;
  isApiMethod?: boolean;
  isDeprecated?: boolean;
}

export class PhpDocParser {
  static parse(docText: string): PhpDocResult {
    if (!docText) {
      return {};
    }

    const description = this.extractDescription(docText);
    const isApiMethod = docText.includes('@api');
    const isDeprecated = docText.includes('@deprecated');

    return { description, isApiMethod, isDeprecated };
  }

  static extractDescription(docText: string): string | undefined {
    const lines: string[] = [];
    const docLines = docText.split('\n');
    
    for (const line of docLines) {
      const trimmed = line.replace(PhpDocMarker.LINE_PREFIX, '').trim();
      
      if (this.shouldSkipLine(trimmed)) {
        continue;
      }
      
      if (trimmed.startsWith(PhpDocMarker.TAG_PREFIX)) {
        break;
      }
      
      lines.push(trimmed);
    }
    
    return lines.length > 0 ? lines.join(' ').trim() : undefined;
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

  private static shouldSkipLine(trimmed: string): boolean {
    return trimmed.startsWith(PhpDocMarker.DOC_START) || 
           trimmed.startsWith(PhpDocMarker.DOC_END) || 
           trimmed === '';
  }
}
