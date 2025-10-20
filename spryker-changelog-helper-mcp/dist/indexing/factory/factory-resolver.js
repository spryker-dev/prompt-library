"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryResolver = void 0;
const canonical_1 = require("../../utils/canonical");
const FACTORY_PATTERNS = [
    { regex: /^(.*\\Zed\\)([^\\]+)\\Business(?:\\|$)/, template: (m) => `${m[1]}${m[2]}\\Business\\${m[2]}BusinessFactory` },
    { regex: /^(.*\\Zed\\)([^\\]+)\\Communication(?:\\|$)/, template: (m) => `${m[1]}${m[2]}\\Communication\\${m[2]}CommunicationFactory` },
    { regex: /^(.*\\Zed\\)([^\\]+)\\Persistence(?:\\|$)/, template: (m) => `${m[1]}${m[2]}\\Persistence\\${m[2]}PersistenceFactory` },
    { regex: /^(.*\\Client\\)([^\\]+)(?:\\|$)/, template: (m) => `${m[1]}${m[2]}\\${m[2]}Factory` },
    { regex: /^(.*\\Service\\)([^\\]+)(?:\\|$)/, template: (m) => `${m[1]}${m[2]}\\${m[2]}ServiceFactory` },
    { regex: /^(.*\\Glue\\)([^\\]+)(?:\\|$)/, template: (m) => `${m[1]}${m[2]}\\${m[2]}Factory` },
];
class FactoryResolver {
    static factoryClassFor(classFqn, ownerToFactory) {
        const fqn = (0, canonical_1.ensureFqn)(classFqn);
        const documented = ownerToFactory.get(fqn);
        if (documented)
            return documented;
        return this.resolveByConvention(fqn);
    }
    static resolveByConvention(fqn) {
        const fqnString = String(fqn);
        for (const pattern of FACTORY_PATTERNS) {
            const match = fqnString.match(pattern.regex);
            if (match) {
                return (0, canonical_1.ensureFqn)(pattern.template(match));
            }
        }
        return null;
    }
}
exports.FactoryResolver = FactoryResolver;
//# sourceMappingURL=factory-resolver.js.map