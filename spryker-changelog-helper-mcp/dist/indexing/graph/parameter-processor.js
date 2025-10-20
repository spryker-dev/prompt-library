"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterProcessor = void 0;
const name_resolver_1 = require("../../utils/name-resolver");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
class ParameterProcessor {
    constructor(logger) {
        this.logger = logger;
    }
    processMethodParameters(method, methodName, classFqn, propertyTypes, currentNamespace, currentUses, parameterTypes) {
        const parameters = this.extractParameters(method);
        for (const param of parameters) {
            const parameterName = this.extractParameterName(param);
            const parameterType = this.resolveParameterType(param, currentNamespace, currentUses);
            if (parameterName && parameterType) {
                parameterTypes[parameterName] = parameterType;
                const isConstructor = methodName === ast_node_kinds_1.SpecialMethods.CONSTRUCT;
                if (isConstructor && this.isPromotedProperty(param)) {
                    propertyTypes[parameterName] = parameterType;
                    this.logger?.('[prop-promoted]', `${classFqn}::$${parameterName}`, '=>', parameterType);
                }
            }
        }
    }
    extractParameters(method) {
        if (Array.isArray(method?.params))
            return method.params;
        if (Array.isArray(method?.arguments))
            return method.arguments;
        return [];
    }
    extractParameterName(param) {
        if (param.name && typeof param.name.name === 'string') {
            return String(param.name.name);
        }
        if (typeof param.name === 'string') {
            return param.name;
        }
        return null;
    }
    resolveParameterType(param, currentNamespace, currentUses) {
        if (!param.type)
            return null;
        const typeNode = param.type.kind === ast_node_kinds_1.AstNodeKind.NULLABLE_TYPE
            ? param.type.what
            : param.type;
        return name_resolver_1.NameResolver.resolveName(typeNode, currentNamespace, currentUses);
    }
    isPromotedProperty(param) {
        const hasFlagsSet = !!(param.flags && param.flags !== 0);
        const hasVisibility = !!(param.visibility && param.visibility !== null);
        return hasFlagsSet || hasVisibility;
    }
}
exports.ParameterProcessor = ParameterProcessor;
//# sourceMappingURL=parameter-processor.js.map