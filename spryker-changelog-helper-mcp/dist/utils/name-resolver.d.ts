import { Name, UseItem } from '../types/ast.types';
import { FullyQualifiedName, UseMap } from '../types/domain.types';
export declare class NameResolver {
    static nsNameToString(nsNode: any): string;
    static nameNodeToString(node: any): string;
    static addUseItemToMap(item: UseItem, _currentNs: string, usesMap: UseMap, groupBase?: string): void;
    static resolveName(nameNode: Name | any, currentNs: string, uses: UseMap): FullyQualifiedName | null;
    static getIdentifierName(node: any): string | null;
}
//# sourceMappingURL=name-resolver.d.ts.map