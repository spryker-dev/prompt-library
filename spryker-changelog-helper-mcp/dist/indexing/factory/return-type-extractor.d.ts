import { Method } from '../../types/ast.types';
import { FullyQualifiedName } from '../../types/domain.types';
import { PHPParser } from '../../parser/php-parser';
export declare class ReturnTypeExtractor {
    private parser;
    constructor(parser: PHPParser);
    extractReturnType(method: Method, currentNamespace: string, currentUses: Record<string, string>): FullyQualifiedName | null;
    private extractFromCode;
    private isVariableInstantiation;
    private trackVariableInstantiation;
    private isReturnStatement;
    private resolveReturnExpression;
    private extractFromDocBlock;
    private collectCommentText;
    private extractFromDoc;
    private parseReturnAnnotation;
    resolveTypeString(typeString: string, currentNamespace: string, currentUses: Record<string, string>): FullyQualifiedName | null;
}
//# sourceMappingURL=return-type-extractor.d.ts.map