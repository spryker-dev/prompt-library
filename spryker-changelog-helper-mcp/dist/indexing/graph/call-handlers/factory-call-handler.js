"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryCallHandler = void 0;
const canonical_1 = require("../../../utils/canonical");
const factory_resolver_1 = require("../../factory/factory-resolver");
const factory_patterns_1 = require("../../constants/factory-patterns");
const edge_kinds_1 = require("../../constants/edge-kinds");
class FactoryCallHandler {
    constructor(ownerToFactory, factoryReturnByClassMethod) {
        this.ownerToFactory = ownerToFactory;
        this.factoryReturnByClassMethod = factoryReturnByClassMethod;
    }
    processFactoryCall(chain, classFqn, methodName, addEdge) {
        const factoryMethodIndex = this.findFactoryMethodIndex(chain.names, classFqn);
        if (factoryMethodIndex !== -1) {
            const factoryMethodName = chain.names[factoryMethodIndex];
            const returnType = this.resolveReturnType(classFqn, factoryMethodName);
            if (returnType) {
                addEdge(returnType, methodName, edge_kinds_1.EdgeKind.FACTORY_RETURN);
            }
        }
    }
    findFactoryMethodIndex(names, classFqn) {
        for (let i = names.length - 2; i >= 0; i--) {
            const name = names[i];
            if (typeof name !== 'string')
                continue;
            if (this.isFactoryMethod(name) && this.hasReturnType(classFqn, name)) {
                return i;
            }
        }
        return -1;
    }
    isFactoryMethod(methodName) {
        return factory_patterns_1.FactoryPattern.METHOD_PREFIXES.some(prefix => methodName.startsWith(prefix));
    }
    hasReturnType(classFqn, methodName) {
        const lookupKey = (0, canonical_1.canonKey)(classFqn, methodName);
        if (this.factoryReturnByClassMethod.has(lookupKey))
            return true;
        const factoryClass = factory_resolver_1.FactoryResolver.factoryClassFor(classFqn, this.ownerToFactory);
        if (factoryClass) {
            const factoryLookupKey = (0, canonical_1.canonKey)(factoryClass, methodName);
            return this.factoryReturnByClassMethod.has(factoryLookupKey);
        }
        return false;
    }
    resolveReturnType(classFqn, factoryMethodName) {
        const factoryClass = factory_resolver_1.FactoryResolver.factoryClassFor(classFqn, this.ownerToFactory);
        if (!factoryClass)
            return null;
        const lookupKey = (0, canonical_1.canonKey)(factoryClass, factoryMethodName);
        return this.factoryReturnByClassMethod.get(lookupKey) || null;
    }
}
exports.FactoryCallHandler = FactoryCallHandler;
//# sourceMappingURL=factory-call-handler.js.map