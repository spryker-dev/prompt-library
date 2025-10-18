"use strict";
// Backward compatibility wrapper - re-exports all constants
// This allows old code to keep working while we migrate to direct imports
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerConfig = void 0;
const git_constants_1 = require("./git-constants");
const file_constants_1 = require("./file-constants");
const change_constants_1 = require("./change-constants");
const php_constants_1 = require("./php-constants");
const spryker_constants_1 = require("../../spryker/constants/spryker-constants");
const risk_constants_1 = require("../../reporting/constants/risk-constants");
const version_constants_1 = require("../../reporting/constants/version-constants");
const changelog_types_1 = require("../../reporting/constants/changelog-types");
class AnalyzerConfig {
}
exports.AnalyzerConfig = AnalyzerConfig;
AnalyzerConfig.gitStatus = {
    ...git_constants_1.GitStatus,
    added: git_constants_1.GitStatus.ADDED,
    deleted: git_constants_1.GitStatus.DELETED,
    modified: git_constants_1.GitStatus.MODIFIED,
    renamed: git_constants_1.GitStatus.RENAMED,
    copied: git_constants_1.GitStatus.COPIED,
};
AnalyzerConfig.fileExtensions = file_constants_1.FileExtension;
AnalyzerConfig.patterns = {
    methodSignature: php_constants_1.PhpPattern.METHOD_SIGNATURE,
    diffMethodSignature: php_constants_1.PhpPattern.DIFF_METHOD_SIGNATURE,
    visibilityModifier: php_constants_1.PhpPattern.VISIBILITY_MODIFIER,
    closingBrace: php_constants_1.PhpPattern.CLOSING_BRACE,
    className: php_constants_1.PhpPattern.CLASS_NAME,
    namespace: php_constants_1.PhpPattern.NAMESPACE,
    classNameFromPath: php_constants_1.PhpPattern.CLASS_NAME_FROM_PATH,
    testDirectory: file_constants_1.FilePattern.TEST_DIRECTORY,
    transferSchema: new RegExp(file_constants_1.FilePattern.TRANSFER_XML.replace(/\./g, '\\.')),
    sprykerFilePath: spryker_constants_1.PublicApiPattern.SPRYKER_FILE_PATH,
};
AnalyzerConfig.spryker = {
    vendors: spryker_constants_1.SprykerVendors,
    layers: spryker_constants_1.SprykerLayers,
    namespaceSeparator: spryker_constants_1.SprykerSeparator.NAMESPACE,
    pathSeparator: spryker_constants_1.SprykerSeparator.PATH,
    publicApiClassSuffixes: spryker_constants_1.PublicApiClassSuffixes,
    publicApiPatterns: { plugin: spryker_constants_1.PublicApiPattern.PLUGIN },
    internalApiLayers: spryker_constants_1.InternalApiLayers,
    communicationLayerClasses: {
        ...spryker_constants_1.CommunicationLayerClass,
        controller: spryker_constants_1.CommunicationLayerClass.CONTROLLER,
        form: spryker_constants_1.CommunicationLayerClass.FORM,
        table: spryker_constants_1.CommunicationLayerClass.TABLE,
    },
};
AnalyzerConfig.phpKeywords = {
    static: 'static',
};
AnalyzerConfig.filePatterns = {
    composerJson: file_constants_1.FilePattern.COMPOSER_JSON,
    config: file_constants_1.FilePattern.CONFIG,
    configFile: file_constants_1.FilePattern.CONFIG_FILE,
    schemaXml: file_constants_1.FilePattern.SCHEMA_XML,
    interfaceSuffix: file_constants_1.FilePattern.INTERFACE_SUFFIX,
    phpExtension: file_constants_1.FileExtension.PHP,
    yamlExt: '.yml',
    yamlExtAlt: '.yaml',
};
AnalyzerConfig.changeTypes = {
    ...change_constants_1.ChangeType,
    new: change_constants_1.ChangeType.NEW,
    modified: change_constants_1.ChangeType.MODIFIED,
    removed: change_constants_1.ChangeType.REMOVED,
    added: change_constants_1.ChangeType.ADDED,
    deleted: change_constants_1.ChangeType.DELETED,
    none: change_constants_1.ChangeType.NONE,
};
AnalyzerConfig.internalChangeTypes = change_constants_1.InternalChangeType;
AnalyzerConfig.versionChangeTypes = change_constants_1.VersionChangeType;
AnalyzerConfig.constraintChangeTypes = change_constants_1.ConstraintChangeType;
AnalyzerConfig.transferChangeTypes = change_constants_1.TransferChangeType;
AnalyzerConfig.composerKeys = php_constants_1.ComposerKey;
AnalyzerConfig.schemaTags = {
    ...php_constants_1.SchemaTag,
    table: php_constants_1.SchemaTag.TABLE,
    column: php_constants_1.SchemaTag.COLUMN,
    index: php_constants_1.SchemaTag.INDEX,
    indexName: php_constants_1.SchemaTag.INDEX_NAME,
    indexClose: php_constants_1.SchemaTag.INDEX_CLOSE,
    indexColumn: php_constants_1.SchemaTag.INDEX_COLUMN,
};
AnalyzerConfig.xmlAttributes = {
    ...php_constants_1.XmlAttribute,
    strict: php_constants_1.XmlAttribute.STRICT,
    trueValue: php_constants_1.XmlAttribute.TRUE_VALUE,
};
AnalyzerConfig.xmlPatterns = php_constants_1.XmlPattern;
AnalyzerConfig.diffMarkers = {
    ...git_constants_1.DiffMarkers,
    newFile: git_constants_1.DiffMarkers.NEW_FILE,
    deletedFile: git_constants_1.DiffMarkers.DELETED_FILE,
    blockMarker: git_constants_1.DiffMarkers.BLOCK_MARKER,
    orOperator: git_constants_1.DiffMarkers.OR_OPERATOR,
};
AnalyzerConfig.diffPrefixes = git_constants_1.DiffPrefixes;
AnalyzerConfig.diffPrefixChars = {
    added: git_constants_1.DiffPrefixes.ADDITION,
    removed: git_constants_1.DiffPrefixes.REMOVAL,
    unchanged: git_constants_1.DiffPrefixes.CONTEXT,
    addition: git_constants_1.DiffPrefixes.ADDITION,
    removal: git_constants_1.DiffPrefixes.REMOVAL,
    additionFileMarker: git_constants_1.DiffPrefixes.ADDITION_FILE,
    removalFileMarker: git_constants_1.DiffPrefixes.REMOVAL_FILE,
};
AnalyzerConfig.diffSettings = git_constants_1.DiffSettings;
AnalyzerConfig.defaultModulePatterns = spryker_constants_1.DefaultModulePatterns;
AnalyzerConfig.relevantNonPhpExtensions = file_constants_1.RelevantNonPhpExtensions;
AnalyzerConfig.riskLevels = {
    ...risk_constants_1.RiskLevel,
    high: risk_constants_1.RiskLevel.HIGH,
    medium: risk_constants_1.RiskLevel.MEDIUM,
    low: risk_constants_1.RiskLevel.LOW,
};
AnalyzerConfig.riskThresholds = {
    ...risk_constants_1.RiskThreshold,
    modifiedConfigMethodsHigh: risk_constants_1.RiskThreshold.MODIFIED_CONFIG_METHODS_HIGH,
    newPublicAPIMedium: risk_constants_1.RiskThreshold.NEW_PUBLIC_API_MEDIUM,
    internalWithImpactMedium: risk_constants_1.RiskThreshold.INTERNAL_WITH_IMPACT_MEDIUM,
};
AnalyzerConfig.versionBumpTypes = {
    ...version_constants_1.VersionBumpType,
    major: version_constants_1.VersionBumpType.MAJOR,
    minor: version_constants_1.VersionBumpType.MINOR,
    patch: version_constants_1.VersionBumpType.PATCH,
};
AnalyzerConfig.changelogTypes = {
    ...changelog_types_1.ChangelogType,
    method: changelog_types_1.ChangelogType.METHOD,
    plugin: changelog_types_1.ChangelogType.PLUGIN,
    class: changelog_types_1.ChangelogType.CLASS,
    constant: changelog_types_1.ChangelogType.CONSTANT,
    transfer: changelog_types_1.ChangelogType.TRANSFER,
    schema: changelog_types_1.ChangelogType.SCHEMA,
    composer: changelog_types_1.ChangelogType.COMPOSER,
    config: changelog_types_1.ChangelogType.CONFIG,
};
AnalyzerConfig.changelogActions = {
    ...changelog_types_1.ChangelogAction,
    added: changelog_types_1.ChangelogAction.ADDED,
    removed: changelog_types_1.ChangelogAction.REMOVED,
    modified: changelog_types_1.ChangelogAction.MODIFIED,
    improved: changelog_types_1.ChangelogAction.IMPROVED,
    adjusted: changelog_types_1.ChangelogAction.ADJUSTED,
    deprecated: changelog_types_1.ChangelogAction.DEPRECATED,
};
AnalyzerConfig.visibility = {
    public: 'public',
    protected: 'protected',
    private: 'private',
};
AnalyzerConfig.visibilityModifiers = {
    public: 'public',
    protected: 'protected',
    private: 'private',
};
AnalyzerConfig.diffBlockMarker = git_constants_1.DiffMarkers.BLOCK_MARKER;
AnalyzerConfig.skipReasons = {
    emptyDiff: 'Empty diff',
    noClassName: 'No class name found',
    unknownError: 'Unknown error',
};
AnalyzerConfig.getEntrypointPattern = spryker_constants_1.getEntrypointPattern;
//# sourceMappingURL=analyzer-config.js.map