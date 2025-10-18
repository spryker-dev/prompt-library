import { Name, UseItem } from '../types/ast.types';
import { FullyQualifiedName, UseMap } from '../types/domain.types';
import { ensureFqn } from './canonical';

export class NameResolver {
  static nsNameToString(nsNode: any): string {
    if (!nsNode) return '';
    if (typeof nsNode === 'string') return nsNode;
    if (nsNode.kind === 'name' && typeof nsNode.name === 'string') {
      return nsNode.name;
    }
    return String(nsNode.name || nsNode);
  }

  static nameNodeToString(node: any): string {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (node.kind === 'identifier') return String(node.name);
    if (node.kind === 'name' && typeof node.name === 'string') {
      return node.name;
    }
    return String(node.name || node);
  }

  static addUseItemToMap(
    item: UseItem,
    _currentNs: string,
    usesMap: UseMap,
    groupBase?: string
  ): void {
    if (item.type && item.type !== 'class') return;

    const alias = item.alias?.name ? String(item.alias.name) : null;
    let full: string;

    if (groupBase) {
      const leaf = this.nameNodeToString(item.name);
      full = groupBase + '\\' + leaf;
    } else {
      const nm = this.nameNodeToString(item.name);
      full = nm.startsWith('\\') ? nm : '\\' + nm;
    }

    const fqn = full.startsWith('\\') ? full : '\\' + full;
    const aliasKey = (alias || fqn.split('\\').pop() || '').toLowerCase();
    usesMap[aliasKey] = fqn;
  }

  static resolveName(
    nameNode: Name | any,
    currentNs: string,
    uses: UseMap
  ): FullyQualifiedName | null {
    const raw = this.nameNodeToString(nameNode);
    if (!raw) return null;

    if (raw.startsWith('\\')) {
      return ensureFqn(raw.replace(/^\\+/, ''));
    }

    if (nameNode?.kind === 'name' && nameNode.resolution === 'fqn') {
      return ensureFqn(raw.replace(/^\\+/, ''));
    }

    const parts = raw.split('\\');
    const head = parts[0];
    const tail = parts.slice(1).join('\\');

    if (uses) {
      const mapped = uses[head.toLowerCase()];
      if (mapped) {
        return ensureFqn(tail ? mapped + '\\' + tail : mapped);
      }
    }

    return ensureFqn(currentNs ? `${currentNs}\\${raw}` : raw);
  }

  static getIdentifierName(node: any): string | null {
    if (!node) return null;
    if (node.kind === 'identifier') return String(node.name);
    if (node.kind === 'name') return String(node.name);
    if (node.kind === 'string') return String(node.value);
    return null;
  }
}
