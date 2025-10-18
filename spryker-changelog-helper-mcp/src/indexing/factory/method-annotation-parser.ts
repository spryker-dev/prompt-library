import { Class } from '../../types/ast.types';
import { FullyQualifiedName, CanonicalKey, Logger } from '../../types/domain.types';
import { canonKey, ensureFqn } from '../../utils/canonical';
import { FactoryPattern } from '../constants/factory-patterns';
import { FactoryMethodDetector } from './factory-method-detector';
import { ReturnTypeExtractor } from './return-type-extractor';

interface MethodAnnotation {
  returnType: string;
  methodName: string;
}

export class MethodAnnotationParser {
  constructor(
    private returnTypeExtractor: ReturnTypeExtractor,
    private logger: Logger
  ) {}

  extractAnnotations(
    classNode: Class,
    classFqn: FullyQualifiedName,
    currentNamespace: string,
    currentUses: Record<string, string>,
    factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>
  ): void {
    const classDocText = this.collectCommentText(classNode);
    if (!classDocText) return;

    const annotations = this.parseAnnotations(classDocText);

    for (const annotation of annotations) {
      this.processAnnotation(
        annotation,
        classFqn,
        currentNamespace,
        currentUses,
        factoryReturnByClassMethod
      );
    }
  }

  private collectCommentText(node: any): string {
    const chunks: string[] = [];
    
    if (Array.isArray(node.leadingComments)) {
      chunks.push(...node.leadingComments.map((c: any) => c.value || ''));
    }
    
    if (node.doc && typeof node.doc === 'string') {
      chunks.push(node.doc);
    }
    
    if (Array.isArray(node.comments)) {
      chunks.push(...node.comments.map((c: any) => c.value || ''));
    }
    
    return chunks.join('\n');
  }

  private parseAnnotations(text: string): MethodAnnotation[] {
    const annotations: MethodAnnotation[] = [];
    const regex = new RegExp(FactoryPattern.METHOD_ANNOTATION);
    let match;

    while ((match = regex.exec(text)) !== null) {
      annotations.push({
        returnType: match[1],
        methodName: match[2],
      });
    }

    return annotations;
  }

  private processAnnotation(
    annotation: MethodAnnotation,
    classFqn: FullyQualifiedName,
    currentNamespace: string,
    currentUses: Record<string, string>,
    factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>
  ): void {
    const returnType = this.returnTypeExtractor.resolveTypeString(
      annotation.returnType,
      currentNamespace,
      currentUses
    );

    if (returnType && FactoryMethodDetector.isFactoryMethod(annotation.methodName)) {
      this.registerReturnType(classFqn, annotation.methodName, returnType, factoryReturnByClassMethod);
    }
  }

  private registerReturnType(
    classFqn: FullyQualifiedName,
    methodName: string,
    returnType: FullyQualifiedName,
    factoryReturnByClassMethod: Map<CanonicalKey, FullyQualifiedName>
  ): void {
    const key = canonKey(classFqn, methodName);
    const normalizedReturnType = ensureFqn(returnType);

    factoryReturnByClassMethod.set(key, normalizedReturnType);
    this.logger?.('[factory-return]', key, '=>', normalizedReturnType);
  }
}
