import { ASTNode, Class } from '../../types/ast.types';
import { PHPParser } from '../../parser/php-parser';
export declare class AstWalker {
    private parser;
    constructor(parser: PHPParser);
    walkAst(ast: ASTNode, processClass: (classNode: Class, currentNamespace: string, currentUses: Record<string, string>) => void): void;
    private processUseGroup;
}
//# sourceMappingURL=ast-walker.d.ts.map