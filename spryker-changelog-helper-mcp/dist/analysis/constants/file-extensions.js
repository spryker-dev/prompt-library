"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePattern = exports.RelevantNonPhpExtensions = exports.FileExtension = void 0;
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
exports.FilePattern = {
    CONFIG: 'Config.php',
    COMPOSER_JSON: 'composer.json',
    CONFIG_FILE: 'config.',
    INTERFACE_SUFFIX: 'Interface',
    SCHEMA_XML: '.schema.xml',
    TRANSFER_XML: '.transfer.xml',
    TEST_DIRECTORY: /\/tests?\//i,
};
const file_extensions_1 = require("./file-extensions");
//# sourceMappingURL=file-extensions.js.map