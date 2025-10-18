"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodIndexer = void 0;
const canonical_1 = require("../../../utils/canonical");
const php_doc_parser_1 = require("../parsers/php-doc-parser");
const php_doc_patterns_1 = require("../../constants/php-doc-patterns");
class MethodIndexer {
    constructor(logger) {
        this.logger = logger;
    }
    indexMethod(method, classFqn, filePath, methods, isInterface = false) {
        const methodName = this.extractMethodName(method);
        if (!methodName)
            return;
        const key = (0, canonical_1.canonKey)(classFqn, methodName);
        const metadata = this.createMethodMetadata(method, classFqn, filePath, methodName, isInterface);
        methods.set(key, metadata);
        this.logMethod(key, metadata, isInterface);
    }
    extractMethodName(method) {
        return method.name ? String(method.name.name) : null;
    }
    createMethodMetadata(method, classFqn, filePath, methodName, isInterface) {
        const docText = php_doc_parser_1.PhpDocParser.collectCommentText(method);
        const phpDoc = php_doc_parser_1.PhpDocParser.parse(docText);
        const visibility = method.visibility || php_doc_patterns_1.MethodVisibility.PUBLIC;
        return {
            visibility,
            file: filePath,
            start: method.loc?.start?.line || null,
            end: method.loc?.end?.line || null,
            classFQN: classFqn,
            name: methodName,
            isInterface,
            description: phpDoc.description,
            isApiMethod: phpDoc.isApiMethod,
            isDeprecated: phpDoc.isDeprecated,
        };
    }
    logMethod(key, metadata, isInterface) {
        if (!this.logger)
            return;
        if (isInterface) {
            this.logger('[iface-method]', key);
            return;
        }
        this.logger('[method]', key, 'loc', `${metadata.start}-${metadata.end}`);
    }
}
exports.MethodIndexer = MethodIndexer;
//# sourceMappingURL=method-indexer.js.map