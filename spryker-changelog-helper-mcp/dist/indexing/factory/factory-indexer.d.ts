import { FactoryIndex, Logger } from '../../types/domain.types';
import { PHPParser } from '../../parser/php-parser';
export declare class FactoryIndexer {
    private parser;
    private logger;
    private returnTypeExtractor;
    private annotationParser;
    constructor(parser: PHPParser, logger: Logger);
    indexFactoryReturnTypes(files: string[]): Promise<FactoryIndex>;
    private processFile;
    private parseFile;
    private updateNamespaceContext;
    private processClass;
    private processFactoryMethod;
    private registerReturnType;
}
//# sourceMappingURL=factory-indexer.d.ts.map