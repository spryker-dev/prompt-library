// Backward compatibility wrapper - re-exports all constants
// This allows old code to keep working while we migrate to direct imports

import { GitStatus, DiffMarkers, DiffPrefixes, DiffSettings } from './git-constants';
import { FileExtension, FilePattern, RelevantNonPhpExtensions } from './file-constants';
import { ChangeType, InternalChangeType, VersionChangeType, ConstraintChangeType, TransferChangeType } from './change-constants';
import { PhpPattern, XmlPattern, SchemaTag, XmlAttribute, ComposerKey } from './php-constants';
import { SprykerVendors, SprykerLayers, InternalApiLayers, CommunicationLayerClass, SprykerSeparator, PublicApiClassSuffixes, PublicApiPattern, getEntrypointPattern, DefaultModulePatterns } from '../../spryker/constants/spryker-constants';
import { RiskLevel, RiskThreshold } from '../../reporting/constants/risk-constants';
import { VersionBumpType } from '../../reporting/constants/version-constants';
import { ChangelogType, ChangelogAction } from '../../reporting/constants/changelog-types';

export class AnalyzerConfig {
  static readonly gitStatus = {
    ...GitStatus,
    added: GitStatus.ADDED,
    deleted: GitStatus.DELETED,
    modified: GitStatus.MODIFIED,
    renamed: GitStatus.RENAMED,
    copied: GitStatus.COPIED,
  };
  static readonly fileExtensions = FileExtension;
  static readonly patterns = {
    methodSignature: PhpPattern.METHOD_SIGNATURE,
    diffMethodSignature: PhpPattern.DIFF_METHOD_SIGNATURE,
    visibilityModifier: PhpPattern.VISIBILITY_MODIFIER,
    closingBrace: PhpPattern.CLOSING_BRACE,
    className: PhpPattern.CLASS_NAME,
    namespace: PhpPattern.NAMESPACE,
    classNameFromPath: PhpPattern.CLASS_NAME_FROM_PATH,
    testDirectory: FilePattern.TEST_DIRECTORY,
    transferSchema: new RegExp(FilePattern.TRANSFER_XML.replace(/\./g, '\\.')),
    sprykerFilePath: PublicApiPattern.SPRYKER_FILE_PATH,
  };
  
  static readonly spryker = {
    vendors: SprykerVendors,
    layers: SprykerLayers,
    namespaceSeparator: SprykerSeparator.NAMESPACE,
    pathSeparator: SprykerSeparator.PATH,
    publicApiClassSuffixes: PublicApiClassSuffixes,
    publicApiPatterns: { plugin: PublicApiPattern.PLUGIN },
    internalApiLayers: InternalApiLayers,
    communicationLayerClasses: {
      ...CommunicationLayerClass,
      controller: CommunicationLayerClass.CONTROLLER,
      form: CommunicationLayerClass.FORM,
      table: CommunicationLayerClass.TABLE,
    },
  };
  
  static readonly phpKeywords = {
    static: 'static',
  };
  
  static readonly filePatterns = {
    composerJson: FilePattern.COMPOSER_JSON,
    config: FilePattern.CONFIG,
    configFile: FilePattern.CONFIG_FILE,
    schemaXml: FilePattern.SCHEMA_XML,
    interfaceSuffix: FilePattern.INTERFACE_SUFFIX,
    phpExtension: FileExtension.PHP,
    yamlExt: '.yml',
    yamlExtAlt: '.yaml',
  };
  
  static readonly changeTypes = {
    ...ChangeType,
    new: ChangeType.NEW,
    modified: ChangeType.MODIFIED,
    removed: ChangeType.REMOVED,
    added: ChangeType.ADDED,
    deleted: ChangeType.DELETED,
    none: ChangeType.NONE,
  };
  static readonly internalChangeTypes = InternalChangeType;
  static readonly versionChangeTypes = VersionChangeType;
  static readonly constraintChangeTypes = ConstraintChangeType;
  static readonly transferChangeTypes = TransferChangeType;
  static readonly composerKeys = ComposerKey;
  static readonly schemaTags = {
    ...SchemaTag,
    table: SchemaTag.TABLE,
    column: SchemaTag.COLUMN,
    index: SchemaTag.INDEX,
    indexName: SchemaTag.INDEX_NAME,
    indexClose: SchemaTag.INDEX_CLOSE,
    indexColumn: SchemaTag.INDEX_COLUMN,
  };
  static readonly xmlAttributes = {
    ...XmlAttribute,
    strict: XmlAttribute.STRICT,
    trueValue: XmlAttribute.TRUE_VALUE,
  };
  static readonly xmlPatterns = XmlPattern;
  static readonly diffMarkers = {
    ...DiffMarkers,
    newFile: DiffMarkers.NEW_FILE,
    deletedFile: DiffMarkers.DELETED_FILE,
    blockMarker: DiffMarkers.BLOCK_MARKER,
    orOperator: DiffMarkers.OR_OPERATOR,
  };
  static readonly diffPrefixes = DiffPrefixes;
  static readonly diffPrefixChars = {
    added: DiffPrefixes.ADDITION,
    removed: DiffPrefixes.REMOVAL,
    unchanged: DiffPrefixes.CONTEXT,
    addition: DiffPrefixes.ADDITION,
    removal: DiffPrefixes.REMOVAL,
    additionFileMarker: DiffPrefixes.ADDITION_FILE,
    removalFileMarker: DiffPrefixes.REMOVAL_FILE,
  };
  static readonly diffSettings = DiffSettings;
  static readonly defaultModulePatterns = DefaultModulePatterns;
  static readonly relevantNonPhpExtensions = RelevantNonPhpExtensions;
  static readonly riskLevels = {
    ...RiskLevel,
    high: RiskLevel.HIGH,
    medium: RiskLevel.MEDIUM,
    low: RiskLevel.LOW,
  };
  static readonly riskThresholds = {
    ...RiskThreshold,
    modifiedConfigMethodsHigh: RiskThreshold.MODIFIED_CONFIG_METHODS_HIGH,
    newPublicAPIMedium: RiskThreshold.NEW_PUBLIC_API_MEDIUM,
    internalWithImpactMedium: RiskThreshold.INTERNAL_WITH_IMPACT_MEDIUM,
  };
  static readonly versionBumpTypes = {
    ...VersionBumpType,
    major: VersionBumpType.MAJOR,
    minor: VersionBumpType.MINOR,
    patch: VersionBumpType.PATCH,
  };
  static readonly changelogTypes = {
    ...ChangelogType,
    method: ChangelogType.METHOD,
    plugin: ChangelogType.PLUGIN,
    class: ChangelogType.CLASS,
    constant: ChangelogType.CONSTANT,
    transfer: ChangelogType.TRANSFER,
    schema: ChangelogType.SCHEMA,
    composer: ChangelogType.COMPOSER,
    config: ChangelogType.CONFIG,
  };
  static readonly changelogActions = {
    ...ChangelogAction,
    added: ChangelogAction.ADDED,
    removed: ChangelogAction.REMOVED,
    modified: ChangelogAction.MODIFIED,
    improved: ChangelogAction.IMPROVED,
    adjusted: ChangelogAction.ADJUSTED,
    deprecated: ChangelogAction.DEPRECATED,
  };
  
  static readonly visibility = {
    public: 'public' as const,
    protected: 'protected' as const,
    private: 'private' as const,
  };
  
  static readonly visibilityModifiers = {
    public: 'public' as const,
    protected: 'protected' as const,
    private: 'private' as const,
  };
  
  static readonly diffBlockMarker = DiffMarkers.BLOCK_MARKER;
  
  static readonly skipReasons = {
    emptyDiff: 'Empty diff',
    noClassName: 'No class name found',
    unknownError: 'Unknown error',
  };
  
  static getEntrypointPattern = getEntrypointPattern;
}
