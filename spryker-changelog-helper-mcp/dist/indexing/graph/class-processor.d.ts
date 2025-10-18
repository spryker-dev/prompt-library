import { Class } from '../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap } from '../../types/domain.types';
import { PHPParser } from '../../parser/php-parser';
import { ParameterProcessor } from './parameter-processor';
import { PropertyTypeTracker } from './property-type-tracker';
import { MethodCallProcessor } from './method-call-processor';
import { GraphBuilder } from './graph-builder';
export declare class ClassProcessor {
    private parser;
    private graphBuilder;
    private parameterProcessor;
    private propertyTypeTracker;
    private methodCallProcessor;
    private propertyTypesByClass;
    constructor(parser: PHPParser, graphBuilder: GraphBuilder, parameterProcessor: ParameterProcessor, propertyTypeTracker: PropertyTypeTracker, methodCallProcessor: MethodCallProcessor, propertyTypesByClass: Map<FullyQualifiedName, PropertyTypeMap>);
    processClass(classNode: Class, currentNamespace: string, currentUses: Record<string, string>, resolveExprType: (expr: any) => FullyQualifiedName | null): void;
    private processMethod;
    private processMethodBody;
    private handleAssignment;
    private addEdge;
}
//# sourceMappingURL=class-processor.d.ts.map