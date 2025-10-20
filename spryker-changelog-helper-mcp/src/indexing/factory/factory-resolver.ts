import { FullyQualifiedName } from '../../types/domain.types';
import { ensureFqn } from '../../utils/canonical';

const FACTORY_PATTERNS = [
  { regex: /^(.*\\Zed\\)([^\\]+)\\Business(?:\\|$)/, template: (m: RegExpMatchArray) => `${m[1]}${m[2]}\\Business\\${m[2]}BusinessFactory` },
  { regex: /^(.*\\Zed\\)([^\\]+)\\Communication(?:\\|$)/, template: (m: RegExpMatchArray) => `${m[1]}${m[2]}\\Communication\\${m[2]}CommunicationFactory` },
  { regex: /^(.*\\Zed\\)([^\\]+)\\Persistence(?:\\|$)/, template: (m: RegExpMatchArray) => `${m[1]}${m[2]}\\Persistence\\${m[2]}PersistenceFactory` },
  { regex: /^(.*\\Client\\)([^\\]+)(?:\\|$)/, template: (m: RegExpMatchArray) => `${m[1]}${m[2]}\\${m[2]}Factory` },
  { regex: /^(.*\\Service\\)([^\\]+)(?:\\|$)/, template: (m: RegExpMatchArray) => `${m[1]}${m[2]}\\${m[2]}ServiceFactory` },
  { regex: /^(.*\\Glue\\)([^\\]+)(?:\\|$)/, template: (m: RegExpMatchArray) => `${m[1]}${m[2]}\\${m[2]}Factory` },
];

export class FactoryResolver {
  static factoryClassFor(
    classFqn: FullyQualifiedName,
    ownerToFactory: Map<FullyQualifiedName, FullyQualifiedName>
  ): FullyQualifiedName | null {
    const fqn = ensureFqn(classFqn);
    const documented = ownerToFactory.get(fqn);
    
    if (documented) return documented;

    return this.resolveByConvention(fqn);
  }

  private static resolveByConvention(fqn: FullyQualifiedName): FullyQualifiedName | null {
    const fqnString = String(fqn);

    for (const pattern of FACTORY_PATTERNS) {
      const match = fqnString.match(pattern.regex);
      if (match) {
        return ensureFqn(pattern.template(match));
      }
    }

    return null;
  }
}
