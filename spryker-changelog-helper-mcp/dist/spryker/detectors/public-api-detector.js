"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiDetector = void 0;
const spryker_constants_1 = require("../constants/spryker-constants");
const spryker_constants_2 = require("../constants/spryker-constants");
class PublicApiDetector {
    static isPlugin(className) {
        return spryker_constants_2.PublicApiPattern.PLUGIN.test(className);
    }
    static isConfig(className) {
        return /Config$/.test(className) || /DependencyProvider$/.test(className);
    }
    static isPublicApiClass(className) {
        const suffixes = spryker_constants_1.PublicApiClassSuffixes.join('|');
        const pattern = new RegExp(`(${suffixes})$`);
        if (pattern.test(className))
            return true;
        // Check if it's an interface of a public API class (e.g., FacadeInterface, ClientInterface)
        const interfacePattern = new RegExp(`(${suffixes})Interface$`);
        return interfacePattern.test(className);
    }
    static isPublicApi(method) {
        const className = method.fqcn.split('::')[0];
        if (method.visibility !== 'public') {
            return false;
        }
        return this.isPublicApiClass(className) || this.isPlugin(className);
    }
    static extractModuleName(fqcn) {
        const vendorPattern = spryker_constants_1.SprykerVendors.join('|');
        const layerPattern = spryker_constants_1.SprykerLayers.join('|');
        const pattern = new RegExp(`\\\\(?:${vendorPattern})\\\\(${layerPattern})\\\\([^\\\\]+)`);
        const match = fqcn.match(pattern);
        return match ? match[2] : 'Unknown';
    }
    static isInternalApiLayer(fqcn) {
        const internalLayers = spryker_constants_1.InternalApiLayers.join('|');
        const pattern = new RegExp(`\\\\(${internalLayers})\\\\`);
        return pattern.test(fqcn);
    }
}
exports.PublicApiDetector = PublicApiDetector;
//# sourceMappingURL=public-api-detector.js.map