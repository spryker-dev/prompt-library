"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticCallHandler = void 0;
const name_resolver_1 = require("../../../utils/name-resolver");
const ast_node_kinds_1 = require("../../constants/ast-node-kinds");
const edge_kinds_1 = require("../../constants/edge-kinds");
class StaticCallHandler {
    processStaticCall(staticCall, classFqn, currentNamespace, currentUses, addEdge) {
        const receiverClass = this.resolveReceiver(staticCall, classFqn, currentNamespace, currentUses);
        const methodName = name_resolver_1.NameResolver.getIdentifierName(staticCall.what);
        if (methodName) {
            addEdge(receiverClass, methodName, edge_kinds_1.EdgeKind.STATIC);
        }
    }
    resolveReceiver(staticCall, classFqn, currentNamespace, currentUses) {
        if (staticCall.class?.kind === ast_node_kinds_1.AstNodeKind.NAME) {
            const className = String(staticCall.class.name).toLowerCase();
            if (this.isSelfReference(className)) {
                return classFqn;
            }
        }
        return name_resolver_1.NameResolver.resolveName(staticCall.class, currentNamespace, currentUses);
    }
    isSelfReference(className) {
        return className === ast_node_kinds_1.SelfReferences.SELF ||
            className === ast_node_kinds_1.SelfReferences.STATIC ||
            className === ast_node_kinds_1.SelfReferences.PARENT;
    }
}
exports.StaticCallHandler = StaticCallHandler;
//# sourceMappingURL=static-call-handler.js.map