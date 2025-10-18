"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodAnnotationParser = void 0;
const canonical_1 = require("../../utils/canonical");
const factory_patterns_1 = require("../constants/factory-patterns");
const factory_method_detector_1 = require("./factory-method-detector");
class MethodAnnotationParser {
    constructor(returnTypeExtractor, logger) {
        this.returnTypeExtractor = returnTypeExtractor;
        this.logger = logger;
    }
    extractAnnotations(classNode, classFqn, currentNamespace, currentUses, factoryReturnByClassMethod) {
        const classDocText = this.collectCommentText(classNode);
        if (!classDocText)
            return;
        const annotations = this.parseAnnotations(classDocText);
        for (const annotation of annotations) {
            this.processAnnotation(annotation, classFqn, currentNamespace, currentUses, factoryReturnByClassMethod);
        }
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
    parseAnnotations(text) {
        const annotations = [];
        const regex = new RegExp(factory_patterns_1.FactoryPattern.METHOD_ANNOTATION);
        let match;
        while ((match = regex.exec(text)) !== null) {
            annotations.push({
                returnType: match[1],
                methodName: match[2],
            });
        }
        return annotations;
    }
    processAnnotation(annotation, classFqn, currentNamespace, currentUses, factoryReturnByClassMethod) {
        const returnType = this.returnTypeExtractor.resolveTypeString(annotation.returnType, currentNamespace, currentUses);
        if (returnType && factory_method_detector_1.FactoryMethodDetector.isFactoryMethod(annotation.methodName)) {
            this.registerReturnType(classFqn, annotation.methodName, returnType, factoryReturnByClassMethod);
        }
    }
    registerReturnType(classFqn, methodName, returnType, factoryReturnByClassMethod) {
        const key = (0, canonical_1.canonKey)(classFqn, methodName);
        const normalizedReturnType = (0, canonical_1.ensureFqn)(returnType);
        factoryReturnByClassMethod.set(key, normalizedReturnType);
        this.logger?.('[factory-return]', key, '=>', normalizedReturnType);
    }
}
exports.MethodAnnotationParser = MethodAnnotationParser;
//# sourceMappingURL=method-annotation-parser.js.map