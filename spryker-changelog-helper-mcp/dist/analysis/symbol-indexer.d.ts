import { SymbolIndex, Logger } from '../types/domain.types';
import { PHPParser } from '../parser/php-parser';
export declare class SymbolIndexer {
    private parser;
    private logger;
    constructor(parser: PHPParser, logger: Logger);
    indexSymbols(files: string[]): Promise<SymbolIndex>;
    private resolveInheritDoc;
    private indexFile;
    private indexInterface;
    private indexClass;
    private collectCommentText;
    private parsePhpDoc;
    private extractFactoryFqnFromDoc;
}
//# sourceMappingURL=symbol-indexer.d.ts.map