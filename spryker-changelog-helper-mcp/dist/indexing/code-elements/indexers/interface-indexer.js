"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceIndexer = void 0;
const canonical_1 = require("../../../utils/canonical");
const method_indexer_1 = require("./method-indexer");
const ast_node_kinds_1 = require("../../constants/ast-node-kinds");
class InterfaceIndexer {
    constructor(logger) {
        this.logger = logger;
        this.methodIndexer = new method_indexer_1.MethodIndexer(logger);
    }
    indexInterface(interfaceNode, filePath, currentNamespace, methods) {
        const interfaceName = this.extractInterfaceName(interfaceNode);
        if (!interfaceName)
            return null;
        const fqn = this.buildFullyQualifiedName(currentNamespace, interfaceName);
        this.indexInterfaceMethods(interfaceNode, fqn, filePath, methods);
        this.logInterface(fqn, filePath);
        return fqn;
    }
    extractInterfaceName(interfaceNode) {
        return interfaceNode.name ? String(interfaceNode.name.name) : null;
    }
    buildFullyQualifiedName(namespace, name) {
        return (0, canonical_1.ensureFqn)(namespace ? `${namespace}\\${name}` : name);
    }
    indexInterfaceMethods(interfaceNode, fqn, filePath, methods) {
        if (!Array.isArray(interfaceNode.body))
            return;
        for (const statement of interfaceNode.body) {
            if (statement.kind !== ast_node_kinds_1.AstNodeKind.METHOD)
                continue;
            this.methodIndexer.indexMethod(statement, fqn, filePath, methods, true);
        }
    }
    logInterface(fqn, filePath) {
        this.logger?.('[interface]', fqn, '@', filePath);
    }
}
exports.InterfaceIndexer = InterfaceIndexer;
//# sourceMappingURL=interface-indexer.js.map