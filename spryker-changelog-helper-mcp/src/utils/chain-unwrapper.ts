import { ASTNode } from '../types/ast.types';
import { NameResolver } from './name-resolver';

export interface UnwrappedChain {
  names: string[];
  base: ASTNode | null;
  tail: string | null;
}

export class ChainUnwrapper {
  static unwrapChain(node: ASTNode): UnwrappedChain {
    const names: string[] = [];
    let cur: any = node;
    let base: ASTNode | null = null;

    while (cur) {
      if (cur.kind === 'call') {
        cur = cur.what;
        continue;
      }

      if (
        cur.kind === 'propertylookup' ||
        cur.kind === 'nullsafe_propertylookup' ||
        cur.kind === 'staticlookup'
      ) {
        const nm = NameResolver.getIdentifierName(cur.offset);
        if (nm) names.push(nm);
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
