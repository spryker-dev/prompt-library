"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolIndexer = void 0;
const fs = __importStar(require("fs"));
const name_resolver_1 = require("../utils/name-resolver");
const canonical_1 = require("../utils/canonical");
class SymbolIndexer {
    constructor(parser, logger) {
        this.parser = parser;
        this.logger = logger;
    }
    async indexSymbols(files) {
        const classes = new Map();
        const methods = new Map();
        const ownerToFactory = new Map();
        const classImplements = new Map();
        for (const filePath of files) {
            const code = fs.readFileSync(filePath, 'utf8');
            let ast;
            try {
                ast = this.parser.parseCode(code, filePath);
            }
            catch {
                continue;
            }
            this.indexFile(ast, filePath, classes, methods, ownerToFactory, classImplements);
        }
        this.resolveInheritDoc(methods, classImplements);
        return { classes, methods, ownerToFactory, classImplements };
    }
    resolveInheritDoc(methods, classImplements) {
        const { canonKey } = require('../utils/canonical');
        const { AnalyzerConfig } = require('../orchestrator/config/analyzer-config');
        for (const [_key, metadata] of methods.entries()) {
            if (metadata.description === AnalyzerConfig.phpDocAnnotations.inheritDoc || !metadata.description) {
                const interfaces = classImplements.get(metadata.classFQN);
                if (interfaces) {
                    for (const interfaceFqn of interfaces) {
                        const interfaceKey = canonKey(interfaceFqn, metadata.name);
                        const interfaceMetadata = methods.get(interfaceKey);
                        if (interfaceMetadata && interfaceMetadata.description &&
                            interfaceMetadata.description !== AnalyzerConfig.phpDocAnnotations.inheritDoc) {
                            metadata.description = interfaceMetadata.description;
                            metadata.isApiMethod = interfaceMetadata.isApiMethod;
                            metadata.isDeprecated = interfaceMetadata.isDeprecated;
                            break;
                        }
                    }
                }
            }
        }
    }
    indexFile(ast, filePath, classes, methods, ownerToFactory, classImplements) {
        let currentNs = '';
        let currentUses = {};
        this.parser.walk(ast, (node) => {
            if (node.kind === 'namespace') {
                currentNs = name_resolver_1.NameResolver.nsNameToString(node.name);
                currentUses = {};
            }
            if (node.kind === 'useitem') {
                name_resolver_1.NameResolver.addUseItemToMap(node, currentNs, currentUses);
            }
            if (node.kind === 'usegroup') {
                const useGroup = node;
                const baseName = name_resolver_1.NameResolver.nsNameToString(useGroup.name);
                const base = baseName.startsWith('\\') ? baseName : '\\' + baseName;
                for (const item of useGroup.items || []) {
                    name_resolver_1.NameResolver.addUseItemToMap(item, currentNs, currentUses, base);
                }
            }
            if (node.kind === 'interface') {
                this.indexInterface(node, filePath, currentNs, methods);
                const name = node.name ? String(node.name.name) : null;
                if (name) {
                    const fqn = (0, canonical_1.ensureFqn)(currentNs ? `${currentNs}\\${name}` : name);
                    classes.set(fqn, { file: filePath, kind: 'interface' });
                    this.logger?.('[interface]', fqn, '@', filePath);
                }
            }
            if (node.kind === 'class') {
                this.indexClass(node, filePath, currentNs, currentUses, classes, methods, ownerToFactory, classImplements);
            }
        });
    }
    indexInterface(iface, filePath, currentNs, methods) {
        const name = iface.name ? String(iface.name.name) : null;
        if (!name)
            return;
        const fqn = (0, canonical_1.ensureFqn)(currentNs ? `${currentNs}\\${name}` : name);
        if (Array.isArray(iface.body)) {
            for (const stmt of iface.body) {
                if (stmt.kind !== 'method')
                    continue;
                const method = stmt;
                const mname = method.name ? String(method.name.name) : null;
                if (!mname)
                    continue;
                const docText = this.collectCommentText(method);
                const phpDoc = this.parsePhpDoc(docText);
                const key = (0, canonical_1.canonKey)(fqn, mname);
                methods.set(key, {
                    visibility: 'public',
                    file: filePath,
                    start: method.loc?.start?.line || null,
                    end: method.loc?.end?.line || null,
                    classFQN: fqn,
                    name: mname,
                    isInterface: true,
                    description: phpDoc.description,
                    isApiMethod: phpDoc.isApiMethod,
                    isDeprecated: phpDoc.isDeprecated,
                });
                this.logger?.('[iface-method]', key);
            }
        }
    }
    indexClass(classNode, filePath, currentNs, currentUses, classes, methods, ownerToFactory, classImplements) {
        const className = classNode.name ? String(classNode.name.name) : null;
        if (!className)
            return;
        const fqn = (0, canonical_1.ensureFqn)(currentNs ? `${currentNs}\\${className}` : className);
        classes.set(fqn, { file: filePath, kind: 'class' });
        this.logger?.('[class]', fqn, '@', filePath);
        if (Array.isArray(classNode.implements) && classNode.implements.length) {
            for (const iname of classNode.implements) {
                const ifaceFqn = name_resolver_1.NameResolver.resolveName(iname, currentNs, currentUses);
                if (!ifaceFqn)
                    continue;
                if (!classImplements.has(fqn)) {
                    classImplements.set(fqn, new Set());
                }
                classImplements.get(fqn).add(ifaceFqn);
                this.logger?.('[implements]', fqn, '->', ifaceFqn);
            }
        }
        const docText = this.collectCommentText(classNode);
        const docFactory = this.extractFactoryFqnFromDoc(docText);
        if (docFactory) {
            ownerToFactory.set(fqn, docFactory);
            this.logger?.('[factory-doc]', fqn, '->', docFactory);
        }
        if (!Array.isArray(classNode.body))
            return;
        for (const stmt of classNode.body) {
            if (stmt.kind !== 'method')
                continue;
            const method = stmt;
            const mname = method.name ? String(method.name.name) : null;
            if (!mname)
                continue;
            const vis = method.visibility || 'public';
            const start = method.loc?.start?.line || null;
            const end = method.loc?.end?.line || null;
            const key = (0, canonical_1.canonKey)(fqn, mname);
            const docText = this.collectCommentText(method);
            const phpDoc = this.parsePhpDoc(docText);
            methods.set(key, {
                visibility: vis,
                file: filePath,
                start,
                end,
                classFQN: fqn,
                name: mname,
                description: phpDoc.description,
                isApiMethod: phpDoc.isApiMethod,
                isDeprecated: phpDoc.isDeprecated,
            });
            this.logger?.('[method]', key, 'loc', `${start}-${end}`);
        }
    }
    collectCommentText(node) {
        const chunks = [];
        const add = (c) => {
            if (c && typeof c.value === 'string')
                chunks.push(c.value);
        };
        if (Array.isArray(node.leadingComments))
            node.leadingComments.forEach(add);
        if (Array.isArray(node.comments))
            node.comments.forEach(add);
        return chunks.join('\n');
    }
    parsePhpDoc(docText) {
        if (!docText) {
            return {};
        }
        const { AnalyzerConfig } = require('../orchestrator/config/analyzer-config');
        const lines = [];
        const docLines = docText.split('\n');
        for (const line of docLines) {
            const trimmed = line.replace(/^\s*\*\s?/, '').trim();
            if (trimmed.startsWith('/**') || trimmed.startsWith('*/') || trimmed === '') {
                continue;
            }
            if (trimmed.startsWith('@')) {
                break;
            }
            lines.push(trimmed);
        }
        const description = lines.length > 0 ? lines.join(' ').trim() : undefined;
        const isApiMethod = docText.includes(AnalyzerConfig.phpDocAnnotations.api);
        const isDeprecated = docText.includes(AnalyzerConfig.phpDocAnnotations.deprecated);
        return { description, isApiMethod, isDeprecated };
    }
    extractFactoryFqnFromDoc(docText) {
        if (!docText)
            return null;
        const match = docText.match(/@method\s+\\?([A-Za-z_][\w\\]+)\s+get(?:BusinessFactory|Factory)\s*\(/);
        return match ? '\\' + match[1].replace(/^\\+/, '') : null;
    }
}
exports.SymbolIndexer = SymbolIndexer;
//# sourceMappingURL=symbol-indexer.js.map