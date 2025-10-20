import { ASTNode } from '../types/ast.types';
export declare class PHPParser {
    private parser;
    constructor();
    parseCode(code: string, filename?: string): ASTNode;
    walk(node: ASTNode, callback: (node: ASTNode) => void): void;
}
export declare const parser: PHPParser;
export declare const walk: (node: ASTNode, callback: (node: ASTNode) => void) => void;
//# sourceMappingURL=php-parser.d.ts.map