import { PublicApiClassSuffixes, SprykerVendors, SprykerLayers, InternalApiLayers } from '../constants/spryker-constants';
import { PublicApiPattern } from '../constants/spryker-constants';

export interface MethodInfo {
  fqcn: string;
  visibility: string;
}

export class PublicApiDetector {
  static isPlugin(className: string): boolean {
    return PublicApiPattern.PLUGIN.test(className);
  }

  static isConfig(className: string): boolean {
    return /Config$/.test(className) || /DependencyProvider$/.test(className);
  }

  static isPublicApiClass(className: string): boolean {
    const suffixes = PublicApiClassSuffixes.join('|');
    const pattern = new RegExp(`(${suffixes})$`);
    if (pattern.test(className)) return true;
    
    // Check if it's an interface of a public API class (e.g., FacadeInterface, ClientInterface)
    const interfacePattern = new RegExp(`(${suffixes})Interface$`);
    return interfacePattern.test(className);
  }

  static isPublicApi(method: MethodInfo): boolean {
    const className = method.fqcn.split('::')[0];
    
    if (method.visibility !== 'public') {
      return false;
    }
    
    return this.isPublicApiClass(className) || this.isPlugin(className);
  }

  static extractModuleName(fqcn: string): string {
    const vendorPattern = SprykerVendors.join('|');
    const layerPattern = SprykerLayers.join('|');
    const pattern = new RegExp(`\\\\(?:${vendorPattern})\\\\(${layerPattern})\\\\([^\\\\]+)`);
    const match = fqcn.match(pattern);
    return match ? match[2] : 'Unknown';
  }

  static isInternalApiLayer(fqcn: string): boolean {
    const internalLayers = InternalApiLayers.join('|');
    const pattern = new RegExp(`\\\\(${internalLayers})\\\\`);
    return pattern.test(fqcn);
  }
}
