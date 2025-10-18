import { Method } from '../../../types/ast.types';
import { MethodMetadata, CanonicalKey, FullyQualifiedName, Logger } from '../../../types/domain.types';
import { canonKey } from '../../../utils/canonical';
import { PhpDocParser } from '../parsers/php-doc-parser';
import { MethodVisibility } from '../../constants/php-doc-patterns';

export class MethodIndexer {
  constructor(private logger: Logger) {}

  indexMethod(
    method: Method,
    classFqn: FullyQualifiedName,
    filePath: string,
    methods: Map<CanonicalKey, MethodMetadata>,
    isInterface: boolean = false
  ): void {
    const methodName = this.extractMethodName(method);
    if (!methodName) return;

    const key = canonKey(classFqn, methodName);
    const metadata = this.createMethodMetadata(method, classFqn, filePath, methodName, isInterface);
    
    methods.set(key, metadata);
    this.logMethod(key, metadata, isInterface);
  }

  private extractMethodName(method: Method): string | null {
    return method.name ? String(method.name.name) : null;
  }

  private createMethodMetadata(
    method: Method,
    classFqn: FullyQualifiedName,
    filePath: string,
    methodName: string,
    isInterface: boolean
  ): MethodMetadata {
    const docText = PhpDocParser.collectCommentText(method);
    const phpDoc = PhpDocParser.parse(docText);
    const visibility = method.visibility || MethodVisibility.PUBLIC;

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

  private logMethod(key: CanonicalKey, metadata: MethodMetadata, isInterface: boolean): void {
    if (!this.logger) return;

    if (isInterface) {
      this.logger('[iface-method]', key);
      return;
    }
    
    this.logger('[method]', key, 'loc', `${metadata.start}-${metadata.end}`);
  }
}
