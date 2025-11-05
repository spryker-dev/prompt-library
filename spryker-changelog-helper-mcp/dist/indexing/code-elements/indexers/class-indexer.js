"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassIndexer = void 0;
const canonical_1 = require("../../../utils/canonical");
const name_resolver_1 = require("../../../utils/name-resolver");
const method_indexer_1 = require("./method-indexer");
const php_doc_parser_1 = require("../parsers/php-doc-parser");
const php_doc_patterns_1 = require("../../constants/php-doc-patterns");
const ast_node_kinds_1 = require("../../constants/ast-node-kinds");
class ClassIndexer {
    constructor(logger) {
        this.logger = logger;
        this.methodIndexer = new method_indexer_1.MethodIndexer(logger);
    }
    indexClass(classNode, filePath, currentNamespace, currentUses, classes, methods, ownerToFactory, classImplements) {
        const className = this.extractClassName(classNode);
        if (!className)
            return;
        const fqn = this.buildFullyQualifiedName(currentNamespace, className);
        classes.set(fqn, { file: filePath, kind: ast_node_kinds_1.ClassKind.CLASS });
        this.logClass(fqn, filePath);
        this.indexImplementedInterfaces(classNode, fqn, currentNamespace, currentUses, classImplements);
        this.indexFactoryAnnotation(classNode, fqn, ownerToFactory);
        this.indexClassMethods(classNode, fqn, filePath, methods);
    }
    extractClassName(classNode) {
        return classNode.name ? String(classNode.name.name) : null;
    }
    buildFullyQualifiedName(namespace, name) {
        return (0, canonical_1.ensureFqn)(namespace ? `${namespace}\\${name}` : name);
    }
    indexImplementedInterfaces(classNode, classFqn, currentNamespace, currentUses, classImplements) {
        if (!Array.isArray(classNode.implements) || !classNode.implements.length)
            return;
        for (const interfaceName of classNode.implements) {
            const interfaceFqn = name_resolver_1.NameResolver.resolveName(interfaceName, currentNamespace, currentUses);
            if (!interfaceFqn)
                continue;
            if (!classImplements.has(classFqn)) {
                classImplements.set(classFqn, new Set());
            }
            classImplements.get(classFqn).add(interfaceFqn);
            this.logger?.('[implements]', classFqn, '->', interfaceFqn);
        }
    }
    indexFactoryAnnotation(classNode, classFqn, ownerToFactory) {
        const docText = php_doc_parser_1.PhpDocParser.collectCommentText(classNode);
        const factoryFqn = this.extractFactoryFromDoc(docText);
        if (factoryFqn) {
            ownerToFactory.set(classFqn, factoryFqn);
            this.logger?.('[factory-doc]', classFqn, '->', factoryFqn);
        }
    }
    extractFactoryFromDoc(docText) {
        if (!docText)
            return null;
        const match = docText.match(php_doc_patterns_1.PhpDocPattern.FACTORY_METHOD);
        return match ? '\\' + match[1].replace(/^\\+/, '') : null;
    }
    indexClassMethods(classNode, classFqn, filePath, methods) {
        if (!Array.isArray(classNode.body))
            return;
        for (const statement of classNode.body) {
            if (statement.kind !== ast_node_kinds_1.AstNodeKind.METHOD)
                continue;
            this.methodIndexer.indexMethod(statement, classFqn, filePath, methods, false);
        }
    }
    logClass(fqn, filePath) {
        this.logger?.('[class]', fqn, '@', filePath);
    }
}
exports.ClassIndexer = ClassIndexer;
//# sourceMappingURL=class-indexer.js.map