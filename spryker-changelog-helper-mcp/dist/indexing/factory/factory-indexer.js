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
exports.FactoryIndexer = void 0;
const fs = __importStar(require("fs"));
const name_resolver_1 = require("../../utils/name-resolver");
const canonical_1 = require("../../utils/canonical");
const factory_method_detector_1 = require("./factory-method-detector");
const return_type_extractor_1 = require("./return-type-extractor");
const method_annotation_parser_1 = require("./method-annotation-parser");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
class FactoryIndexer {
    constructor(parser, logger) {
        this.parser = parser;
        this.logger = logger;
        this.returnTypeExtractor = new return_type_extractor_1.ReturnTypeExtractor(parser);
        this.annotationParser = new method_annotation_parser_1.MethodAnnotationParser(this.returnTypeExtractor, logger);
    }
    async indexFactoryReturnTypes(files) {
        const factoryReturnByClassMethod = new Map();
        for (const filePath of files) {
            await this.processFile(filePath, factoryReturnByClassMethod);
        }
        return { factoryReturnByClassMethod };
    }
    async processFile(filePath, factoryReturnByClassMethod) {
        const ast = await this.parseFile(filePath);
        if (!ast)
            return;
        let currentNamespace = '';
        let currentUses = {};
        this.parser.walk(ast, (node) => {
            this.updateNamespaceContext(node, currentNamespace, currentUses, (ns, uses) => {
                currentNamespace = ns;
                currentUses = uses;
            });
            if (node.kind === ast_node_kinds_1.AstNodeKind.CLASS) {
                this.processClass(node, currentNamespace, currentUses, factoryReturnByClassMethod);
            }
        });
    }
    async parseFile(filePath) {
        const code = fs.readFileSync(filePath, 'utf8');
        try {
            return this.parser.parseCode(code, filePath);
        }
        catch {
            return null;
        }
    }
    updateNamespaceContext(node, currentNamespace, currentUses, updateCallback) {
        if (node.kind === ast_node_kinds_1.AstNodeKind.NAMESPACE) {
            const newNamespace = name_resolver_1.NameResolver.nsNameToString(node.name);
            updateCallback(newNamespace, {});
            return;
        }
        if (node.kind === ast_node_kinds_1.AstNodeKind.USE_ITEM) {
            name_resolver_1.NameResolver.addUseItemToMap(node, currentNamespace, currentUses);
            return;
        }
        if (node.kind === ast_node_kinds_1.AstNodeKind.USE_GROUP) {
            const baseName = name_resolver_1.NameResolver.nsNameToString(node.name);
            const base = baseName.startsWith('\\') ? baseName : '\\' + baseName;
            for (const item of (node.items || [])) {
                name_resolver_1.NameResolver.addUseItemToMap(item, currentNamespace, currentUses, base);
            }
        }
    }
    processClass(classNode, currentNamespace, currentUses, factoryReturnByClassMethod) {
        const className = classNode.name ? String(classNode.name.name) : null;
        if (!className)
            return;
        const classFqn = (0, canonical_1.ensureFqn)(currentNamespace ? `${currentNamespace}\\${className}` : className);
        this.annotationParser.extractAnnotations(classNode, classFqn, currentNamespace, currentUses, factoryReturnByClassMethod);
        if (!factory_method_detector_1.FactoryMethodDetector.isFactoryClass(classFqn))
            return;
        if (!Array.isArray(classNode.body))
            return;
        for (const statement of classNode.body) {
            if (statement.kind === ast_node_kinds_1.AstNodeKind.METHOD) {
                this.processFactoryMethod(statement, classFqn, currentNamespace, currentUses, factoryReturnByClassMethod);
            }
        }
    }
    processFactoryMethod(method, classFqn, currentNamespace, currentUses, factoryReturnByClassMethod) {
        const methodName = method.name ? String(method.name.name) : '';
        if (!factory_method_detector_1.FactoryMethodDetector.isFactoryMethod(methodName))
            return;
        const returnType = this.returnTypeExtractor.extractReturnType(method, currentNamespace, currentUses);
        if (returnType) {
            this.registerReturnType(classFqn, methodName, returnType, factoryReturnByClassMethod);
        }
    }
    registerReturnType(classFqn, methodName, returnType, factoryReturnByClassMethod) {
        const key = (0, canonical_1.canonKey)(classFqn, methodName);
        const normalizedReturnType = (0, canonical_1.ensureFqn)(returnType);
        factoryReturnByClassMethod.set(key, normalizedReturnType);
        this.logger?.('[factory-return]', key, '=>', normalizedReturnType);
    }
}
exports.FactoryIndexer = FactoryIndexer;
//# sourceMappingURL=factory-indexer.js.map