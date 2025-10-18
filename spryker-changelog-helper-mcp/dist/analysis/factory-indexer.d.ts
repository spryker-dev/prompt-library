import { FactoryIndex, Logger } from '../types/domain.types';
import { PHPParser } from '../parser/php-parser';
export declare class FactoryIndexer {
    private parser;
    private logger;
    constructor(parser: PHPParser, logger: Logger);
    indexFactoryReturnTypes(files: string[]): Promise<FactoryIndex>;
    private processFile;
    private parseFile;
    private updateNamespaceContext;
    private processClass;
    private extractMethodAnnotations;
    private parseMethodAnnotations;
    private processFactoryMethod;
    private isFactoryMethod;
    private registerFactoryReturnType;
    private isFactoryClass;
    private findReturnType;
    private extractReturnTypeFromCode;
    private isVariableInstantiation;
    private trackVariableInstantiation;
    private isReturnStatement;
    private resolveReturnExpression;
    private extractReturnTypeFromDocBlock;
    private collectCommentText;
    private extractReturnFromDoc;
    private parseReturnAnnotation;
    private resolveReturnTypeString;
}
//# sourceMappingURL=factory-indexer.d.ts.map