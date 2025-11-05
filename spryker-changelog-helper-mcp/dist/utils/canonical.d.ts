import { FullyQualifiedName, MethodName, CanonicalKey } from '../types/domain.types';
export declare function ensureFqn(name: string | FullyQualifiedName): FullyQualifiedName;
export declare function canonFqn(name: string | FullyQualifiedName): string;
export declare function canonMethod(methodName: string | MethodName): string;
export declare function canonKey(fqn: FullyQualifiedName, method: MethodName): CanonicalKey;
export declare class CanonicalNameUtils {
    static ensureFqn: typeof ensureFqn;
    static canonFqn: typeof canonFqn;
    static canonMethod: typeof canonMethod;
    static canonKey: typeof canonKey;
}
//# sourceMappingURL=canonical.d.ts.map