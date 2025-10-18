"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPDocAnnotation = exports.SkipReason = exports.ChangelogDetail = exports.ChangelogAction = exports.ChangelogType = exports.ConfidenceLevel = exports.VersionBumpType = exports.RiskThreshold = exports.RiskLevel = exports.DefaultModulePatterns = exports.PublicApiPattern = exports.PublicApiClassSuffixes = exports.PublicApiClassSuffix = exports.SprykerSeparator = exports.CommunicationLayerClass = exports.InternalApiLayers = exports.InternalApiLayer = exports.SprykerLayers = exports.SprykerLayer = exports.SprykerVendors = exports.SprykerVendor = exports.ComposerKey = exports.TransferSchema = exports.XmlAttribute = exports.SchemaTag = exports.XmlPattern = exports.PhpPattern = exports.TransferChangeType = exports.ConstraintChangeType = exports.VersionChangeType = exports.InternalChangeType = exports.ChangeType = exports.RelevantNonPhpExtensions = exports.FilePattern = exports.FileExtension = exports.DiffSettings = exports.DiffPrefixes = exports.DiffMarkers = exports.GitStatus = void 0;
exports.getEntrypointPattern = getEntrypointPattern;
// Git constants
exports.GitStatus = {
    ADDED: 'A',
    DELETED: 'D',
    MODIFIED: 'M',
    RENAMED: 'R',
    COPIED: 'C',
};
exports.DiffMarkers = {
    NEW_FILE: 'new file mode',
    DELETED_FILE: 'deleted file mode',
    BLOCK_MARKER: '@@',
    OR_OPERATOR: '||',
};
exports.DiffPrefixes = {
    ADDITION: '+',
    REMOVAL: '-',
    ADDITION_FILE: '+++',
    REMOVAL_FILE: '---',
    CONTEXT: ' ',
};
exports.DiffSettings = {
    CONTEXT_LINES: 10,
};
// File constants
exports.FileExtension = {
    PHP: '.php',
    XML: '.xml',
    YML: '.yml',
    YAML: '.yaml',
    JSON: '.json',
    TWIG: '.twig',
    MARKDOWN: '.md',
    TEXT: '.txt',
    CSV: '.csv',
};
exports.FilePattern = {
    CONFIG: 'Config.php',
    COMPOSER_JSON: 'composer.json',
    CONFIG_FILE: 'config.',
    INTERFACE_SUFFIX: 'Interface',
    SCHEMA_XML: '.schema.xml',
    TRANSFER_XML: '.transfer.xml',
    TEST_DIRECTORY: /\/tests?\//i,
};
exports.RelevantNonPhpExtensions = [
    exports.FileExtension.XML,
    exports.FileExtension.YML,
    exports.FileExtension.YAML,
    exports.FileExtension.JSON,
    exports.FileExtension.TWIG,
    exports.FileExtension.MARKDOWN,
    exports.FileExtension.TEXT,
    exports.FileExtension.CSV,
];
// Change type constants
exports.ChangeType = {
    NEW: 'new',
    MODIFIED: 'modified',
    REMOVED: 'removed',
    ADDED: 'added',
    DELETED: 'deleted',
    NONE: 'none',
};
exports.InternalChangeType = {
    IMPLEMENTATION: 'implementation',
    SIGNATURE: 'signature',
};
exports.VersionChangeType = {
    ADDED: 'added',
    REMOVED: 'removed',
    UPGRADED: 'upgraded',
    DOWNGRADED: 'downgraded',
    UNCHANGED: 'unchanged',
};
exports.ConstraintChangeType = {
    MAJOR: 'major',
    MINOR: 'minor',
    PATCH: 'patch',
    RELAXED: 'relaxed',
    TIGHTENED: 'tightened',
    UNCHANGED: 'unchanged',
};
exports.TransferChangeType = {
    STRICT_ADDED: 'strictAdded',
    STRICT_REMOVED: 'strictRemoved',
    PROPERTY_ADDED: 'propertyAdded',
    PROPERTY_REMOVED: 'propertyRemoved',
    PROPERTY_MODIFIED: 'propertyModified',
};
// PHP patterns
exports.PhpPattern = {
    METHOD_SIGNATURE: /^\s*(?:public|protected|private)?\s*(?:static\s+)?function\s+(\w+)/,
    DIFF_METHOD_SIGNATURE: /^([+ -])\s*(public|protected|private)\s+(?:static\s+)?function\s+(\w+)\s*\(/,
    VISIBILITY_MODIFIER: /^\s*(public|protected|private)/,
    CLOSING_BRACE: /^\s*}\s*$/,
    CLASS_NAME: /class\s+(\w+)/,
    NAMESPACE: /namespace\s+([\w\\]+)/,
    CLASS_NAME_FROM_PATH: /\/([^\/]+)\.php$/,
};
exports.XmlPattern = {
    TRANSFER_OPEN: /<transfer\s+name="([^"]+)"/,
    TRANSFER_CLOSE: '</transfer>',
    PROPERTY_OPEN: /<property\s+name="([^"]+)"/,
};
exports.SchemaTag = {
    COLUMN: '<column name=',
    INDEX: '<index',
    INDEX_NAME: '<index name=',
    INDEX_CLOSE: '</index>',
    INDEX_COLUMN: '<index-column name=',
    TABLE: '<table name=',
};
exports.XmlAttribute = {
    STRICT: 'strict=',
    TRUE_VALUE: 'true',
};
exports.TransferSchema = {
    PROPERTY_TAG: 'property',
    NAME_ATTRIBUTE: 'name',
    TYPE_ATTRIBUTE: 'type',
};
exports.ComposerKey = {
    REQUIRE: 'require',
    REQUIRE_DEV: 'require-dev',
    PHP: 'php',
};
// Spryker constants
exports.SprykerVendor = {
    SPRYKER: 'Spryker',
    SPRYKER_SHOP: 'SprykerShop',
    SPRYKER_FEATURE: 'SprykerFeature',
};
exports.SprykerVendors = [
    exports.SprykerVendor.SPRYKER,
    exports.SprykerVendor.SPRYKER_SHOP,
    exports.SprykerVendor.SPRYKER_FEATURE,
];
exports.SprykerLayer = {
    ZED: 'Zed',
    CLIENT: 'Client',
    SERVICE: 'Service',
    GLUE: 'Glue',
    YVES: 'Yves',
    SHARED: 'Shared',
};
exports.SprykerLayers = [
    exports.SprykerLayer.ZED,
    exports.SprykerLayer.CLIENT,
    exports.SprykerLayer.SERVICE,
    exports.SprykerLayer.GLUE,
    exports.SprykerLayer.YVES,
    exports.SprykerLayer.SHARED,
];
exports.InternalApiLayer = {
    BUSINESS: 'Business',
    COMMUNICATION: 'Communication',
    PERSISTENCE: 'Persistence',
};
exports.InternalApiLayers = [
    exports.InternalApiLayer.BUSINESS,
    exports.InternalApiLayer.COMMUNICATION,
    exports.InternalApiLayer.PERSISTENCE,
];
exports.CommunicationLayerClass = {
    CONTROLLER: 'Controller',
    FORM: 'Form',
    TABLE: 'Table',
};
exports.SprykerSeparator = {
    NAMESPACE: '\\',
    PATH: '/',
};
exports.PublicApiClassSuffix = {
    FACADE: 'Facade',
    CLIENT: 'Client',
    SERVICE: 'Service',
    PLUGIN: 'Plugin',
};
exports.PublicApiClassSuffixes = [
    exports.PublicApiClassSuffix.FACADE,
    exports.PublicApiClassSuffix.CLIENT,
    exports.PublicApiClassSuffix.SERVICE,
    exports.PublicApiClassSuffix.PLUGIN,
];
exports.PublicApiPattern = {
    PLUGIN: /\\Plugin\\|Plugin$/,
    SPRYKER_FILE_PATH: /src\/(Spryker(?:Shop|Feature)?)\/(Zed|Client|Service|Glue|Yves|Shared)\/([^\/]+)\/(.+)\.php$/,
};
function getEntrypointPattern() {
    return `(${exports.PublicApiClassSuffixes.join('|')})$`;
}
exports.DefaultModulePatterns = [
    { detect: '/Bundles/', glob: 'Bundles/{module}/src/**/*.php' },
    { detect: '/Features/', glob: 'Features/{module}/src/**/*.php' },
];
// Risk and version constants
exports.RiskLevel = {
    HIGH: { level: 'HIGH', emoji: '🔴' },
    MEDIUM: { level: 'MEDIUM', emoji: '🟡' },
    LOW: { level: 'LOW', emoji: '🟢' },
};
exports.RiskThreshold = {
    MODIFIED_CONFIG_METHODS_HIGH: 3,
    NEW_PUBLIC_API_MEDIUM: 5,
    INTERNAL_WITH_IMPACT_MEDIUM: 10,
};
exports.VersionBumpType = {
    MAJOR: 'MAJOR',
    MINOR: 'MINOR',
    PATCH: 'PATCH',
};
exports.ConfidenceLevel = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
};
// Changelog constants
exports.ChangelogType = {
    METHOD: 'method',
    PLUGIN: 'plugin',
    CLASS: 'class',
    CONSTANT: 'constant',
    TRANSFER: 'transfer',
    SCHEMA: 'schema',
    COMPOSER: 'composer',
    CONFIG: 'config',
};
exports.ChangelogAction = {
    ADDED: 'added',
    REMOVED: 'removed',
    MODIFIED: 'modified',
    IMPROVED: 'improved',
    ADJUSTED: 'adjusted',
    DEPRECATED: 'deprecated',
};
exports.ChangelogDetail = {
    STRICT: 'strict',
    INDEX: 'index',
};
// Error messages
exports.SkipReason = {
    NO_CLASS_NAME: 'Could not extract class name from file path',
    PARSE_ERROR: 'Failed to parse diff',
    GIT_ERROR: 'Git command failed',
    UNKNOWN_ERROR: 'Unknown error occurred',
    EMPTY_DIFF: 'Empty diff content',
    INVALID_FILE: 'Invalid file format',
};
// PHPDoc annotations (keep as strings since they're used directly)
exports.PHPDocAnnotation = {
    API: '@api',
    DEPRECATED: '@deprecated',
    INHERIT_DOC: '{@inheritDoc}',
    PARAM: '@param',
    RETURN: '@return',
    VAR: '@var',
};
//# sourceMappingURL=all-constants.js.map