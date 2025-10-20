"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScssParser = void 0;
class ScssParser {
    parse(content) {
        return {
            variables: this.extractVariables(content),
            cssVariables: this.extractCssVariables(content),
            mixins: this.extractMixins(content),
            classes: this.extractClasses(content),
            modifiers: this.extractModifiers(content),
        };
    }
    extractVariables(content) {
        const variables = [];
        const pattern = /\$([\w-]+)\s*:/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            variables.push(`$${match[1]}`);
        }
        return [...new Set(variables)];
    }
    extractCssVariables(content) {
        const variables = [];
        const pattern = /--([\w-]+)\s*:/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            variables.push(`--${match[1]}`);
        }
        return [...new Set(variables)];
    }
    extractMixins(content) {
        const mixins = [];
        const pattern = /@mixin\s+([\w-]+)/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            mixins.push(match[1]);
        }
        return mixins;
    }
    extractClasses(content) {
        const classes = [];
        const pattern = /\.([\w-]+)(?:\s|{|,|:)/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const className = match[1];
            // Skip modifiers (they have their own extraction)
            if (!className.includes('&') && !content.includes(`&--${className}`)) {
                classes.push(`.${className}`);
            }
        }
        return [...new Set(classes)];
    }
    extractModifiers(content) {
        const modifiers = [];
        const pattern = /&--([\w-]+)/g;
        let match;
        while ((match = pattern.exec(content)) !== null) {
            modifiers.push(`--${match[1]}`);
        }
        return modifiers;
    }
}
exports.ScssParser = ScssParser;
//# sourceMappingURL=scss-parser.js.map