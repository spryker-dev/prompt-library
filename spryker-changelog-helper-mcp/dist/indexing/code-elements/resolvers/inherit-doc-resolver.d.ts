import { MethodMetadata, CanonicalKey, FullyQualifiedName } from '../../../types/domain.types';
export declare class InheritDocResolver {
    resolve(methods: Map<CanonicalKey, MethodMetadata>, classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>): void;
    private needsInheritance;
    private inheritFromInterface;
    private isValidInheritanceSource;
    private copyMetadata;
}
//# sourceMappingURL=inherit-doc-resolver.d.ts.map