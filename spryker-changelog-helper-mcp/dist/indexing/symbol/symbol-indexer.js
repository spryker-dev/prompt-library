"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolIndexer = void 0;
const fs = __importStar(require("fs"));
const name_resolver_1 = require("../../utils/name-resolver");
const class_indexer_1 = require("./class-indexer");
const interface_indexer_1 = require("./interface-indexer");
const inherit_doc_resolver_1 = require("./inherit-doc-resolver");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
class SymbolIndexer {
    constructor(parser, logger) {
        this.parser = parser;
        this.classIndexer = new class_indexer_1.ClassIndexer(logger);
        this.interfaceIndexer = new interface_indexer_1.InterfaceIndexer(logger);
        this.inheritDocResolver = new inherit_doc_resolver_1.InheritDocResolver();
    }
    async indexSymbols(files) {
        const classes = new Map();
        const methods = new Map();
        const ownerToFactory = new Map();
        const classImplements = new Map();
        for (const filePath of files) {
            await this.indexFile(filePath, classes, methods, ownerToFactory, classImplements);
        }
        this.inheritDocResolver.resolve(methods, classImplements);
        return { classes, methods, ownerToFactory, classImplements };
    }
    async indexFile(filePath, classes, methods, ownerToFactory, classImplements) {
        const code = fs.readFileSync(filePath, 'utf8');
        const ast = await this.parseCode(code, filePath);
        if (!ast)
            return;
        this.processAst(ast, filePath, classes, methods, ownerToFactory, classImplements);
    }
    async parseCode(code, filePath) {
        try {
            return this.parser.parseCode(code, filePath);
        }
        catch {
            return null;
        }
    }
    processAst(ast, filePath, classes, methods, ownerToFactory, classImplements) {
        let currentNamespace = '';
        let currentUses = {};
        this.parser.walk(ast, (node) => {
            if (node.kind === ast_node_kinds_1.AstNodeKind.NAMESPACE) {
                currentNamespace = name_resolver_1.NameResolver.nsNameToString(node.name);
                currentUses = {};
            }
            if (node.kind === ast_node_kinds_1.AstNodeKind.USE_ITEM) {
                name_resolver_1.NameResolver.addUseItemToMap(node, currentNamespace, currentUses);
            }
            if (node.kind === ast_node_kinds_1.AstNodeKind.USE_GROUP) {
                this.processUseGroup(node, currentNamespace, currentUses);
            }
            if (node.kind === ast_node_kinds_1.AstNodeKind.INTERFACE) {
                const fqn = this.interfaceIndexer.indexInterface(node, filePath, currentNamespace, methods);
                if (fqn) {
                    classes.set(fqn, { file: filePath, kind: 'interface' });
                }
            }
            if (node.kind === ast_node_kinds_1.AstNodeKind.CLASS) {
                this.classIndexer.indexClass(node, filePath, currentNamespace, currentUses, classes, methods, ownerToFactory, classImplements);
            }
        });
    }
    processUseGroup(useGroup, currentNamespace, currentUses) {
        const baseName = name_resolver_1.NameResolver.nsNameToString(useGroup.name);
        const base = baseName.startsWith('\\') ? baseName : '\\' + baseName;
        for (const item of useGroup.items || []) {
            name_resolver_1.NameResolver.addUseItemToMap(item, currentNamespace, currentUses, base);
        }
    }
}
exports.SymbolIndexer = SymbolIndexer;
//# sourceMappingURL=symbol-indexer.js.map