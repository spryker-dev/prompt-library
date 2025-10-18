export const ChangeType = {
  NEW: 'new',
  MODIFIED: 'modified',
  REMOVED: 'removed',
  ADDED: 'added',
  DELETED: 'deleted',
  NONE: 'none',
} as const;

export const InternalChangeType = {
  IMPLEMENTATION: 'implementation',
  SIGNATURE: 'signature',
} as const;

export const VersionChangeType = {
  ADDED: 'added',
  REMOVED: 'removed',
  UPGRADED: 'upgraded',
  DOWNGRADED: 'downgraded',
  UNCHANGED: 'unchanged',
} as const;

export const ConstraintChangeType = {
  MAJOR: 'major',
  MINOR: 'minor',
  PATCH: 'patch',
  RELAXED: 'relaxed',
  TIGHTENED: 'tightened',
  UNCHANGED: 'unchanged',
} as const;

export const TransferChangeType = {
  STRICT_ADDED: 'strictAdded',
  STRICT_REMOVED: 'strictRemoved',
  PROPERTY_ADDED: 'propertyAdded',
  PROPERTY_REMOVED: 'propertyRemoved',
  PROPERTY_MODIFIED: 'propertyModified',
} as const;
