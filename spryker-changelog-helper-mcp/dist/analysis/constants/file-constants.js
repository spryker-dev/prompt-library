"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontendExtensions = exports.RelevantNonPhpExtensions = exports.FilePattern = exports.FileExtension = void 0;
exports.FileExtension = {
    PHP: '.php',
    XML: '.xml',
    YML: '.yml',
    YAML: '.yaml',
    JSON: '.json',
    TWIG: '.twig',
    JS: '.js',
    TS: '.ts',
    SCSS: '.scss',
    CSS: '.css',
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
    exports.FileExtension.JS,
    exports.FileExtension.TS,
    exports.FileExtension.SCSS,
    exports.FileExtension.CSS,
    exports.FileExtension.MARKDOWN,
    exports.FileExtension.TEXT,
    exports.FileExtension.CSV,
];
exports.FrontendExtensions = [
    exports.FileExtension.TWIG,
    exports.FileExtension.JS,
    exports.FileExtension.TS,
    exports.FileExtension.SCSS,
    exports.FileExtension.CSS,
];
//# sourceMappingURL=file-constants.js.map