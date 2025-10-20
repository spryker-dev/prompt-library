"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameResolver = void 0;
const canonical_1 = require("./canonical");
class NameResolver {
    static nsNameToString(nsNode) {
        if (!nsNode)
            return '';
        if (typeof nsNode === 'string')
            return nsNode;
        if (nsNode.kind === 'name' && typeof nsNode.name === 'string') {
            return nsNode.name;
        }
        return String(nsNode.name || nsNode);
    }
    static nameNodeToString(node) {
        if (!node)
            return '';
        if (typeof node === 'string')
            return node;
        if (node.kind === 'identifier')
            return String(node.name);
        if (node.kind === 'name' && typeof node.name === 'string') {
            return node.name;
        }
        return String(node.name || node);
    }
    static addUseItemToMap(item, _currentNs, usesMap, groupBase) {
        if (item.type && item.type !== 'class')
            return;
        const alias = item.alias?.name ? String(item.alias.name) : null;
        let full;
        if (groupBase) {
            const leaf = this.nameNodeToString(item.name);
            full = groupBase + '\\' + leaf;
        }
        else {
            const nm = this.nameNodeToString(item.name);
            full = nm.startsWith('\\') ? nm : '\\' + nm;
        }
        const fqn = full.startsWith('\\') ? full : '\\' + full;
        const aliasKey = (alias || fqn.split('\\').pop() || '').toLowerCase();
        usesMap[aliasKey] = fqn;
    }
    static resolveName(nameNode, currentNs, uses) {
        const raw = this.nameNodeToString(nameNode);
        if (!raw)
            return null;
        if (raw.startsWith('\\')) {
            return (0, canonical_1.ensureFqn)(raw.replace(/^\\+/, ''));
        }
        if (nameNode?.kind === 'name' && nameNode.resolution === 'fqn') {
            return (0, canonical_1.ensureFqn)(raw.replace(/^\\+/, ''));
        }
        const parts = raw.split('\\');
        const head = parts[0];
        const tail = parts.slice(1).join('\\');
        if (uses) {
            const mapped = uses[head.toLowerCase()];
            if (mapped) {
                return (0, canonical_1.ensureFqn)(tail ? mapped + '\\' + tail : mapped);
            }
        }
        return (0, canonical_1.ensureFqn)(currentNs ? `${currentNs}\\${raw}` : raw);
    }
    static getIdentifierName(node) {
        if (!node)
            return null;
        if (node.kind === 'identifier')
            return String(node.name);
        if (node.kind === 'name')
            return String(node.name);
        if (node.kind === 'string')
            return String(node.value);
        return null;
    }
}
exports.NameResolver = NameResolver;
//# sourceMappingURL=name-resolver.js.map