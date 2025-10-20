"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InheritDocResolver = void 0;
const canonical_1 = require("../../../utils/canonical");
class InheritDocResolver {
    resolve(methods, classImplements) {
        const config = {
            phpDocAnnotations: {
                inheritDoc: '{@inheritDoc}'
            }
        };
        for (const [_key, metadata] of methods.entries()) {
            if (this.needsInheritance(metadata, config)) {
                this.inheritFromInterface(metadata, classImplements, methods, config);
            }
        }
    }
    needsInheritance(metadata, config) {
        return metadata.description === config.phpDocAnnotations.inheritDoc || !metadata.description;
    }
    inheritFromInterface(metadata, classImplements, methods, config) {
        const interfaces = classImplements.get(metadata.classFQN);
        if (!interfaces)
            return;
        for (const interfaceFqn of interfaces) {
            const interfaceKey = (0, canonical_1.canonKey)(interfaceFqn, metadata.name);
            const interfaceMetadata = methods.get(interfaceKey);
            if (this.isValidInheritanceSource(interfaceMetadata, config)) {
                this.copyMetadata(metadata, interfaceMetadata);
                break;
            }
        }
    }
    isValidInheritanceSource(interfaceMetadata, config) {
        return !!interfaceMetadata &&
            !!interfaceMetadata.description &&
            interfaceMetadata.description !== config.phpDocAnnotations.inheritDoc;
    }
    copyMetadata(target, source) {
        target.description = source.description;
        target.isApiMethod = source.isApiMethod;
        target.isDeprecated = source.isDeprecated;
    }
}
exports.InheritDocResolver = InheritDocResolver;
//# sourceMappingURL=inherit-doc-resolver.js.map