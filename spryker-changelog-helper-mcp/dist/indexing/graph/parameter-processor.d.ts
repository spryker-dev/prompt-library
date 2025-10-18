import { Method } from '../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap, Logger } from '../../types/domain.types';
export declare class ParameterProcessor {
    private logger;
    constructor(logger: Logger);
    processMethodParameters(method: Method, methodName: string, classFqn: FullyQualifiedName, propertyTypes: PropertyTypeMap, currentNamespace: string, currentUses: Record<string, string>, parameterTypes: Record<string, FullyQualifiedName>): void;
    private extractParameters;
    private extractParameterName;
    private resolveParameterType;
    private isPromotedProperty;
}
//# sourceMappingURL=parameter-processor.d.ts.map