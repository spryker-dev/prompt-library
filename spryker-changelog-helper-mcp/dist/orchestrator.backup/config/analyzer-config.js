"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerConfig = void 0;
// Configuration for diff analysis
class AnalyzerConfig {
    static getEntrypointPattern() {
        return `(${this.spryker.publicApiClassSuffixes.join('|')})$`;
    }
}
exports.AnalyzerConfig = AnalyzerConfig;
// File extensions
AnalyzerConfig.fileExtensions = {
    php: '.php',
    xml: '.xml',
    yml: '.yml',
    yaml: '.yaml',
    json: '.json',
    twig: '.twig',
    markdown: '.md',
    text: '.txt',
    csv: '.csv',
};
// Relevant non-PHP file extensions to track
AnalyzerConfig.relevantNonPhpExtensions = [
    AnalyzerConfig.fileExtensions.xml,
    AnalyzerConfig.fileExtensions.yml,
    AnalyzerConfig.fileExtensions.yaml,
    AnalyzerConfig.fileExtensions.json,
    AnalyzerConfig.fileExtensions.twig,
    AnalyzerConfig.fileExtensions.markdown,
    AnalyzerConfig.fileExtensions.text,
    AnalyzerConfig.fileExtensions.csv,
];
// Git status prefixes
AnalyzerConfig.gitStatus = {
    added: 'A',
    deleted: 'D',
    modified: 'M',
    renamed: 'R',
    copied: 'C',
};
// PHP visibility modifiers
AnalyzerConfig.visibilityModifiers = {
    public: 'public',
    protected: 'protected',
    private: 'private',
};
// PHP keywords
AnalyzerConfig.phpKeywords = {
    function: 'function',
    class: 'class',
    interface: 'interface',
    trait: 'trait',
    namespace: 'namespace',
    use: 'use',
    const: 'const',
    extends: 'extends',
    implements: 'implements',
    static: 'static',
};
// PHPDoc annotations
AnalyzerConfig.phpDocAnnotations = {
    api: '@api',
    deprecated: '@deprecated',
    inheritDoc: '{@inheritDoc}',
    param: '@param',
    return: '@return',
    var: '@var',
};
// Regex patterns
AnalyzerConfig.patterns = {
    methodSignature: /^\s*(?:public|protected|private)?\s*(?:static\s+)?function\s+(\w+)/,
    diffMethodSignature: /^([+ -])\s*(public|protected|private)\s+(?:static\s+)?function\s+(\w+)\s*\(/,
    visibilityModifier: /^\s*(public|protected|private)/,
    closingBrace: /^\s*}\s*$/,
    className: /class\s+(\w+)/,
    namespace: /namespace\s+([\w\\]+)/,
    classNameFromPath: /\/([^\/]+)\.php$/,
    testDirectory: /\/tests?\//i,
    transferSchema: /\.transfer\.xml$/,
    sprykerFilePath: /src\/(Spryker(?:Shop|Feature)?)\/(Zed|Client|Service|Glue|Yves|Shared)\/([^\/]+)\/(.+)\.php$/,
};
AnalyzerConfig.spryker = {
    vendors: ['Spryker', 'SprykerShop', 'SprykerFeature'],
    layers: ['Zed', 'Client', 'Service', 'Glue', 'Yves', 'Shared'],
    namespaceSeparator: '\\',
    pathSeparator: '/',
    publicApiClassSuffixes: ['Facade', 'Client', 'Service', 'Plugin'],
    publicApiPatterns: {
        plugin: /\\Plugin\\|Plugin$/,
    },
    internalApiLayers: ['Business', 'Communication', 'Persistence'],
    communicationLayerClasses: {
        controller: 'Controller',
        form: 'Form',
        table: 'Table',
    },
};
AnalyzerConfig.defaultModulePatterns = [
    { detect: '/Bundles/', glob: 'Bundles/{module}/src/**/*.php' },
    { detect: '/Features/', glob: 'Features/{module}/src/**/*.php' },
];
AnalyzerConfig.riskLevels = {
    high: { level: 'HIGH', emoji: '🔴' },
    medium: { level: 'MEDIUM', emoji: '🟡' },
    low: { level: 'LOW', emoji: '🟢' },
};
AnalyzerConfig.riskThresholds = {
    modifiedConfigMethodsHigh: 3,
    newPublicAPIMedium: 5,
    internalWithImpactMedium: 10,
};
AnalyzerConfig.internalChangeTypes = {
    implementation: 'implementation',
    signature: 'signature',
};
AnalyzerConfig.methodChangeTypes = {
    new: 'new',
    modified: 'modified',
    removed: 'removed',
    added: 'added',
    deleted: 'deleted',
    none: 'none',
};
AnalyzerConfig.visibility = {
    public: 'public',
    protected: 'protected',
    private: 'private',
};
AnalyzerConfig.versionBumpTypes = {
    major: 'MAJOR',
    minor: 'MINOR',
    patch: 'PATCH',
};
AnalyzerConfig.confidenceLevels = {
    high: 'high',
    medium: 'medium',
    low: 'low',
};
AnalyzerConfig.filePatterns = {
    config: 'Config.php',
    composerJson: 'composer.json',
    configFile: 'config.',
    yamlExt: '.yml',
    yamlExtAlt: '.yaml',
    interfaceSuffix: 'Interface',
    schemaXml: '.schema.xml',
    transferXml: '.transfer.xml',
    phpExtension: '.php',
};
AnalyzerConfig.changeTypes = {
    new: 'new',
    modified: 'modified',
    removed: 'removed',
    added: 'added',
    deleted: 'deleted',
    none: 'none',
};
AnalyzerConfig.versionChangeTypes = {
    added: 'added',
    removed: 'removed',
    upgraded: 'upgraded',
    downgraded: 'downgraded',
    unchanged: 'unchanged',
};
AnalyzerConfig.constraintChangeTypes = {
    major: 'major',
    minor: 'minor',
    patch: 'patch',
    relaxed: 'relaxed',
    tightened: 'tightened',
    unchanged: 'unchanged',
};
AnalyzerConfig.diffMarkers = {
    newFile: 'new file mode',
    deletedFile: 'deleted file mode',
    orOperator: '||',
};
AnalyzerConfig.diffPrefixChars = {
    added: '+',
    removed: '-',
    unchanged: ' ',
};
AnalyzerConfig.diffBlockMarker = '@@';
AnalyzerConfig.composerKeys = {
    require: 'require',
    requireDev: 'require-dev',
    php: 'php',
};
AnalyzerConfig.schemaTags = {
    column: '<column name=',
    index: '<index',
    indexName: '<index name=',
    indexClose: '</index>',
    indexColumn: '<index-column name=',
    table: '<table name=',
};
AnalyzerConfig.xmlAttributes = {
    strict: 'strict=',
    trueValue: 'true',
};
AnalyzerConfig.transferChangeTypes = {
    strictAdded: 'strictAdded',
    strictRemoved: 'strictRemoved',
    propertyAdded: 'propertyAdded',
    propertyRemoved: 'propertyRemoved',
    propertyModified: 'propertyModified',
};
AnalyzerConfig.changelogTypes = {
    method: 'method',
    plugin: 'plugin',
    class: 'class',
    constant: 'constant',
    transfer: 'transfer',
    schema: 'schema',
    composer: 'composer',
    config: 'config',
};
AnalyzerConfig.changelogActions = {
    added: 'added',
    removed: 'removed',
    modified: 'modified',
    improved: 'improved',
    adjusted: 'adjusted',
    deprecated: 'deprecated',
};
AnalyzerConfig.changelogDetails = {
    strict: 'strict',
    index: 'index',
};
// Git diff settings
AnalyzerConfig.diffSettings = {
    contextLines: 10,
};
// Skip reasons (for better error reporting)
AnalyzerConfig.skipReasons = {
    noClassName: 'Could not extract class name from file path',
    parseError: 'Failed to parse diff',
    gitError: 'Git command failed',
    unknownError: 'Unknown error occurred',
    emptyDiff: 'Empty diff content',
    invalidFile: 'Invalid file format',
};
// Transfer schema analysis
AnalyzerConfig.transferSchema = {
    propertyTag: 'property',
    nameAttribute: 'name',
    typeAttribute: 'type',
};
// Diff line prefixes
AnalyzerConfig.diffPrefixes = {
    addition: '+',
    removal: '-',
    additionFileMarker: '+++',
    removalFileMarker: '---',
    context: ' ',
};
// XML/Transfer patterns
AnalyzerConfig.xmlPatterns = {
    transferOpen: /<transfer\s+name="([^"]+)"/,
    transferClose: '</transfer>',
    propertyOpen: /<property\s+name="([^"]+)"/,
};
//# sourceMappingURL=analyzer-config.js.map