"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceCallHandler = void 0;
const canonical_1 = require("../../../utils/canonical");
const ast_node_kinds_1 = require("../../constants/ast-node-kinds");
const edge_kinds_1 = require("../../constants/edge-kinds");
class InstanceCallHandler {
    constructor(interfaceToImplementations, logger) {
        this.interfaceToImplementations = interfaceToImplementations;
        this.logger = logger;
    }
    processDirectCall(chain, classFqn, methodName, addEdge) {
        if (this.isThisCall(chain) && this.isSingleMethodCall(chain)) {
            addEdge(classFqn, methodName, edge_kinds_1.EdgeKind.INTRA);
        }
    }
    processPropertyCall(chain, classFqn, currentMethodName, propertyTypes, targetMethodName, addEdge) {
        if (!this.isThisCall(chain) || !this.hasPropertyAccess(chain))
            return;
        const propertyName = chain.names[0];
        const propertyType = propertyTypes[propertyName];
        if (propertyType) {
            addEdge(propertyType, targetMethodName, edge_kinds_1.EdgeKind.THIS_PROPERTY);
            this.logger?.('[this-prop]', (0, canonical_1.canonKey)(classFqn, currentMethodName), '->', `${propertyType}::${targetMethodName}`);
            this.addInterfaceEdges(propertyType, targetMethodName, addEdge);
            return;
        }
        this.logger?.('[prop-miss]', (0, canonical_1.canonKey)(classFqn, currentMethodName), 'prop', propertyName, 'no type found');
    }
    processVariableCall(chain, localTypes, paramTypes, methodName, addEdge) {
        const variableName = this.extractVariableName(chain);
        if (!variableName || variableName === ast_node_kinds_1.SpecialVariables.THIS)
            return;
        const variableType = localTypes[variableName] || paramTypes[variableName] || null;
        if (variableType) {
            addEdge(variableType, methodName, edge_kinds_1.EdgeKind.METHOD);
            this.addInterfaceEdges(variableType, methodName, addEdge);
        }
    }
    isThisCall(chain) {
        return chain.base?.kind === ast_node_kinds_1.AstNodeKind.VARIABLE &&
            chain.base.name === ast_node_kinds_1.SpecialVariables.THIS;
    }
    isSingleMethodCall(chain) {
        return chain.names.length === 1;
    }
    hasPropertyAccess(chain) {
        return chain.names.length >= 2;
    }
    extractVariableName(chain) {
        if (chain.base?.kind !== ast_node_kinds_1.AstNodeKind.VARIABLE)
            return null;
        const name = chain.base.name;
        return typeof name === 'string' ? name : null;
    }
    addInterfaceEdges(typeFqn, methodName, addEdge) {
        const implementations = this.interfaceToImplementations.get((0, canonical_1.ensureFqn)(typeFqn));
        if (implementations) {
            for (const implementation of implementations) {
                addEdge(implementation, methodName, edge_kinds_1.EdgeKind.INTERFACE_IMPL);
                this.logger?.('[iface-impl]', String(typeFqn), '⇒', `${String(implementation)}::${methodName}`);
            }
        }
    }
}
exports.InstanceCallHandler = InstanceCallHandler;
//# sourceMappingURL=instance-call-handler.js.map