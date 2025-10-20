"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwigParser = void 0;
class TwigParser {
    parse(content) {
        return {
            dataAttributes: this.extractDataAttributes(content),
            includes: this.extractIncludes(content),
            blocks: this.extractBlocks(content),
            variables: this.extractVariables(content),
            macros: this.extractMacros(content),
            defineDataVariables: this.extractDefineDataVariables(content),
            attributesKeys: this.extractAttributesKeys(content),
            molecules: this.extractMolecules(content),
            widgets: this.extractWidgets(content),
        };
    }
    extractDataAttributes(content) {
        const attributes = [];
        // HTML data attributes: data-something="value"
        const htmlPattern = /data-([\w-]+)=/g;
        let match;
        while ((match = htmlPattern.exec(content)) !== null) {
            attributes.push(`data-${match[1]}`);
        }
        // Twig attributes object: 'data-something': value or "data-something": value
        const twigPattern = /['"]data-([\w-]+)['"]\s*:/g;
        while ((match = twigPattern.exec(content)) !== null) {
            attributes.push(`data-${match[1]}`);
        }
        return [...new Set(attributes)];
    }
    extractDefineDataVariables(content) {
        const variables = [];
        // Match {% define data = { ... } %}
        const definePattern = /{%\s*define\s+data\s*=\s*{([^}]+)}/gs;
        const match = definePattern.exec(content);
        if (match) {
            const dataBlock = match[1];
            // Extract variable names: variableName: value,
            const varPattern = /(\w+)\s*:/g;
            let varMatch;
            while ((varMatch = varPattern.exec(dataBlock)) !== null) {
                variables.push(varMatch[1]);
            }
        }
        return variables;
    }
    extractAttributesKeys(content) {
        const keys = [];
        // Match attributes: { 'key': value, "key": value }
        const attrsPattern = /attributes\s*:\s*{([^}]+)}/gs;
        let match;
        while ((match = attrsPattern.exec(content)) !== null) {
            const attrsBlock = match[1];
            // Extract keys: 'key': or "key":
            const keyPattern = /['"]([^'"]+)['"]\s*:/g;
            let keyMatch;
            while ((keyMatch = keyPattern.exec(attrsBlock)) !== null) {
                keys.push(keyMatch[1]);
            }
        }
        return [...new Set(keys)];
    }
    extractMolecules(content) {
        const molecules = [];
        // Match molecule('name') or molecule("name")
        const pattern = /molecule\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            molecules.push(match[1]);
        }
        return [...new Set(molecules)];
    }
    extractWidgets(content) {
        const widgets = [];
        // Match {% widget 'WidgetName' %} or {% widget "WidgetName" %}
        const pattern = /{%\s*widget\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            widgets.push(match[1]);
        }
        return [...new Set(widgets)];
    }
    extractIncludes(content) {
        const includes = [];
        const pattern = /include\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            includes.push(match[1]);
        }
        return includes;
    }
    extractBlocks(content) {
        const blocks = [];
        const pattern = /{%\s*block\s+([\w-]+)/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            blocks.push(match[1]);
        }
        return blocks;
    }
    extractVariables(content) {
        const variables = [];
        const pattern = /{{\s*([\w.]+)\s*}}/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            variables.push(match[1]);
        }
        return [...new Set(variables)];
    }
    extractMacros(content) {
        const macros = [];
        const pattern = /{%\s*macro\s+([\w-]+)/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            macros.push(match[1]);
        }
        return macros;
    }
}
exports.TwigParser = TwigParser;
//# sourceMappingURL=twig-parser.js.map