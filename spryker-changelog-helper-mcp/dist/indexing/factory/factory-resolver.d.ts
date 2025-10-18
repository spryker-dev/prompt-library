import { FullyQualifiedName } from '../../types/domain.types';
export declare class FactoryResolver {
    static factoryClassFor(classFqn: FullyQualifiedName, ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>): FullyQualifiedName | null;
    private static resolveByConvention;
}
//# sourceMappingURL=factory-resolver.d.ts.map