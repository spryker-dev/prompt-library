import * as fs from 'fs';
import { ASTNode } from '../../types/ast.types';
import { PHPParser } from '../../parser/php-parser';

export class FileProcessor {
  constructor(private parser: PHPParser) {}

  async processFiles(
    files: string[],
    processAst: (ast: ASTNode) => void
  ): Promise<void> {
    for (const filePath of files) {
      await this.processFile(filePath, processAst);
    }
  }

  private async processFile(
    filePath: string,
    processAst: (ast: ASTNode) => void
  ): Promise<void> {
    const code = fs.readFileSync(filePath, 'utf8');
    
    try {
      const ast = this.parser.parseCode(code, filePath);
      processAst(ast);
    } catch {
      return;
    }
  }
}
