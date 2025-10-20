import { ASTNode } from '../../types/ast.types';
import { PHPParser } from '../../parser/php-parser';
export declare class FileProcessor {
    private parser;
    constructor(parser: PHPParser);
    processFiles(files: string[], processAst: (ast: ASTNode) => void): Promise<void>;
    private processFile;
}
//# sourceMappingURL=file-processor.d.ts.map