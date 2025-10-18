export declare class AnalyzerConfig {
    static readonly fileExtensions: {
        php: string;
        xml: string;
        yml: string;
        yaml: string;
        json: string;
        twig: string;
        markdown: string;
        text: string;
        csv: string;
    };
    static readonly relevantNonPhpExtensions: string[];
    static readonly gitStatus: {
        added: string;
        deleted: string;
        modified: string;
        renamed: string;
        copied: string;
    };
    static readonly visibilityModifiers: {
        public: string;
        protected: string;
        private: string;
    };
    static readonly phpKeywords: {
        function: string;
        class: string;
        interface: string;
        trait: string;
        namespace: string;
        use: string;
        const: string;
        extends: string;
        implements: string;
        static: string;
    };
    static readonly phpDocAnnotations: {
        api: string;
        deprecated: string;
        inheritDoc: string;
        param: string;
        return: string;
        var: string;
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
        namespaceSeparator: string;
        pathSeparator: string;
        publicApiClassSuffixes: readonly ["Facade", "Client", "Service", "Plugin"];
        publicApiPatterns: {
            plugin: RegExp;
        };
        internalApiLayers: readonly ["Business", "Communication", "Persistence"];
        communicationLayerClasses: {
            readonly controller: "Controller";
            readonly form: "Form";
            readonly table: "Table";
        };
    };
    static getEntrypointPattern(): string;
    static readonly defaultModulePatterns: {
        detect: string;
        glob: string;
    }[];
    static readonly riskLevels: {
        high: {
            level: "HIGH";
            emoji: string;
        };
        medium: {
            level: "MEDIUM";
            emoji: string;
        };
        low: {
            level: "LOW";
            emoji: string;
        };
    };
    static readonly riskThresholds: {
        modifiedConfigMethodsHigh: number;
        newPublicAPIMedium: number;
        internalWithImpactMedium: number;
    };
    static readonly internalChangeTypes: {
        implementation: "implementation";
        signature: "signature";
    };
    static readonly methodChangeTypes: {
        new: "new";
        modified: "modified";
        removed: "removed";
        added: "added";
        deleted: "deleted";
        none: "none";
    };
    static readonly visibility: {
        public: "public";
        protected: "protected";
        private: "private";
    };
    static readonly versionBumpTypes: {
        major: "MAJOR";
        minor: "MINOR";
        patch: "PATCH";
    };
    static readonly confidenceLevels: {
        high: "high";
        medium: "medium";
        low: "low";
    };
    static readonly filePatterns: {
        config: string;
        composerJson: string;
        configFile: string;
        yamlExt: string;
        yamlExtAlt: string;
        interfaceSuffix: string;
        schemaXml: string;
        transferXml: string;
        phpExtension: string;
    };
    static readonly changeTypes: {
        new: "new";
        modified: "modified";
        removed: "removed";
        added: "added";
        deleted: "deleted";
        none: "none";
    };
    static readonly versionChangeTypes: {
        added: "added";
        removed: "removed";
        upgraded: "upgraded";
        downgraded: "downgraded";
        unchanged: "unchanged";
    };
    static readonly constraintChangeTypes: {
        major: "major";
        minor: "minor";
        patch: "patch";
        relaxed: "relaxed";
        tightened: "tightened";
        unchanged: "unchanged";
    };
    static readonly diffMarkers: {
        newFile: string;
        deletedFile: string;
        orOperator: string;
    };
    static readonly diffPrefixChars: {
        added: string;
        removed: string;
        unchanged: string;
    };
    static readonly diffBlockMarker = "@@";
    static readonly composerKeys: {
        require: string;
        requireDev: string;
        php: string;
    };
    static readonly schemaTags: {
        column: string;
        index: string;
        indexName: string;
        indexClose: string;
        indexColumn: string;
        table: string;
    };
    static readonly xmlAttributes: {
        strict: string;
        trueValue: string;
    };
    static readonly transferChangeTypes: {
        strictAdded: string;
        strictRemoved: string;
        propertyAdded: string;
        propertyRemoved: string;
        propertyModified: string;
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
    };
    static readonly changelogActions: {
        added: "added";
        removed: "removed";
        modified: "modified";
        improved: "improved";
        adjusted: "adjusted";
        deprecated: "deprecated";
    };
    static readonly changelogDetails: {
        strict: "strict";
        index: "index";
    };
    static readonly diffSettings: {
        contextLines: number;
    };
    static readonly skipReasons: {
        noClassName: string;
        parseError: string;
        gitError: string;
        unknownError: string;
        emptyDiff: string;
        invalidFile: string;
    };
    static readonly transferSchema: {
        propertyTag: string;
        nameAttribute: string;
        typeAttribute: string;
    };
    static readonly diffPrefixes: {
        addition: string;
        removal: string;
        additionFileMarker: string;
        removalFileMarker: string;
        context: string;
    };
    static readonly xmlPatterns: {
        transferOpen: RegExp;
        transferClose: string;
        propertyOpen: RegExp;
    };
}
//# sourceMappingURL=analyzer-config.d.ts.map