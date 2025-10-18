"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPParser = void 0;
const analyzer_config_1 = require("../config/analyzer-config");
class PHPParser {
    extractClassNameFromFilePath(file) {
        const match = file.match(analyzer_config_1.AnalyzerConfig.patterns.classNameFromPath);
        return match ? match[1] : null;
    }
    buildFQCN(file, className) {
        const fullMatch = file.match(analyzer_config_1.AnalyzerConfig.patterns.sprykerFilePath);
        if (!fullMatch) {
            return this.buildGenericFQCN(className);
        }
        const [, vendor, layer, module, path] = fullMatch;
        const namespacePath = this.convertPathToNamespace(path);
        return this.buildSprykerFQCN(vendor, layer, module, namespacePath, className);
    }
    convertPathToNamespace(path) {
        const { pathSeparator, namespaceSeparator } = analyzer_config_1.AnalyzerConfig.spryker;
        // Convert: Business/Model/Operation -> Business\Model
        // First, split by path separator and remove the last segment (class name)
        const segments = path.split(pathSeparator);
        segments.pop(); // Remove the last segment (class name)
        // Join with namespace separator
        return segments.join(namespaceSeparator);
    }
    buildSprykerFQCN(vendor, layer, module, namespacePath, className) {
        const { namespaceSeparator } = analyzer_config_1.AnalyzerConfig.spryker;
        const parts = [namespaceSeparator + vendor, layer, module];
        if (namespacePath) {
            parts.push(namespacePath);
        }
        parts.push(className);
        return parts.join(namespaceSeparator);
    }
    buildGenericFQCN(className) {
        return analyzer_config_1.AnalyzerConfig.spryker.namespaceSeparator + className;
    }
    extractMethodNameFromLine(line) {
        const match = line.match(analyzer_config_1.AnalyzerConfig.patterns.methodSignature);
        return match ? match[1] : null;
    }
    extractMethodDetails(line) {
        const visibilityMatch = line.match(/\b(public|protected|private)\b/);
        const visibility = visibilityMatch ? visibilityMatch[1] : 'public';
        const isStatic = line.includes(analyzer_config_1.AnalyzerConfig.phpKeywords.static);
        const paramsMatch = line.match(/function\s+\w+\s*\((.*?)\)/);
        const params = paramsMatch ? paramsMatch[1].trim() : '';
        return { visibility, params, isStatic };
    }
    isMethodSignatureLine(line) {
        return analyzer_config_1.AnalyzerConfig.patterns.methodSignature.test(line);
    }
}
exports.PHPParser = PHPParser;
//# sourceMappingURL=php-parser.js.map