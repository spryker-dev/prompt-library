import { FullyQualifiedName } from '../../types/domain.types';
import { FactoryPattern } from '../constants/factory-patterns';

export class FactoryMethodDetector {
  static isFactoryClass(fqn: FullyQualifiedName): boolean {
    return FactoryPattern.CLASS_SUFFIX.test(String(fqn));
  }

  static isFactoryMethod(methodName: string): boolean {
    if (!methodName) return false;
    
    return FactoryPattern.METHOD_PREFIXES.some(prefix => 
      methodName.startsWith(prefix)
    );
  }
}
