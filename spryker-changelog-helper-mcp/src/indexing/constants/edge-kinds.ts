export const EdgeKind = {
  STATIC: 'static',
  INTRA: 'intra',
  THIS_PROPERTY: 'this-prop',
  METHOD: 'method',
  FACTORY_RETURN: 'factory-return',
  INTERFACE_IMPL: 'iface-impl',
} as const;

export type EdgeKindType = typeof EdgeKind[keyof typeof EdgeKind];
