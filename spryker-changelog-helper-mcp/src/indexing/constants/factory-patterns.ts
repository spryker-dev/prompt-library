export const FactoryPattern = {
  CLASS_SUFFIX: /Factory$/,
  METHOD_PREFIXES: ['create', 'get'],
  METHOD_ANNOTATION: /@method\s+([^\s]+)\s+(\w+)\s*\(/gi,
  RETURN_ANNOTATION: /@return\s+([^\s*]+)/i,
} as const;
