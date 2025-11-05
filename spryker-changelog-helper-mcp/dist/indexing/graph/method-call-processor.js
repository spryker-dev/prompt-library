"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodCallProcessor = void 0;
const chain_unwrapper_1 = require("../../utils/chain-unwrapper");
const static_call_handler_1 = require("./call-handlers/static-call-handler");
const instance_call_handler_1 = require("./call-handlers/instance-call-handler");
const factory_call_handler_1 = require("./call-handlers/factory-call-handler");
class MethodCallProcessor {
    constructor(ownerToFactory, factoryReturnByClassMethod, interfaceToImplementations, logger) {
        this.staticCallHandler = new static_call_handler_1.StaticCallHandler();
        this.instanceCallHandler = new instance_call_handler_1.InstanceCallHandler(interfaceToImplementations, logger);
        this.factoryCallHandler = new factory_call_handler_1.FactoryCallHandler(ownerToFactory, factoryReturnByClassMethod);
    }
    processStaticCall(staticCall, classFqn, currentNamespace, currentUses, addEdge) {
        this.staticCallHandler.processStaticCall(staticCall, classFqn, currentNamespace, currentUses, addEdge);
    }
    processInstanceCall(call, classFqn, methodName, propertyTypes, localTypes, paramTypes, addEdge) {
        const chain = chain_unwrapper_1.ChainUnwrapper.unwrapChain(call);
        const targetMethodName = chain.tail;
        if (!targetMethodName)
            return;
        this.instanceCallHandler.processDirectCall(chain, classFqn, targetMethodName, addEdge);
        this.instanceCallHandler.processPropertyCall(chain, classFqn, methodName, propertyTypes, targetMethodName, addEdge);
        this.instanceCallHandler.processVariableCall(chain, localTypes, paramTypes, targetMethodName, addEdge);
        this.factoryCallHandler.processFactoryCall(chain, classFqn, targetMethodName, addEdge);
    }
}
exports.MethodCallProcessor = MethodCallProcessor;
//# sourceMappingURL=method-call-processor.js.map