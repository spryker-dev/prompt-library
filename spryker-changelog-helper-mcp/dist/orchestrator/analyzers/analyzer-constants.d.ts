export declare const CHANGE_TYPES: {
    readonly new: "new";
    readonly modified: "modified";
    readonly removed: "removed";
    readonly added: "added";
};
export declare const VERSION_CHANGE_TYPES: {
    readonly added: "added";
    readonly removed: "removed";
    readonly upgraded: "upgraded";
    readonly downgraded: "downgraded";
    readonly unchanged: "unchanged";
};
export declare const CONSTRAINT_CHANGE_TYPES: {
    readonly major: "major";
    readonly minor: "minor";
    readonly patch: "patch";
    readonly relaxed: "relaxed";
    readonly tightened: "tightened";
    readonly unchanged: "unchanged";
};
export declare const DIFF_MARKERS: {
    readonly newFile: "new file mode";
    readonly deletedFile: "deleted file mode";
    readonly orOperator: "||";
};
export declare const DIFF_PREFIXES: {
    readonly added: "+";
    readonly removed: "-";
    readonly unchanged: " ";
};
export declare const FILE_PATTERNS: {
    readonly composerJson: "composer.json";
    readonly schemaXml: ".schema.xml";
    readonly transferXml: ".transfer.xml";
    readonly phpExtension: ".php";
};
export declare const COMPOSER_KEYS: {
    readonly require: "require";
    readonly requireDev: "require-dev";
    readonly php: "php";
};
export declare const SCHEMA_TAGS: {
    readonly column: "<column name=";
    readonly index: "<index";
    readonly indexName: "<index name=";
    readonly indexClose: "</index>";
    readonly indexColumn: "<index-column name=";
    readonly table: "<table name=";
};
export declare const XML_ATTRIBUTES: {
    readonly strict: "strict=";
    readonly trueValue: "true";
};
export declare const DIFF_BLOCK_MARKER: "@@";
export declare const TRANSFER_CHANGE_TYPES: {
    readonly strictAdded: "strictAdded";
    readonly strictRemoved: "strictRemoved";
    readonly propertyAdded: "propertyAdded";
    readonly propertyRemoved: "propertyRemoved";
    readonly propertyModified: "propertyModified";
};
//# sourceMappingURL=analyzer-constants.d.ts.map