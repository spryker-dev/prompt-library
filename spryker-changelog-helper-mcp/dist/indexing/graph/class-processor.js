"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassProcessor = void 0;
const canonical_1 = require("../../utils/canonical");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
class ClassProcessor {
    constructor(parser, graphBuilder, parameterProcessor, propertyTypeTracker, methodCallProcessor, propertyTypesByClass) {
        this.parser = parser;
        this.graphBuilder = graphBuilder;
        this.parameterProcessor = parameterProcessor;
        this.propertyTypeTracker = propertyTypeTracker;
        this.methodCallProcessor = methodCallProcessor;
        this.propertyTypesByClass = propertyTypesByClass;
    }
    processClass(classNode, currentNamespace, currentUses, resolveExprType) {
        const className = classNode.name ? String(classNode.name.name) : null;
        if (!className)
            return;
        const classFqn = (0, canonical_1.ensureFqn)(currentNamespace ? `${currentNamespace}\\${className}` : className);
        if (!Array.isArray(classNode.body))
            return;
        const propertyTypes = this.propertyTypesByClass.get(classFqn) || {};
        this.propertyTypesByClass.set(classFqn, propertyTypes);
        for (const statement of classNode.body) {
            if (statement.kind === ast_node_kinds_1.AstNodeKind.PROPERTY) {
                this.propertyTypeTracker.processPropertyDeclaration(statement, classFqn, propertyTypes, currentNamespace, currentUses);
                continue;
            }
            if (statement.kind === ast_node_kinds_1.AstNodeKind.METHOD) {
                this.processMethod(statement, classFqn, propertyTypes, currentNamespace, currentUses, resolveExprType);
            }
        }
    }
    processMethod(method, classFqn, propertyTypes, currentNamespace, currentUses, resolveExprType) {
        const methodName = method.name ? String(method.name.name) : null;
        if (!methodName)
            return;
        const methodKey = (0, canonical_1.canonKey)(classFqn, methodName);
        const localTypes = {};
        const paramTypes = {};
        this.parameterProcessor.processMethodParameters(method, methodName, classFqn, propertyTypes, currentNamespace, currentUses, paramTypes);
        this.graphBuilder.ensureMethodNode(methodKey, classFqn, methodName);
        this.parser.walk(method, (node) => {
            this.processMethodBody(node, classFqn, methodName, methodKey, propertyTypes, localTypes, paramTypes, currentNamespace, currentUses, resolveExprType);
        });
    }
    processMethodBody(node, classFqn, methodName, methodKey, propertyTypes, localTypes, paramTypes, currentNamespace, currentUses, resolveExprType) {
        if (node.kind === ast_node_kinds_1.AstNodeKind.ASSIGN) {
            this.handleAssignment(node, classFqn, propertyTypes, localTypes, currentNamespace, currentUses, resolveExprType);
            return;
        }
        if (node.kind === ast_node_kinds_1.AstNodeKind.STATIC_CALL) {
            this.methodCallProcessor.processStaticCall(node, classFqn, currentNamespace, currentUses, (calleeFqn, calleeName, kind) => this.addEdge(methodKey, calleeFqn, calleeName, kind));
            return;
        }
        if (node.kind === ast_node_kinds_1.AstNodeKind.CALL) {
            this.methodCallProcessor.processInstanceCall(node, classFqn, methodName, propertyTypes, localTypes, paramTypes, (calleeFqn, calleeName, kind) => this.addEdge(methodKey, calleeFqn, calleeName, kind));
        }
    }
    handleAssignment(assign, classFqn, propertyTypes, localTypes, currentNamespace, currentUses, resolveExprType) {
        const isVariableAssignment = assign.left?.kind === ast_node_kinds_1.AstNodeKind.VARIABLE;
        const isPropertyAssignment = assign.left?.kind === ast_node_kinds_1.AstNodeKind.PROPERTY_LOOKUP;
        if (isVariableAssignment && assign.right?.kind === ast_node_kinds_1.AstNodeKind.NEW) {
            this.propertyTypeTracker.trackLocalVariable(assign, localTypes, currentNamespace, currentUses);
        }
        if (isPropertyAssignment) {
            this.propertyTypeTracker.trackPropertyAssignment(assign, classFqn, propertyTypes, resolveExprType);
        }
    }
    addEdge(callerKey, calleeFqn, calleeName, kind) {
        if (!calleeFqn || !calleeName)
            return;
        const calleeKey = (0, canonical_1.canonKey)(calleeFqn, calleeName);
        this.graphBuilder.ensureMethodNode(calleeKey, calleeFqn, calleeName);
        this.graphBuilder.addEdge(callerKey, calleeKey, kind);
    }
}
exports.ClassProcessor = ClassProcessor;
//# sourceMappingURL=class-processor.js.map