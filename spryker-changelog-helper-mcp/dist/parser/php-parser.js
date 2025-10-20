"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = exports.parser = exports.PHPParser = void 0;
class PHPParser {
    constructor() {
        const options = {
            parser: { php7: true, extractDoc: true, suppressErrors: true },
            ast: { withPositions: true },
            lexer: { all_tokens: true },
        };
        let PHPParserModule;
        try {
            PHPParserModule = require('php-parser');
        }
        catch (e) {
            throw new Error('Failed to load php-parser module');
        }
        if (typeof PHPParserModule === 'function') {
            this.parser = new PHPParserModule(options);
        }
        else if (PHPParserModule && typeof PHPParserModule.Engine === 'function') {
            this.parser = new PHPParserModule.Engine(options);
        }
        else if (PHPParserModule && typeof PHPParserModule.default === 'function') {
            this.parser = new PHPParserModule.default(options);
        }
        else {
            throw new Error('Unsupported php-parser API');
        }
    }
    parseCode(code, filename) {
        return this.parser.parseCode(code, filename);
    }
    walk(node, callback) {
        if (!node || typeof node !== 'object') {
            return;
        }
        callback(node);
        for (const key in node) {
            const value = node[key];
            if (!value)
                continue;
            if (Array.isArray(value)) {
                value.forEach((item) => this.walk(item, callback));
            }
            else if (value && typeof value === 'object' && value.kind) {
                this.walk(value, callback);
            }
        }
    }
}
exports.PHPParser = PHPParser;
exports.parser = new PHPParser();
exports.walk = exports.parser.walk;
//# sourceMappingURL=php-parser.js.map