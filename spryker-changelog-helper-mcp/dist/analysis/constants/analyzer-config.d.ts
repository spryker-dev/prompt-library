import { getEntrypointPattern } from '../../spryker/constants/spryker-constants';
export declare class AnalyzerConfig {
    static readonly gitStatus: {
        added: "A";
        deleted: "D";
        modified: "M";
        renamed: "R";
        copied: "C";
        ADDED: "A";
        DELETED: "D";
        MODIFIED: "M";
        RENAMED: "R";
        COPIED: "C";
    };
    static readonly fileExtensions: {
        readonly PHP: ".php";
        readonly XML: ".xml";
        readonly YML: ".yml";
        readonly YAML: ".yaml";
        readonly JSON: ".json";
        readonly TWIG: ".twig";
        readonly JS: ".js";
        readonly TS: ".ts";
        readonly SCSS: ".scss";
        readonly CSS: ".css";
        readonly MARKDOWN: ".md";
        readonly TEXT: ".txt";
        readonly CSV: ".csv";
    };
    static readonly patterns: {
        methodSignature: RegExp;
        diffMethodSignature: RegExp;
        visibilityModifier: RegExp;
        closingBrace: RegExp;
        className: RegExp;
        namespace: RegExp;
        classNameFromPath: RegExp;
        testDirectory: RegExp;
        transferSchema: RegExp;
        sprykerFilePath: RegExp;
    };
    static readonly spryker: {
        vendors: readonly ["Spryker", "SprykerShop", "SprykerFeature"];
        layers: readonly ["Zed", "Client", "Service", "Glue", "Yves", "Shared"];
        namespaceSeparator: "\\";
        pathSeparator: "/";
        publicApiClassSuffixes: readonly ["Facade", "Client", "Service", "Plugin"];
        publicApiPatterns: {
            plugin: RegExp;
        };
        internalApiLayers: readonly ["Business", "Communication", "Persistence"];
        communicationLayerClasses: {
            controller: "Controller";
            form: "Form";
            table: "Table";
            CONTROLLER: "Controller";
            FORM: "Form";
            TABLE: "Table";
        };
    };
    static readonly phpKeywords: {
        static: string;
    };
    static readonly filePatterns: {
        composerJson: "composer.json";
        config: "Config.php";
        configFile: "config.";
        schemaXml: ".schema.xml";
        interfaceSuffix: "Interface";
        phpExtension: ".php";
        yamlExt: string;
        yamlExtAlt: string;
    };
    static readonly changeTypes: {
        new: "new";
        modified: "modified";
        removed: "removed";
        added: "added";
        deleted: "deleted";
        none: "none";
        NEW: "new";
        MODIFIED: "modified";
        REMOVED: "removed";
        ADDED: "added";
        DELETED: "deleted";
        NONE: "none";
    };
    static readonly internalChangeTypes: {
        readonly IMPLEMENTATION: "implementation";
        readonly SIGNATURE: "signature";
    };
    static readonly versionChangeTypes: {
        readonly ADDED: "added";
        readonly REMOVED: "removed";
        readonly UPGRADED: "upgraded";
        readonly DOWNGRADED: "downgraded";
        readonly UNCHANGED: "unchanged";
    };
    static readonly constraintChangeTypes: {
        readonly MAJOR: "major";
        readonly MINOR: "minor";
        readonly PATCH: "patch";
        readonly RELAXED: "relaxed";
        readonly TIGHTENED: "tightened";
        readonly UNCHANGED: "unchanged";
    };
    static readonly transferChangeTypes: {
        readonly STRICT_ADDED: "strictAdded";
        readonly STRICT_REMOVED: "strictRemoved";
        readonly PROPERTY_ADDED: "propertyAdded";
        readonly PROPERTY_REMOVED: "propertyRemoved";
        readonly PROPERTY_MODIFIED: "propertyModified";
    };
    static readonly composerKeys: {
        readonly REQUIRE: "require";
        readonly REQUIRE_DEV: "require-dev";
        readonly PHP: "php";
    };
    static readonly schemaTags: {
        table: "<table name=";
        column: "<column name=";
        index: "<index";
        indexName: "<index name=";
        indexClose: "</index>";
        indexColumn: "<index-column name=";
        COLUMN: "<column name=";
        INDEX: "<index";
        INDEX_NAME: "<index name=";
        INDEX_CLOSE: "</index>";
        INDEX_COLUMN: "<index-column name=";
        TABLE: "<table name=";
    };
    static readonly xmlAttributes: {
        strict: "strict=";
        trueValue: "true";
        STRICT: "strict=";
        TRUE_VALUE: "true";
    };
    static readonly xmlPatterns: {
        readonly TRANSFER_OPEN: RegExp;
        readonly TRANSFER_CLOSE: "</transfer>";
        readonly PROPERTY_OPEN: RegExp;
    };
    static readonly diffMarkers: {
        newFile: "new file mode";
        deletedFile: "deleted file mode";
        blockMarker: "@@";
        orOperator: "||";
        NEW_FILE: "new file mode";
        DELETED_FILE: "deleted file mode";
        BLOCK_MARKER: "@@";
        OR_OPERATOR: "||";
    };
    static readonly diffPrefixes: {
        readonly ADDITION: "+";
        readonly REMOVAL: "-";
        readonly ADDITION_FILE: "+++";
        readonly REMOVAL_FILE: "---";
        readonly CONTEXT: " ";
    };
    static readonly diffPrefixChars: {
        added: "+";
        removed: "-";
        unchanged: " ";
        addition: "+";
        removal: "-";
        additionFileMarker: "+++";
        removalFileMarker: "---";
    };
    static readonly diffSettings: {
        readonly CONTEXT_LINES: 10;
    };
    static readonly defaultModulePatterns: import("../../spryker/constants/spryker-constants").ModulePattern[];
    static readonly relevantNonPhpExtensions: readonly [".xml", ".yml", ".yaml", ".json", ".twig", ".js", ".ts", ".scss", ".css", ".md", ".txt", ".csv"];
    static readonly riskLevels: {
        high: {
            readonly level: "HIGH";
            readonly emoji: "🔴";
        };
        medium: {
            readonly level: "MEDIUM";
            readonly emoji: "🟡";
        };
        low: {
            readonly level: "LOW";
            readonly emoji: "🟢";
        };
        HIGH: {
            readonly level: "HIGH";
            readonly emoji: "🔴";
        };
        MEDIUM: {
            readonly level: "MEDIUM";
            readonly emoji: "🟡";
        };
        LOW: {
            readonly level: "LOW";
            readonly emoji: "🟢";
        };
    };
    static readonly riskThresholds: {
        modifiedConfigMethodsHigh: 3;
        newPublicAPIMedium: 5;
        internalWithImpactMedium: 10;
        MODIFIED_CONFIG_METHODS_HIGH: 3;
        NEW_PUBLIC_API_MEDIUM: 5;
        INTERNAL_WITH_IMPACT_MEDIUM: 10;
    };
    static readonly versionBumpTypes: {
        major: "MAJOR";
        minor: "MINOR";
        patch: "PATCH";
        MAJOR: "MAJOR";
        MINOR: "MINOR";
        PATCH: "PATCH";
    };
    static readonly changelogTypes: {
        method: "method";
        plugin: "plugin";
        class: "class";
        constant: "constant";
        transfer: "transfer";
        schema: "schema";
        composer: "composer";
        config: "config";
        METHOD: "method";
        PLUGIN: "plugin";
        CLASS: "class";
        CONSTANT: "constant";
        TRANSFER: "transfer";
        SCHEMA: "schema";
        COMPOSER: "composer";
        CONFIG: "config";
    };
    static readonly changelogActions: {
        added: "added";
        removed: "removed";
        modified: "modified";
        improved: "improved";
        adjusted: "adjusted";
        deprecated: "deprecated";
        ADDED: "added";
        REMOVED: "removed";
        MODIFIED: "modified";
        IMPROVED: "improved";
        ADJUSTED: "adjusted";
        DEPRECATED: "deprecated";
    };
    static readonly visibility: {
        public: "public";
        protected: "protected";
        private: "private";
    };
    static readonly visibilityModifiers: {
        public: "public";
        protected: "protected";
        private: "private";
    };
    static readonly diffBlockMarker: "@@";
    static readonly skipReasons: {
        emptyDiff: string;
        noClassName: string;
        unknownError: string;
    };
    static getEntrypointPattern: typeof getEntrypointPattern;
}
//# sourceMappingURL=analyzer-config.d.ts.map