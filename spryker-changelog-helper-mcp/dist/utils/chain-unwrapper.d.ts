import { ASTNode } from '../types/ast.types';
export interface UnwrappedChain {
    names: string[];
    base: ASTNode | null;
    tail: string | null;
}
export declare class ChainUnwrapper {
    static unwrapChain(node: ASTNode): UnwrappedChain;
}
//# sourceMappingURL=chain-unwrapper.d.ts.map