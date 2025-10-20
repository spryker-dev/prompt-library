"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultModulePatterns = exports.PublicApiPattern = exports.PublicApiClassSuffixes = exports.PublicApiClassSuffix = exports.SprykerSeparator = exports.CommunicationLayerClass = exports.InternalApiLayers = exports.InternalApiLayer = exports.SprykerLayers = exports.SprykerLayer = exports.SprykerVendors = exports.SprykerVendor = void 0;
exports.getEntrypointPattern = getEntrypointPattern;
exports.SprykerVendor = {
    SPRYKER: 'Spryker',
    SPRYKER_SHOP: 'SprykerShop',
    SPRYKER_FEATURE: 'SprykerFeature',
};
exports.SprykerVendors = [
    exports.SprykerVendor.SPRYKER,
    exports.SprykerVendor.SPRYKER_SHOP,
    exports.SprykerVendor.SPRYKER_FEATURE,
];
exports.SprykerLayer = {
    ZED: 'Zed',
    CLIENT: 'Client',
    SERVICE: 'Service',
    GLUE: 'Glue',
    YVES: 'Yves',
    SHARED: 'Shared',
};
exports.SprykerLayers = [
    exports.SprykerLayer.ZED,
    exports.SprykerLayer.CLIENT,
    exports.SprykerLayer.SERVICE,
    exports.SprykerLayer.GLUE,
    exports.SprykerLayer.YVES,
    exports.SprykerLayer.SHARED,
];
exports.InternalApiLayer = {
    BUSINESS: 'Business',
    COMMUNICATION: 'Communication',
    PERSISTENCE: 'Persistence',
};
exports.InternalApiLayers = [
    exports.InternalApiLayer.BUSINESS,
    exports.InternalApiLayer.COMMUNICATION,
    exports.InternalApiLayer.PERSISTENCE,
];
exports.CommunicationLayerClass = {
    CONTROLLER: 'Controller',
    FORM: 'Form',
    TABLE: 'Table',
};
exports.SprykerSeparator = {
    NAMESPACE: '\\',
    PATH: '/',
};
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
exports.DefaultModulePatterns = [
    { detect: '/Bundles/', glob: 'Bundles/{module}/src/**/*.php' },
    { detect: '/Features/', glob: 'Features/{module}/src/**/*.php' },
];
//# sourceMappingURL=spryker-constants.js.map