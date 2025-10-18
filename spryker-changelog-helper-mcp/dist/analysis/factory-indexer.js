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
const name_resolver_1 = require("../utils/name-resolver");
const canonical_1 = require("../utils/canonical");
class FactoryIndexer {
    constructor(parser, logger) {
        this.parser = parser;
        this.logger = logger;
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
        let currentNs = '';
        let currentUses = {};
        this.parser.walk(ast, (node) => {
            this.updateNamespaceContext(node, currentNs, currentUses, (ns, uses) => {
                currentNs = ns;
                currentUses = uses;
            });
            if (node.kind === 'class') {
                this.processClass(node, currentNs, currentUses, factoryReturnByClassMethod);
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
    updateNamespaceContext(node, currentNs, currentUses, updateCallback) {
        if (node.kind === 'namespace') {
            const newNs = name_resolver_1.NameResolver.nsNameToString(node.name);
            updateCallback(newNs, {});
            return;
        }
        if (node.kind === 'useitem') {
            name_resolver_1.NameResolver.addUseItemToMap(node, currentNs, currentUses);
            return;
        }
        if (node.kind === 'usegroup') {
            const baseName = name_resolver_1.NameResolver.nsNameToString(node.name);
            const base = baseName.startsWith('\\') ? baseName : '\\' + baseName;
            for (const item of (node.items || [])) {
                name_resolver_1.NameResolver.addUseItemToMap(item, currentNs, currentUses, base);
            }
        }
    }
    processClass(classNode, currentNs, currentUses, factoryReturnByClassMethod) {
        const className = classNode.name ? String(classNode.name.name) : null;
        if (!className)
            return;
        const classFqn = (0, canonical_1.ensureFqn)(currentNs ? `${currentNs}\\${className}` : className);
        this.extractMethodAnnotations(classNode, classFqn, currentNs, currentUses, factoryReturnByClassMethod);
        if (!this.isFactoryClass(classFqn))
            return;
        if (!Array.isArray(classNode.body))
            return;
        for (const stmt of classNode.body) {
            if (stmt.kind === 'method') {
                this.processFactoryMethod(stmt, classFqn, currentNs, currentUses, factoryReturnByClassMethod);
            }
        }
    }
    extractMethodAnnotations(classNode, classFqn, currentNs, currentUses, factoryReturnByClassMethod) {
        const classDocText = this.collectCommentText(classNode);
        if (!classDocText)
            return;
        const methodAnnotations = this.parseMethodAnnotations(classDocText);
        for (const annotation of methodAnnotations) {
            const returnType = this.resolveReturnTypeString(annotation.returnType, currentNs, currentUses);
            if (returnType && this.isFactoryMethod(annotation.methodName)) {
                this.registerFactoryReturnType(classFqn, annotation.methodName, returnType, factoryReturnByClassMethod);
            }
        }
    }
    parseMethodAnnotations(text) {
        const annotations = [];
        const methodRegex = /@method\s+([^\s]+)\s+(\w+)\s*\(/gi;
        let match;
        while ((match = methodRegex.exec(text)) !== null) {
            const returnType = match[1];
            const methodName = match[2];
            annotations.push({ returnType, methodName });
        }
        return annotations;
    }
    processFactoryMethod(method, classFqn, currentNs, currentUses, factoryReturnByClassMethod) {
        const methodName = method.name ? String(method.name.name) : '';
        if (!this.isFactoryMethod(methodName))
            return;
        const returnType = this.findReturnType(method, currentNs, currentUses);
        if (returnType) {
            this.registerFactoryReturnType(classFqn, methodName, returnType, factoryReturnByClassMethod);
        }
    }
    isFactoryMethod(methodName) {
        if (!methodName)
            return false;
        return methodName.startsWith('create') || methodName.startsWith('get');
    }
    registerFactoryReturnType(classFqn, methodName, returnType, factoryReturnByClassMethod) {
        const key = (0, canonical_1.canonKey)(classFqn, methodName);
        const normalizedReturnType = (0, canonical_1.ensureFqn)(returnType);
        factoryReturnByClassMethod.set(key, normalizedReturnType);
        this.logger?.('[factory-return]', key, '=>', normalizedReturnType);
    }
    isFactoryClass(fqn) {
        return /Factory$/.test(String(fqn));
    }
    findReturnType(method, currentNs, currentUses) {
        const returnTypeFromCode = this.extractReturnTypeFromCode(method, currentNs, currentUses);
        if (returnTypeFromCode)
            return returnTypeFromCode;
        return this.extractReturnTypeFromDocBlock(method, currentNs, currentUses);
    }
    extractReturnTypeFromCode(method, currentNs, currentUses) {
        const localVariableTypes = new Map();
        let returnType = null;
        this.parser.walk(method, (node) => {
            if (returnType)
                return;
            if (this.isVariableInstantiation(node)) {
                this.trackVariableInstantiation(node, localVariableTypes, currentNs, currentUses);
            }
            if (this.isReturnStatement(node)) {
                returnType = this.resolveReturnExpression(node, localVariableTypes, currentNs, currentUses);
            }
        });
        return returnType;
    }
    isVariableInstantiation(node) {
        return node.kind === 'assign' && node.left?.kind === 'variable' && node.right?.kind === 'new';
    }
    trackVariableInstantiation(node, localVariableTypes, currentNs, currentUses) {
        const assign = node;
        const variableName = typeof assign.left.name === 'string'
            ? assign.left.name
            : null;
        const className = name_resolver_1.NameResolver.resolveName(assign.right.what, currentNs, currentUses);
        if (variableName && className) {
            localVariableTypes.set(variableName, className);
        }
    }
    isReturnStatement(node) {
        return node.kind === 'return' && node.expr;
    }
    resolveReturnExpression(node, localVariableTypes, currentNs, currentUses) {
        const returnStmt = node;
        const expr = returnStmt.expr;
        if (expr.kind === 'new') {
            return name_resolver_1.NameResolver.resolveName(expr.what, currentNs, currentUses);
        }
        if (expr.kind === 'variable' && typeof expr.name === 'string') {
            return localVariableTypes.get(expr.name) || null;
        }
        return null;
    }
    extractReturnTypeFromDocBlock(method, currentNs, currentUses) {
        const docText = this.collectCommentText(method);
        return this.extractReturnFromDoc(docText, currentNs, currentUses);
    }
    collectCommentText(node) {
        const chunks = [];
        if (Array.isArray(node.leadingComments)) {
            chunks.push(...node.leadingComments.map((c) => c.value || ''));
        }
        if (node.doc && typeof node.doc === 'string') {
            chunks.push(node.doc);
        }
        if (Array.isArray(node.comments)) {
            chunks.push(...node.comments.map((c) => c.value || ''));
        }
        return chunks.join('\n');
    }
    extractReturnFromDoc(text, currentNs, currentUses) {
        if (!text)
            return null;
        const returnTypeString = this.parseReturnAnnotation(text);
        if (!returnTypeString)
            return null;
        return this.resolveReturnTypeString(returnTypeString, currentNs, currentUses);
    }
    parseReturnAnnotation(text) {
        const match = text.match(/@return\s+([^\s*]+)/i);
        if (!match)
            return null;
        const typeWithUnions = match[1];
        const firstType = typeWithUnions.split('|')[0].trim();
        const typeWithoutArray = firstType.replace(/\[\]$/, '');
        return typeWithoutArray || null;
    }
    resolveReturnTypeString(typeString, currentNs, currentUses) {
        const isFullyQualified = typeString.startsWith('\\');
        const nameNode = {
            kind: 'name',
            name: typeString,
            resolution: isFullyQualified ? 'fqn' : null,
        };
        return name_resolver_1.NameResolver.resolveName(nameNode, currentNs, currentUses);
    }
}
exports.FactoryIndexer = FactoryIndexer;
//# sourceMappingURL=factory-indexer.js.map