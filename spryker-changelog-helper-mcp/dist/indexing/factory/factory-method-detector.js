"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryMethodDetector = void 0;
const factory_patterns_1 = require("../constants/factory-patterns");
class FactoryMethodDetector {
    static isFactoryClass(fqn) {
        return factory_patterns_1.FactoryPattern.CLASS_SUFFIX.test(String(fqn));
    }
    static isFactoryMethod(methodName) {
        if (!methodName)
            return false;
        return factory_patterns_1.FactoryPattern.METHOD_PREFIXES.some(prefix => methodName.startsWith(prefix));
    }
}
exports.FactoryMethodDetector = FactoryMethodDetector;
//# sourceMappingURL=factory-method-detector.js.map