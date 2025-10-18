"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiDetector = void 0;
const module_patterns_1 = require("../../spryker/patterns/module-patterns");
class PublicApiDetector {
    static isPlugin(className) {
        return module_patterns_1.AnalyzerConfig.spryker.publicApiPatterns.plugin.test(className);
    }
    static isConfig(className) {
        return /Config$/.test(className) || /DependencyProvider$/.test(className);
    }
    static isPublicApiClass(className) {
        const suffixes = module_patterns_1.AnalyzerConfig.spryker.publicApiClassSuffixes.join('|');
        const pattern = new RegExp(`(${suffixes})$`);
        if (pattern.test(className))
            return true;
        // Check if it's an interface of a public API class (e.g., FacadeInterface, ClientInterface)
        const interfacePattern = new RegExp(`(${suffixes})Interface$`);
        return interfacePattern.test(className);
    }
    static isPublicApi(method) {
        const className = method.fqcn.split('::')[0];
        if (method.visibility !== module_patterns_1.AnalyzerConfig.visibility.public) {
            return false;
        }
        return this.isPublicApiClass(className) || this.isPlugin(className);
    }
    static extractModuleName(fqcn) {
        const vendorPattern = module_patterns_1.AnalyzerConfig.spryker.vendors.join('|');
        const layerPattern = module_patterns_1.AnalyzerConfig.spryker.layers.join('|');
        const pattern = new RegExp(`\\\\(?:${vendorPattern})\\\\(${layerPattern})\\\\([^\\\\]+)`);
        const match = fqcn.match(pattern);
        return match ? match[2] : 'Unknown';
    }
    static isInternalApiLayer(fqcn) {
        const internalLayers = module_patterns_1.AnalyzerConfig.spryker.internalApiLayers.join('|');
        const pattern = new RegExp(`\\\\(${internalLayers})\\\\`);
        return pattern.test(fqcn);
    }
}
exports.PublicApiDetector = PublicApiDetector;
//# sourceMappingURL=public-api-detector.js.map