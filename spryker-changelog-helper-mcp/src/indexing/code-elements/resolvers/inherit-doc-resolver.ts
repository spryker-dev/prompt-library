import { MethodMetadata, CanonicalKey, FullyQualifiedName } from '../../../types/domain.types';
import { canonKey } from '../../../utils/canonical';

export class InheritDocResolver {
    resolve(
        methods: Map<CanonicalKey, MethodMetadata>,
        classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>
    ): void {
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

    private needsInheritance(metadata: MethodMetadata, config: any): boolean {
        return metadata.description === config.phpDocAnnotations.inheritDoc || !metadata.description;
    }

    private inheritFromInterface(
        metadata: MethodMetadata,
        classImplements: Map<FullyQualifiedName, Set<FullyQualifiedName>>,
        methods: Map<CanonicalKey, MethodMetadata>,
        config: any
    ): void {
        const interfaces = classImplements.get(metadata.classFQN);
        if (!interfaces) return;

        for (const interfaceFqn of interfaces) {
            const interfaceKey = canonKey(interfaceFqn, metadata.name);
            const interfaceMetadata = methods.get(interfaceKey);

            if (this.isValidInheritanceSource(interfaceMetadata, config)) {
                this.copyMetadata(metadata, interfaceMetadata!);
                break;
            }
        }
    }

    private isValidInheritanceSource(
        interfaceMetadata: MethodMetadata | undefined,
        config: any
    ): boolean {
        return !!interfaceMetadata &&
            !!interfaceMetadata.description &&
            interfaceMetadata.description !== config.phpDocAnnotations.inheritDoc;
    }

    private copyMetadata(target: MethodMetadata, source: MethodMetadata): void {
        target.description = source.description;
        target.isApiMethod = source.isApiMethod;
        target.isDeprecated = source.isDeprecated;
    }
}
