import { Class, Method, Property, Assign, StaticCall, Call } from '../../types/ast.types';
import { FullyQualifiedName, PropertyTypeMap, CanonicalKey } from '../../types/domain.types';
import { PHPParser } from '../../parser/php-parser';
import { ensureFqn, canonKey } from '../../utils/canonical';
import { ParameterProcessor } from './parameter-processor';
import { PropertyTypeTracker } from './property-type-tracker';
import { MethodCallProcessor } from './method-call-processor';
import { GraphBuilder } from './graph-builder';
import { AstNodeKind } from '../constants/ast-node-kinds';

export class ClassProcessor {
  constructor(
    private parser: PHPParser,
    private graphBuilder: GraphBuilder,
    private parameterProcessor: ParameterProcessor,
    private propertyTypeTracker: PropertyTypeTracker,
    private methodCallProcessor: MethodCallProcessor,
    private propertyTypesByClass: Map<FullyQualifiedName, PropertyTypeMap>
  ) {}

  processClass(
    classNode: Class,
    currentNamespace: string,
    currentUses: Record<string, string>,
    resolveExprType: (expr: any) => FullyQualifiedName | null
  ): void {
    const className = classNode.name ? String(classNode.name.name) : null;
    if (!className) return;

    const classFqn = ensureFqn(currentNamespace ? `${currentNamespace}\\${className}` : className);
    if (!Array.isArray(classNode.body)) return;

    const propertyTypes = this.propertyTypesByClass.get(classFqn) || {};
    this.propertyTypesByClass.set(classFqn, propertyTypes);

    for (const statement of classNode.body) {
      if (statement.kind === AstNodeKind.PROPERTY) {
        this.propertyTypeTracker.processPropertyDeclaration(
          statement as Property,
          classFqn,
          propertyTypes,
          currentNamespace,
          currentUses
        );
        continue;
      }

      if (statement.kind === AstNodeKind.METHOD) {
        this.processMethod(
          statement as Method,
          classFqn,
          propertyTypes,
          currentNamespace,
          currentUses,
          resolveExprType
        );
      }
    }
  }

  private processMethod(
    method: Method,
    classFqn: FullyQualifiedName,
    propertyTypes: PropertyTypeMap,
    currentNamespace: string,
    currentUses: Record<string, string>,
    resolveExprType: (expr: any) => FullyQualifiedName | null
  ): void {
    const methodName = method.name ? String(method.name.name) : null;
    if (!methodName) return;

    const methodKey = canonKey(classFqn, methodName);
    const localTypes: Record<string, FullyQualifiedName> = {};
    const paramTypes: Record<string, FullyQualifiedName> = {};

    this.parameterProcessor.processMethodParameters(
      method,
      methodName,
      classFqn,
      propertyTypes,
      currentNamespace,
      currentUses,
      paramTypes
    );

    this.graphBuilder.ensureMethodNode(methodKey, classFqn, methodName);

    this.parser.walk(method as any, (node) => {
      this.processMethodBody(
        node,
        classFqn,
        methodName,
        methodKey,
        propertyTypes,
        localTypes,
        paramTypes,
        currentNamespace,
        currentUses,
        resolveExprType
      );
    });
  }

  private processMethodBody(
    node: any,
    classFqn: FullyQualifiedName,
    methodName: string,
    methodKey: CanonicalKey,
    propertyTypes: PropertyTypeMap,
    localTypes: Record<string, FullyQualifiedName>,
    paramTypes: Record<string, FullyQualifiedName>,
    currentNamespace: string,
    currentUses: Record<string, string>,
    resolveExprType: (expr: any) => FullyQualifiedName | null
  ): void {
    if (node.kind === AstNodeKind.ASSIGN) {
      this.handleAssignment(
        node,
        classFqn,
        propertyTypes,
        localTypes,
        currentNamespace,
        currentUses,
        resolveExprType
      );
      return;
    }

    if (node.kind === AstNodeKind.STATIC_CALL) {
      this.methodCallProcessor.processStaticCall(
        node as StaticCall,
        classFqn,
        currentNamespace,
        currentUses,
        (calleeFqn, calleeName, kind) => this.addEdge(methodKey, calleeFqn, calleeName, kind)
      );
      return;
    }

    if (node.kind === AstNodeKind.CALL) {
      this.methodCallProcessor.processInstanceCall(
        node as Call,
        classFqn,
        methodName,
        propertyTypes,
        localTypes,
        paramTypes,
        (calleeFqn, calleeName, kind) => this.addEdge(methodKey, calleeFqn, calleeName, kind)
      );
    }
  }

  private handleAssignment(
    assign: Assign,
    classFqn: FullyQualifiedName,
    propertyTypes: PropertyTypeMap,
    localTypes: Record<string, FullyQualifiedName>,
    currentNamespace: string,
    currentUses: Record<string, string>,
    resolveExprType: (expr: any) => FullyQualifiedName | null
  ): void {
    const isVariableAssignment = assign.left?.kind === AstNodeKind.VARIABLE;
    const isPropertyAssignment = assign.left?.kind === AstNodeKind.PROPERTY_LOOKUP;

    if (isVariableAssignment && assign.right?.kind === AstNodeKind.NEW) {
      this.propertyTypeTracker.trackLocalVariable(assign, localTypes, currentNamespace, currentUses);
    }

    if (isPropertyAssignment) {
      this.propertyTypeTracker.trackPropertyAssignment(assign, classFqn, propertyTypes, resolveExprType);
    }
  }

  private addEdge(
    callerKey: CanonicalKey,
    calleeFqn: FullyQualifiedName | null,
    calleeName: string,
    kind: string
  ): void {
    if (!calleeFqn || !calleeName) return;

    const calleeKey = canonKey(calleeFqn, calleeName);
    this.graphBuilder.ensureMethodNode(calleeKey, calleeFqn, calleeName);
    this.graphBuilder.addEdge(callerKey, calleeKey, kind);
  }
}
