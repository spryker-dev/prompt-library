"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeResolver = void 0;
const name_resolver_1 = require("../../utils/name-resolver");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
class TypeResolver {
    resolveExpressionType(expression, localTypes, paramTypes, currentNamespace, currentUses) {
        if (!expression)
            return null;
        if (expression.kind === ast_node_kinds_1.AstNodeKind.NEW) {
            return this.resolveNewExpression(expression, currentNamespace, currentUses);
        }
        if (expression.kind === ast_node_kinds_1.AstNodeKind.VARIABLE) {
            return this.resolveVariableType(expression, localTypes, paramTypes);
        }
        return null;
    }
    resolveNewExpression(expression, currentNamespace, currentUses) {
        return name_resolver_1.NameResolver.resolveName(expression.what, currentNamespace, currentUses);
    }
    resolveVariableType(expression, localTypes, paramTypes) {
        const variableName = expression.name;
        if (typeof variableName !== 'string')
            return null;
        return localTypes[variableName] || paramTypes[variableName] || null;
    }
}
exports.TypeResolver = TypeResolver;
//# sourceMappingURL=type-resolver.js.map