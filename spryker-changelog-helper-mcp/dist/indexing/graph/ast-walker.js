"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstWalker = void 0;
const name_resolver_1 = require("../../utils/name-resolver");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
class AstWalker {
    constructor(parser) {
        this.parser = parser;
    }
    walkAst(ast, processClass) {
        let currentNamespace = '';
        let currentUses = {};
        this.parser.walk(ast, (node) => {
            if (node.kind === ast_node_kinds_1.AstNodeKind.NAMESPACE) {
                currentNamespace = name_resolver_1.NameResolver.nsNameToString(node.name);
                currentUses = {};
                return;
            }
            if (node.kind === ast_node_kinds_1.AstNodeKind.USE_ITEM) {
                name_resolver_1.NameResolver.addUseItemToMap(node, currentNamespace, currentUses);
                return;
            }
            if (node.kind === ast_node_kinds_1.AstNodeKind.USE_GROUP) {
                this.processUseGroup(node, currentNamespace, currentUses);
                return;
            }
            if (node.kind === ast_node_kinds_1.AstNodeKind.CLASS) {
                processClass(node, currentNamespace, currentUses);
            }
        });
    }
    processUseGroup(node, currentNamespace, currentUses) {
        const baseName = name_resolver_1.NameResolver.nsNameToString(node.name);
        const base = baseName.startsWith('\\') ? baseName : '\\' + baseName;
        for (const item of (node.items || [])) {
            name_resolver_1.NameResolver.addUseItemToMap(item, currentNamespace, currentUses, base);
        }
    }
}
exports.AstWalker = AstWalker;
//# sourceMappingURL=ast-walker.js.map