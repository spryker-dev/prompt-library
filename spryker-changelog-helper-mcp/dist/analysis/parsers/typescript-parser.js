"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptParser = void 0;
class TypescriptParser {
    parse(content) {
        return {
            classes: this.extractClasses(content),
            methods: this.extractMethods(content),
            properties: this.extractProperties(content),
            events: this.extractEvents(content),
        };
    }
    extractClasses(content) {
        const classes = [];
        const classPattern = /(?:export\s+)?class\s+([\w]+)/g;
        let match;
        while ((match = classPattern.exec(content)) !== null) {
            classes.push(match[1]);
        }
        return classes;
    }
    extractMethods(content) {
        const methods = [];
        // Match public/protected/private methods
        const methodPattern = /(public|protected|private)?\s+([\w]+)\s*\([^)]*\)/g;
        let match;
        while ((match = methodPattern.exec(content)) !== null) {
            const visibility = match[1] || 'public';
            const name = match[2];
            // Skip constructors and common keywords
            if (name !== 'constructor' && name !== 'if' && name !== 'for' && name !== 'while') {
                methods.push({
                    name,
                    visibility: visibility,
                });
            }
        }
        return methods;
    }
    extractProperties(content) {
        const properties = [];
        const propertyPattern = /(public|protected|private)?\s+([\w]+)\s*[:=]/g;
        let match;
        while ((match = propertyPattern.exec(content)) !== null) {
            const visibility = match[1] || 'public';
            const name = match[2];
            // Skip common keywords
            if (name !== 'const' && name !== 'let' && name !== 'var') {
                properties.push({
                    name,
                    visibility: visibility,
                });
            }
        }
        return properties;
    }
    extractEvents(content) {
        const events = [];
        // Match dispatchEvent and trigger patterns
        const patterns = [
            /dispatchEvent\s*\(\s*new\s+(?:CustomEvent|Event)\s*\(\s*['"]([^'"]+)['"]/g,
            /trigger\s*\(\s*['"]([^'"]+)['"]/g,
            /\$\([^)]+\)\.trigger\s*\(\s*['"]([^'"]+)['"]/g,
        ];
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                events.push(match[1]);
            }
        }
        return [...new Set(events)];
    }
}
exports.TypescriptParser = TypescriptParser;
//# sourceMappingURL=typescript-parser.js.map