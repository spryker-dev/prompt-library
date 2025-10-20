"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryCallResolver = void 0;
const chain_unwrapper_1 = require("../../utils/chain-unwrapper");
const canonical_1 = require("../../utils/canonical");
const factory_resolver_1 = require("../factory/factory-resolver");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
const factory_patterns_1 = require("../constants/factory-patterns");
class FactoryCallResolver {
    constructor(ownerToFactory, factoryReturnByClassMethod) {
        this.ownerToFactory = ownerToFactory;
        this.factoryReturnByClassMethod = factoryReturnByClassMethod;
    }
    resolveFactoryCallReturnType(callExpression, classFqn) {
        if (!classFqn)
            return null;
        const chain = chain_unwrapper_1.ChainUnwrapper.unwrapChain(callExpression);
        const names = chain.names;
        if (!this.isFactoryMethodChain(names))
            return null;
        const factoryMethodIndex = this.findFactoryMethodIndex(names);
        if (factoryMethodIndex === -1)
            return null;
        const factoryMethod = names[factoryMethodIndex];
        if (typeof factoryMethod !== 'string')
            return null;
        return this.lookupFactoryReturnType(classFqn, factoryMethod);
    }
    isFactoryMethodChain(names) {
        return names.includes(ast_node_kinds_1.SpecialMethods.GET_FACTORY) ||
            names.includes(ast_node_kinds_1.SpecialMethods.GET_BUSINESS_FACTORY);
    }
    findFactoryMethodIndex(names) {
        for (let i = names.length - 1; i >= 0; i--) {
            const name = names[i];
            if (name === ast_node_kinds_1.SpecialMethods.GET_FACTORY || name === ast_node_kinds_1.SpecialMethods.GET_BUSINESS_FACTORY) {
                break;
            }
            if (typeof name === 'string' && this.isFactoryMethod(name)) {
                return i;
            }
        }
        return -1;
    }
    isFactoryMethod(methodName) {
        return factory_patterns_1.FactoryPattern.METHOD_PREFIXES.some(prefix => methodName.startsWith(prefix));
    }
    lookupFactoryReturnType(classFqn, factoryMethodName) {
        const factoryFqn = factory_resolver_1.FactoryResolver.factoryClassFor(classFqn, this.ownerToFactory);
        if (!factoryFqn)
            return null;
        const lookupKey = (0, canonical_1.canonKey)(factoryFqn, factoryMethodName);
        return this.factoryReturnByClassMethod.get(lookupKey) || null;
    }
}
exports.FactoryCallResolver = FactoryCallResolver;
//# sourceMappingURL=factory-call-resolver.js.map