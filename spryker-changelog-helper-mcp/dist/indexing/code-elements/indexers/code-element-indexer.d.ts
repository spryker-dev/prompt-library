import { SymbolIndex, Logger } from '../../../types/domain.types';
import { PHPParser } from '../../../parser/php-parser';
export declare class CodeElementIndexer {
    private parser;
    private classIndexer;
    private interfaceIndexer;
    private inheritDocResolver;
    constructor(parser: PHPParser, logger: Logger);
    indexSymbols(files: string[]): Promise<SymbolIndex>;
    private indexFile;
    private parseCode;
    private processAst;
    private processUseGroup;
}
//# sourceMappingURL=code-element-indexer.d.ts.map