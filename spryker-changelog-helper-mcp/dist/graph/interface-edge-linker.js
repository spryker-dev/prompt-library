"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceEdgeLinker = void 0;
const canonical_1 = require("../utils/canonical");
class InterfaceEdgeLinker {
    static linkInterfaceEdges(methods, classImplements, reverseAdjacencyMap) {
        const methodsByClass = new Map();
        for (const [, md] of methods) {
            if (!methodsByClass.has(md.classFQN)) {
                methodsByClass.set(md.classFQN, new Set());
            }
            methodsByClass.get(md.classFQN).add(md.name);
        }
        for (const [classFqn, interfaces] of classImplements) {
            const classMethods = methodsByClass.get(classFqn);
            if (!classMethods)
                continue;
            for (const iface of interfaces) {
                for (const methodName of classMethods) {
                    const classKey = (0, canonical_1.canonKey)(classFqn, methodName);
                    const ifaceKey = (0, canonical_1.canonKey)(iface, methodName);
                    if (!reverseAdjacencyMap.has(classKey)) {
                        reverseAdjacencyMap.set(classKey, new Set());
                    }
                    reverseAdjacencyMap.get(classKey).add(ifaceKey);
                }
            }
        }
    }
}
exports.InterfaceEdgeLinker = InterfaceEdgeLinker;
//# sourceMappingURL=interface-edge-linker.js.map