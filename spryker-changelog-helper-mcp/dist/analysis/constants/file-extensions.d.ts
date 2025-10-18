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
export declare const RelevantNonPhpExtensions: readonly [".xml", ".yml", ".yaml", ".json", ".twig", ".md", ".txt", ".csv"];
export declare const FilePattern: {
    readonly CONFIG: "Config.php";
    readonly COMPOSER_JSON: "composer.json";
    readonly CONFIG_FILE: "config.";
    readonly INTERFACE_SUFFIX: "Interface";
    readonly SCHEMA_XML: ".schema.xml";
    readonly TRANSFER_XML: ".transfer.xml";
    readonly TEST_DIRECTORY: RegExp;
};
export type FileExtensionType = typeof FileExtension[keyof typeof FileExtension];
import { FileExtension } from './file-extensions';
//# sourceMappingURL=file-extensions.d.ts.map