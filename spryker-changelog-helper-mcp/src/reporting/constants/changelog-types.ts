export const ChangelogType = {
  METHOD: 'method',
  PLUGIN: 'plugin',
  CLASS: 'class',
  CONSTANT: 'constant',
  TRANSFER: 'transfer',
  SCHEMA: 'schema',
  COMPOSER: 'composer',
  CONFIG: 'config',
} as const;

export const ChangelogAction = {
  ADDED: 'added',
  REMOVED: 'removed',
  MODIFIED: 'modified',
  IMPROVED: 'improved',
  ADJUSTED: 'adjusted',
  DEPRECATED: 'deprecated',
} as const;

export const ChangelogDetail = {
  BREAKING: 'breaking',
  SIGNATURE_CHANGED: 'signature changed',
  VISIBILITY_CHANGED: 'visibility changed',
  RETURN_TYPE_CHANGED: 'return type changed',
  PARAMETERS_CHANGED: 'parameters changed',
} as const;
