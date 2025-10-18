export const FileExtension = {
  PHP: '.php',
  XML: '.xml',
  YML: '.yml',
  YAML: '.yaml',
  JSON: '.json',
  TWIG: '.twig',
  JS: '.js',
  TS: '.ts',
  SCSS: '.scss',
  CSS: '.css',
  MARKDOWN: '.md',
  TEXT: '.txt',
  CSV: '.csv',
} as const;

export const FilePattern = {
  CONFIG: 'Config.php',
  COMPOSER_JSON: 'composer.json',
  CONFIG_FILE: 'config.',
  INTERFACE_SUFFIX: 'Interface',
  SCHEMA_XML: '.schema.xml',
  TRANSFER_XML: '.transfer.xml',
  TEST_DIRECTORY: /\/tests?\//i,
} as const;

export const RelevantNonPhpExtensions = [
  FileExtension.XML,
  FileExtension.YML,
  FileExtension.YAML,
  FileExtension.JSON,
  FileExtension.TWIG,
  FileExtension.JS,
  FileExtension.TS,
  FileExtension.SCSS,
  FileExtension.CSS,
  FileExtension.MARKDOWN,
  FileExtension.TEXT,
  FileExtension.CSV,
] as const;

export const FrontendExtensions = [
  FileExtension.TWIG,
  FileExtension.JS,
  FileExtension.TS,
  FileExtension.SCSS,
  FileExtension.CSS,
] as const;
