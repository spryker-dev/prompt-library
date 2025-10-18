export const PhpPattern = {
  METHOD_SIGNATURE: /^\s*(?:public|protected|private)?\s*(?:static\s+)?function\s+(\w+)/,
  DIFF_METHOD_SIGNATURE: /^([+ -])\s*(public|protected|private)\s+(?:static\s+)?function\s+(\w+)\s*\(/,
  VISIBILITY_MODIFIER: /^\s*(public|protected|private)/,
  CLOSING_BRACE: /^\s*}\s*$/,
  CLASS_NAME: /class\s+(\w+)/,
  NAMESPACE: /namespace\s+([\w\\]+)/,
  CLASS_NAME_FROM_PATH: /\/([^\/]+)\.php$/,
} as const;

export const XmlPattern = {
  TRANSFER_OPEN: /<transfer\s+name="([^"]+)"/g,
  TRANSFER_CLOSE: '</transfer>',
  PROPERTY_OPEN: /<property\s+name="([^"]+)"/g,
} as const;

export const SchemaTag = {
  COLUMN: '<column name=',
  INDEX: '<index',
  INDEX_NAME: '<index name=',
  INDEX_CLOSE: '</index>',
  INDEX_COLUMN: '<index-column name=',
  TABLE: '<table name=',
} as const;

export const XmlAttribute = {
  STRICT: 'strict=',
  TRUE_VALUE: 'true',
} as const;

export const TransferSchema = {
  PROPERTY_TAG: 'property',
  NAME_ATTRIBUTE: 'name',
  TYPE_ATTRIBUTE: 'type',
} as const;

export const ComposerKey = {
  REQUIRE: 'require',
  REQUIRE_DEV: 'require-dev',
  PHP: 'php',
} as const;
