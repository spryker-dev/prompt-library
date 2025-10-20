"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainUnwrapper = void 0;
const name_resolver_1 = require("./name-resolver");
class ChainUnwrapper {
    static unwrapChain(node) {
        const names = [];
        let cur = node;
        let base = null;
        while (cur) {
            if (cur.kind === 'call') {
                cur = cur.what;
                continue;
            }
            if (cur.kind === 'propertylookup' ||
                cur.kind === 'nullsafe_propertylookup' ||
                cur.kind === 'staticlookup') {
                const nm = name_resolver_1.NameResolver.getIdentifierName(cur.offset);
                if (nm)
                    names.push(nm);
                base = cur.what;
                cur = cur.what;
                continue;
            }
            base = cur;
            break;
        }
        names.reverse();
        const tail = names.length ? names[names.length - 1] : null;
        return { names, base, tail };
    }
}
exports.ChainUnwrapper = ChainUnwrapper;
//# sourceMappingURL=chain-unwrapper.js.map