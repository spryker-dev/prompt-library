"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiDetector = void 0;
const analyzer_config_1 = require("../config/analyzer-config");
class PublicApiDetector {
    static isPlugin(className) {
        return analyzer_config_1.AnalyzerConfig.spryker.publicApiPatterns.plugin.test(className);
    }
    static isConfig(className) {
        return /Config$/.test(className) || /DependencyProvider$/.test(className);
    }
    static isPublicApiClass(className) {
        const suffixes = analyzer_config_1.AnalyzerConfig.spryker.publicApiClassSuffixes.join('|');
        const pattern = new RegExp(`(${suffixes})$`);
        if (pattern.test(className))
            return true;
        // Check if it's an interface of a public API class (e.g., FacadeInterface, ClientInterface)
        const interfacePattern = new RegExp(`(${suffixes})Interface$`);
        return interfacePattern.test(className);
    }
    static isPublicApi(method) {
        const className = method.fqcn.split('::')[0];
        if (method.visibility !== analyzer_config_1.AnalyzerConfig.visibility.public) {
            return false;
        }
        return this.isPublicApiClass(className) || this.isPlugin(className);
    }
    static extractModuleName(fqcn) {
        const vendorPattern = analyzer_config_1.AnalyzerConfig.spryker.vendors.join('|');
        const layerPattern = analyzer_config_1.AnalyzerConfig.spryker.layers.join('|');
        const pattern = new RegExp(`\\\\(?:${vendorPattern})\\\\(${layerPattern})\\\\([^\\\\]+)`);
        const match = fqcn.match(pattern);
        return match ? match[2] : 'Unknown';
    }
    static isInternalApiLayer(fqcn) {
        const internalLayers = analyzer_config_1.AnalyzerConfig.spryker.internalApiLayers.join('|');
        const pattern = new RegExp(`\\\\(${internalLayers})\\\\`);
        return pattern.test(fqcn);
    }
}
exports.PublicApiDetector = PublicApiDetector;
//# sourceMappingURL=public-api-detector.js.map