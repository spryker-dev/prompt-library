import { Class } from '../../../types/ast.types';
import { MethodMetadata, CanonicalKey, FullyQualifiedName, Logger, ClassMetadata } from '../../../types/domain.types';
export declare class ClassIndexer {
    private logger;
    private methodIndexer;
    constructor(logger: Logger);
    indexClass(classNode: Class, filePath: string, currentNamespace: string, currentUses: Record<string, string>, classes: Map<FullyQualifiedName, ClassMetadata>, methods: Map<CanonicalKey, MethodMetadata>, ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>, classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>): void;
    private extractClassName;
    private buildFullyQualifiedName;
    private indexImplementedInterfaces;
    private indexFactoryAnnotation;
    private extractFactoryFromDoc;
    private indexClassMethods;
    private logClass;
}
//# sourceMappingURL=class-indexer.d.ts.map