import { PhpPattern } from '../constants/php-constants';
import { PublicApiPattern } from '../../spryker/constants/spryker-constants';

export interface MethodDetails {
  visibility: string;
  params: string;
  isStatic: boolean;
}

export class PHPParser {
  extractClassNameFromFilePath(file: string): string | null {
    const match = file.match(PhpPattern.CLASS_NAME_FROM_PATH);
    return match ? match[1] : null;
  }

  buildFQCN(file: string, className: string): string {
    const fullMatch = file.match(PublicApiPattern.SPRYKER_FILE_PATH);
    if (!fullMatch) {
      return '\\' + className;
    }

    const [, vendor, layer, module, path] = fullMatch;
    const segments = path.split('/');
    segments.pop();
    const namespacePath = segments.join('\\');
    
    const parts = ['\\' + vendor, layer, module];
    if (namespacePath) parts.push(namespacePath);
    parts.push(className);
    
    return parts.join('\\');
  }

  extractMethodNameFromLine(line: string): string | null {
    const match = line.match(PhpPattern.METHOD_SIGNATURE);
    return match ? match[1] : null;
  }

  extractMethodDetails(line: string): MethodDetails {
    const visibilityMatch = line.match(/\b(public|protected|private)\b/);
    const visibility = visibilityMatch ? visibilityMatch[1] : 'public';
    const isStatic = line.includes('static');
    const paramsMatch = line.match(/function\s+\w+\s*\((.*?)\)/);
    const params = paramsMatch ? paramsMatch[1].trim() : '';
    return { visibility, params, isStatic };
  }

  isMethodSignatureLine(line: string): boolean {
    return PhpPattern.METHOD_SIGNATURE.test(line);
  }
}
