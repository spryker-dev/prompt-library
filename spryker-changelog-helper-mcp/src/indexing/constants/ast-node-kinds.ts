export const AstNodeKind = {
  NAMESPACE: 'namespace',
  USE_ITEM: 'useitem',
  USE_GROUP: 'usegroup',
  CLASS: 'class',
  INTERFACE: 'interface',
  METHOD: 'method',
  PROPERTY: 'property',
  CALL: 'call',
  STATIC_CALL: 'staticcall',
  NEW: 'new',
  VARIABLE: 'variable',
  ASSIGN: 'assign',
  PROPERTY_LOOKUP: 'propertylookup',
  NAME: 'name',
  NULLABLE_TYPE: 'nullabletype',
  RETURN: 'return',
} as const;

export const AstResolution = {
  FQN: 'fqn',
} as const;

export const SpecialVariables = {
  THIS: 'this',
} as const;

export const SelfReferences = {
  SELF: 'self',
  STATIC: 'static',
  PARENT: 'parent',
} as const;

export const SpecialMethods = {
  CONSTRUCT: '__construct',
  GET_FACTORY: 'getFactory',
  GET_BUSINESS_FACTORY: 'getBusinessFactory',
} as const;

export const ClassKind = {
  CLASS: 'class',
  INTERFACE: 'interface',
} as const;

export type AstNodeKindType = typeof AstNodeKind[keyof typeof AstNodeKind];
export type ClassKindType = typeof ClassKind[keyof typeof ClassKind];
