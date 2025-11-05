import { ASTNode } from '../types/ast.types';

export class PHPParser {
  private parser: any;

  constructor() {
    const options = {
      parser: { php7: true, extractDoc: true, suppressErrors: true },
      ast: { withPositions: true },
      lexer: { all_tokens: true },
    };

    let PHPParserModule: any;
    try {
      PHPParserModule = require('php-parser');
    } catch (e) {
      throw new Error('Failed to load php-parser module');
    }

    if (typeof PHPParserModule === 'function') {
      this.parser = new PHPParserModule(options);
    } else if (PHPParserModule && typeof PHPParserModule.Engine === 'function') {
      this.parser = new PHPParserModule.Engine(options);
    } else if (PHPParserModule && typeof PHPParserModule.default === 'function') {
      this.parser = new PHPParserModule.default(options);
    } else {
      throw new Error('Unsupported php-parser API');
    }
  }

  parseCode(code: string, filename?: string): ASTNode {
    return this.parser.parseCode(code, filename);
  }

  walk(node: ASTNode, callback: (node: ASTNode) => void): void {
    if (!node || typeof node !== 'object') {
      return;
    }

    callback(node);

    for (const key in node) {
      const value = (node as any)[key];
      if (!value) continue;

      if (Array.isArray(value)) {
        value.forEach((item) => this.walk(item, callback));
      } else if (value && typeof value === 'object' && (value as any).kind) {
        this.walk(value, callback);
      }
    }
  }
}

export const parser = new PHPParser();
export const { walk } = parser;
