"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnTypeExtractor = void 0;
const name_resolver_1 = require("../../utils/name-resolver");
const factory_patterns_1 = require("../constants/factory-patterns");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
class ReturnTypeExtractor {
    constructor(parser) {
        this.parser = parser;
    }
    extractReturnType(method, currentNamespace, currentUses) {
        const returnTypeFromCode = this.extractFromCode(method, currentNamespace, currentUses);
        if (returnTypeFromCode)
            return returnTypeFromCode;
        return this.extractFromDocBlock(method, currentNamespace, currentUses);
    }
    extractFromCode(method, currentNamespace, currentUses) {
        const localVariableTypes = new Map();
        let returnType = null;
        this.parser.walk(method, (node) => {
            if (returnType)
                return;
            if (this.isVariableInstantiation(node)) {
                this.trackVariableInstantiation(node, localVariableTypes, currentNamespace, currentUses);
            }
            if (this.isReturnStatement(node)) {
                returnType = this.resolveReturnExpression(node, localVariableTypes, currentNamespace, currentUses);
            }
        });
        return returnType;
    }
    isVariableInstantiation(node) {
        return node.kind === ast_node_kinds_1.AstNodeKind.ASSIGN &&
            node.left?.kind === ast_node_kinds_1.AstNodeKind.VARIABLE &&
            node.right?.kind === ast_node_kinds_1.AstNodeKind.NEW;
    }
    trackVariableInstantiation(node, localVariableTypes, currentNamespace, currentUses) {
        const assign = node;
        const variableName = typeof assign.left.name === 'string'
            ? assign.left.name
            : null;
        const className = name_resolver_1.NameResolver.resolveName(assign.right.what, currentNamespace, currentUses);
        if (variableName && className) {
            localVariableTypes.set(variableName, className);
        }
    }
    isReturnStatement(node) {
        return node.kind === ast_node_kinds_1.AstNodeKind.RETURN && node.expr;
    }
    resolveReturnExpression(node, localVariableTypes, currentNamespace, currentUses) {
        const returnStmt = node;
        const expr = returnStmt.expr;
        if (expr.kind === ast_node_kinds_1.AstNodeKind.NEW) {
            return name_resolver_1.NameResolver.resolveName(expr.what, currentNamespace, currentUses);
        }
        if (expr.kind === ast_node_kinds_1.AstNodeKind.VARIABLE && typeof expr.name === 'string') {
            return localVariableTypes.get(expr.name) || null;
        }
        return null;
    }
    extractFromDocBlock(method, currentNamespace, currentUses) {
        const docText = this.collectCommentText(method);
        return this.extractFromDoc(docText, currentNamespace, currentUses);
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
    extractFromDoc(text, currentNamespace, currentUses) {
        if (!text)
            return null;
        const returnTypeString = this.parseReturnAnnotation(text);
        if (!returnTypeString)
            return null;
        return this.resolveTypeString(returnTypeString, currentNamespace, currentUses);
    }
    parseReturnAnnotation(text) {
        const match = text.match(factory_patterns_1.FactoryPattern.RETURN_ANNOTATION);
        if (!match)
            return null;
        const typeWithUnions = match[1];
        const firstType = typeWithUnions.split('|')[0].trim();
        const typeWithoutArray = firstType.replace(/\[\]$/, '');
        return typeWithoutArray || null;
    }
    resolveTypeString(typeString, currentNamespace, currentUses) {
        const isFullyQualified = typeString.startsWith('\\');
        const nameNode = {
            kind: ast_node_kinds_1.AstNodeKind.NAME,
            name: typeString,
            resolution: isFullyQualified ? ast_node_kinds_1.AstResolution.FQN : null,
        };
        return name_resolver_1.NameResolver.resolveName(nameNode, currentNamespace, currentUses);
    }
}
exports.ReturnTypeExtractor = ReturnTypeExtractor;
//# sourceMappingURL=return-type-extractor.js.map