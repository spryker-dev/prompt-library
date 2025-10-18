export declare const GitStatus: {
    readonly ADDED: "A";
    readonly DELETED: "D";
    readonly MODIFIED: "M";
    readonly RENAMED: "R";
    readonly COPIED: "C";
};
export declare const DiffMarkers: {
    readonly NEW_FILE: "new file mode";
    readonly DELETED_FILE: "deleted file mode";
    readonly BLOCK_MARKER: "@@";
    readonly OR_OPERATOR: "||";
};
export declare const DiffPrefixes: {
    readonly ADDITION: "+";
    readonly REMOVAL: "-";
    readonly ADDITION_FILE: "+++";
    readonly REMOVAL_FILE: "---";
    readonly CONTEXT: " ";
};
export declare const DiffSettings: {
    readonly CONTEXT_LINES: 10;
};
export declare const FileExtension: {
    readonly PHP: ".php";
    readonly XML: ".xml";
    readonly YML: ".yml";
    readonly YAML: ".yaml";
    readonly JSON: ".json";
    readonly TWIG: ".twig";
    readonly MARKDOWN: ".md";
    readonly TEXT: ".txt";
    readonly CSV: ".csv";
};
export declare const FilePattern: {
    readonly CONFIG: "Config.php";
    readonly COMPOSER_JSON: "composer.json";
    readonly CONFIG_FILE: "config.";
    readonly INTERFACE_SUFFIX: "Interface";
    readonly SCHEMA_XML: ".schema.xml";
    readonly TRANSFER_XML: ".transfer.xml";
    readonly TEST_DIRECTORY: RegExp;
};
export declare const RelevantNonPhpExtensions: readonly [".xml", ".yml", ".yaml", ".json", ".twig", ".md", ".txt", ".csv"];
export declare const ChangeType: {
    readonly NEW: "new";
    readonly MODIFIED: "modified";
    readonly REMOVED: "removed";
    readonly ADDED: "added";
    readonly DELETED: "deleted";
    readonly NONE: "none";
};
export declare const InternalChangeType: {
    readonly IMPLEMENTATION: "implementation";
    readonly SIGNATURE: "signature";
};
export declare const VersionChangeType: {
    readonly ADDED: "added";
    readonly REMOVED: "removed";
    readonly UPGRADED: "upgraded";
    readonly DOWNGRADED: "downgraded";
    readonly UNCHANGED: "unchanged";
};
export declare const ConstraintChangeType: {
    readonly MAJOR: "major";
    readonly MINOR: "minor";
    readonly PATCH: "patch";
    readonly RELAXED: "relaxed";
    readonly TIGHTENED: "tightened";
    readonly UNCHANGED: "unchanged";
};
export declare const TransferChangeType: {
    readonly STRICT_ADDED: "strictAdded";
    readonly STRICT_REMOVED: "strictRemoved";
    readonly PROPERTY_ADDED: "propertyAdded";
    readonly PROPERTY_REMOVED: "propertyRemoved";
    readonly PROPERTY_MODIFIED: "propertyModified";
};
export declare const PhpPattern: {
    readonly METHOD_SIGNATURE: RegExp;
    readonly DIFF_METHOD_SIGNATURE: RegExp;
    readonly VISIBILITY_MODIFIER: RegExp;
    readonly CLOSING_BRACE: RegExp;
    readonly CLASS_NAME: RegExp;
    readonly NAMESPACE: RegExp;
    readonly CLASS_NAME_FROM_PATH: RegExp;
};
export declare const XmlPattern: {
    readonly TRANSFER_OPEN: RegExp;
    readonly TRANSFER_CLOSE: "</transfer>";
    readonly PROPERTY_OPEN: RegExp;
};
export declare const SchemaTag: {
    readonly COLUMN: "<column name=";
    readonly INDEX: "<index";
    readonly INDEX_NAME: "<index name=";
    readonly INDEX_CLOSE: "</index>";
    readonly INDEX_COLUMN: "<index-column name=";
    readonly TABLE: "<table name=";
};
export declare const XmlAttribute: {
    readonly STRICT: "strict=";
    readonly TRUE_VALUE: "true";
};
export declare const TransferSchema: {
    readonly PROPERTY_TAG: "property";
    readonly NAME_ATTRIBUTE: "name";
    readonly TYPE_ATTRIBUTE: "type";
};
export declare const ComposerKey: {
    readonly REQUIRE: "require";
    readonly REQUIRE_DEV: "require-dev";
    readonly PHP: "php";
};
export declare const SprykerVendor: {
    readonly SPRYKER: "Spryker";
    readonly SPRYKER_SHOP: "SprykerShop";
    readonly SPRYKER_FEATURE: "SprykerFeature";
};
export declare const SprykerVendors: readonly ["Spryker", "SprykerShop", "SprykerFeature"];
export declare const SprykerLayer: {
    readonly ZED: "Zed";
    readonly CLIENT: "Client";
    readonly SERVICE: "Service";
    readonly GLUE: "Glue";
    readonly YVES: "Yves";
    readonly SHARED: "Shared";
};
export declare const SprykerLayers: readonly ["Zed", "Client", "Service", "Glue", "Yves", "Shared"];
export declare const InternalApiLayer: {
    readonly BUSINESS: "Business";
    readonly COMMUNICATION: "Communication";
    readonly PERSISTENCE: "Persistence";
};
export declare const InternalApiLayers: readonly ["Business", "Communication", "Persistence"];
export declare const CommunicationLayerClass: {
    readonly CONTROLLER: "Controller";
    readonly FORM: "Form";
    readonly TABLE: "Table";
};
export declare const SprykerSeparator: {
    readonly NAMESPACE: "\\";
    readonly PATH: "/";
};
export declare const PublicApiClassSuffix: {
    readonly FACADE: "Facade";
    readonly CLIENT: "Client";
    readonly SERVICE: "Service";
    readonly PLUGIN: "Plugin";
};
export declare const PublicApiClassSuffixes: readonly ["Facade", "Client", "Service", "Plugin"];
export declare const PublicApiPattern: {
    readonly PLUGIN: RegExp;
    readonly SPRYKER_FILE_PATH: RegExp;
};
export declare function getEntrypointPattern(): string;
export interface ModulePattern {
    detect: string;
    glob: string;
}
export declare const DefaultModulePatterns: ModulePattern[];
export declare const RiskLevel: {
    readonly HIGH: {
        readonly level: "HIGH";
        readonly emoji: "🔴";
    };
    readonly MEDIUM: {
        readonly level: "MEDIUM";
        readonly emoji: "🟡";
    };
    readonly LOW: {
        readonly level: "LOW";
        readonly emoji: "🟢";
    };
};
export declare const RiskThreshold: {
    readonly MODIFIED_CONFIG_METHODS_HIGH: 3;
    readonly NEW_PUBLIC_API_MEDIUM: 5;
    readonly INTERNAL_WITH_IMPACT_MEDIUM: 10;
};
export declare const VersionBumpType: {
    readonly MAJOR: "MAJOR";
    readonly MINOR: "MINOR";
    readonly PATCH: "PATCH";
};
export declare const ConfidenceLevel: {
    readonly HIGH: "high";
    readonly MEDIUM: "medium";
    readonly LOW: "low";
};
export declare const ChangelogType: {
    readonly METHOD: "method";
    readonly PLUGIN: "plugin";
    readonly CLASS: "class";
    readonly CONSTANT: "constant";
    readonly TRANSFER: "transfer";
    readonly SCHEMA: "schema";
    readonly COMPOSER: "composer";
    readonly CONFIG: "config";
};
export declare const ChangelogAction: {
    readonly ADDED: "added";
    readonly REMOVED: "removed";
    readonly MODIFIED: "modified";
    readonly IMPROVED: "improved";
    readonly ADJUSTED: "adjusted";
    readonly DEPRECATED: "deprecated";
};
export declare const ChangelogDetail: {
    readonly STRICT: "strict";
    readonly INDEX: "index";
};
export declare const SkipReason: {
    readonly NO_CLASS_NAME: "Could not extract class name from file path";
    readonly PARSE_ERROR: "Failed to parse diff";
    readonly GIT_ERROR: "Git command failed";
    readonly UNKNOWN_ERROR: "Unknown error occurred";
    readonly EMPTY_DIFF: "Empty diff content";
    readonly INVALID_FILE: "Invalid file format";
};
export declare const PHPDocAnnotation: {
    readonly API: "@api";
    readonly DEPRECATED: "@deprecated";
    readonly INHERIT_DOC: "{@inheritDoc}";
    readonly PARAM: "@param";
    readonly RETURN: "@return";
    readonly VAR: "@var";
};
//# sourceMappingURL=all-constants.d.ts.map