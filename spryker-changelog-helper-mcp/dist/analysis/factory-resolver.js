"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryResolver = void 0;
const canonical_1 = require("../utils/canonical");
class FactoryResolver {
    static factoryClassFor(classFqn, ownerToFactory) {
        const fqn = (0, canonical_1.ensureFqn)(classFqn);
        const documented = ownerToFactory.get(fqn);
        if (documented)
            return documented;
        const s = String(fqn);
        let match;
        if ((match = s.match(/^(.*\\Zed\\)([^\\]+)\\Business(?:\\|$)/))) {
            return (0, canonical_1.ensureFqn)(`${match[1]}${match[2]}\\Business\\${match[2]}BusinessFactory`);
        }
        if ((match = s.match(/^(.*\\Zed\\)([^\\]+)\\Communication(?:\\|$)/))) {
            return (0, canonical_1.ensureFqn)(`${match[1]}${match[2]}\\Communication\\${match[2]}CommunicationFactory`);
        }
        if ((match = s.match(/^(.*\\Zed\\)([^\\]+)\\Persistence(?:\\|$)/))) {
            return (0, canonical_1.ensureFqn)(`${match[1]}${match[2]}\\Persistence\\${match[2]}PersistenceFactory`);
        }
        if ((match = s.match(/^(.*\\Client\\)([^\\]+)(?:\\|$)/))) {
            return (0, canonical_1.ensureFqn)(`${match[1]}${match[2]}\\${match[2]}Factory`);
        }
        if ((match = s.match(/^(.*\\Service\\)([^\\]+)(?:\\|$)/))) {
            return (0, canonical_1.ensureFqn)(`${match[1]}${match[2]}\\${match[2]}ServiceFactory`);
        }
        if ((match = s.match(/^(.*\\Glue\\)([^\\]+)(?:\\|$)/))) {
            return (0, canonical_1.ensureFqn)(`${match[1]}${match[2]}\\${match[2]}Factory`);
        }
        return null;
    }
}
exports.FactoryResolver = FactoryResolver;
//# sourceMappingURL=factory-resolver.js.map