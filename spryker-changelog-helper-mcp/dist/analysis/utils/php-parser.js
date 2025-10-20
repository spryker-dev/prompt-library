"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPParser = void 0;
const php_constants_1 = require("../constants/php-constants");
const spryker_constants_1 = require("../../spryker/constants/spryker-constants");
class PHPParser {
    extractClassNameFromFilePath(file) {
        const match = file.match(php_constants_1.PhpPattern.CLASS_NAME_FROM_PATH);
        return match ? match[1] : null;
    }
    buildFQCN(file, className) {
        const fullMatch = file.match(spryker_constants_1.PublicApiPattern.SPRYKER_FILE_PATH);
        if (!fullMatch) {
            return '\\' + className;
        }
        const [, vendor, layer, module, path] = fullMatch;
        const segments = path.split('/');
        segments.pop();
        const namespacePath = segments.join('\\');
        const parts = ['\\' + vendor, layer, module];
        if (namespacePath)
            parts.push(namespacePath);
        parts.push(className);
        return parts.join('\\');
    }
    extractMethodNameFromLine(line) {
        const match = line.match(php_constants_1.PhpPattern.METHOD_SIGNATURE);
        return match ? match[1] : null;
    }
    extractMethodDetails(line) {
        const visibilityMatch = line.match(/\b(public|protected|private)\b/);
        const visibility = visibilityMatch ? visibilityMatch[1] : 'public';
        const isStatic = line.includes('static');
        const paramsMatch = line.match(/function\s+\w+\s*\((.*?)\)/);
        const params = paramsMatch ? paramsMatch[1].trim() : '';
        return { visibility, params, isStatic };
    }
    isMethodSignatureLine(line) {
        return php_constants_1.PhpPattern.METHOD_SIGNATURE.test(line);
    }
}
exports.PHPParser = PHPParser;
//# sourceMappingURL=php-parser.js.map