import { Class } from '../../types/ast.types';
import { FullyQualifiedName, CanonicalKey, Logger } from '../../types/domain.types';
import { ReturnTypeExtractor } from './return-type-extractor';
export declare class MethodAnnotationParser {
    private returnTypeExtractor;
    private logger;
    constructor(returnTypeExtractor: ReturnTypeExtractor, logger: Logger);
    extractAnnotations(classNode: Class, classFqn: FullyQualifiedName, currentNamespace: string, currentUses: Record<string, string>, factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>): void;
    private collectCommentText;
    private parseAnnotations;
    private processAnnotation;
    private registerReturnType;
}
//# sourceMappingURL=method-annotation-parser.d.ts.map