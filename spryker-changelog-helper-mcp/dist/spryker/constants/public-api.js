"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiPattern = exports.PublicApiClassSuffixes = exports.PublicApiClassSuffix = void 0;
exports.getEntrypointPattern = getEntrypointPattern;
exports.PublicApiClassSuffix = {
    FACADE: 'Facade',
    CLIENT: 'Client',
    SERVICE: 'Service',
    PLUGIN: 'Plugin',
};
exports.PublicApiClassSuffixes = [
    exports.PublicApiClassSuffix.FACADE,
    exports.PublicApiClassSuffix.CLIENT,
    exports.PublicApiClassSuffix.SERVICE,
    exports.PublicApiClassSuffix.PLUGIN,
];
exports.PublicApiPattern = {
    PLUGIN: /\\Plugin\\|Plugin$/,
    SPRYKER_FILE_PATH: /src\/(Spryker(?:Shop|Feature)?)\/(Zed|Client|Service|Glue|Yves|Shared)\/([^\/]+)\/(.+)\.php$/,
};
function getEntrypointPattern() {
    return `(${exports.PublicApiClassSuffixes.join('|')})$`;
}
const public_api_1 = require("./public-api");
//# sourceMappingURL=public-api.js.map