import { FullyQualifiedName, MethodName, CanonicalKey } from '../types/domain.types';

export function ensureFqn(name: string | FullyQualifiedName): FullyQualifiedName {
  const s = String(name || '');
  return s.startsWith('\\') ? s : '\\' + s;
}

export function canonFqn(name: string | FullyQualifiedName): string {
  const raw = String(name || '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
  const noTrailing = raw.replace(/\\+$/, '');
  const withLeading = noTrailing.startsWith('\\') ? noTrailing : '\\' + noTrailing;
  return withLeading.replace(/\\\\+/g, '\\').toLowerCase();
}

export function canonMethod(methodName: string | MethodName): string {
  return String(methodName || '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, '')
    .replace(/\(\)$/, '')
    .trim()
    .toLowerCase();
}

export function canonKey(fqn: FullyQualifiedName, method: MethodName): CanonicalKey {
  return `${canonFqn(fqn)}::${canonMethod(method)}`;
}

export class CanonicalNameUtils {
  static ensureFqn = ensureFqn;
  static canonFqn = canonFqn;
  static canonMethod = canonMethod;
  static canonKey = canonKey;
}
