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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeIndexer = void 0;
const fs = __importStar(require("fs"));
const graphology_1 = __importDefault(require("graphology"));
const name_resolver_1 = require("../utils/name-resolver");
const chain_unwrapper_1 = require("../utils/chain-unwrapper");
const canonical_1 = require("../utils/canonical");
const factory_resolver_1 = require("./factory-resolver");
const property_type_extractor_1 = require("./property-type-extractor");
class EdgeIndexer {
    constructor(parser, methods, ownerToFactory, factoryReturnByClassMethod, classImplements, logger, _debug) {
        this.parser = parser;
        this.methods = methods;
        this.ownerToFactory = ownerToFactory;
        this.factoryReturnByClassMethod = factoryReturnByClassMethod;
        this.classImplements = classImplements;
        this.logger = logger;
        this.graph = new graphology_1.default();
        this.reverseAdjacencyMap = new Map();
        this.propTypesByClass = new Map();
        this.interfaceToImplementations = new Map();
        this.buildInterfaceToImplementationsMap();
    }
    buildInterfaceToImplementationsMap() {
        for (const [classFqn, interfaces] of this.classImplements) {
            for (const ifaceFqn of interfaces) {
                const key = (0, canonical_1.ensureFqn)(ifaceFqn);
                if (!this.interfaceToImplementations.has(key)) {
                    this.interfaceToImplementations.set(key, new Set());
                }
                this.interfaceToImplementations.get(key).add((0, canonical_1.ensureFqn)(classFqn));
            }
        }
    }
    async indexEdges(files) {
        for (const filePath of files) {
            await this.processFile(filePath);
        }
        return {
            graph: this.graph,
            reverseAdjacencyMap: this.reverseAdjacencyMap,
        };
    }
    async processFile(filePath) {
        const code = fs.readFileSync(filePath, 'utf8');
        let ast;
        try {
            ast = this.parser.parseCode(code, filePath);
        }
        catch {
            return;
        }
        let currentNs = '';
        let currentUses = {};
        let classFqn = null;
        let currentMethodKey = null;
        let localTypes = {};
        let paramTypes = {};
        const enterMethod = (cfqn, mname, stmtNode, propTypes) => {
            classFqn = cfqn;
            currentMethodKey = (0, canonical_1.canonKey)(cfqn, mname);
            localTypes = {};
            paramTypes = {};
            this.processMethodParameters(stmtNode, mname, cfqn, propTypes, currentNs, currentUses, paramTypes);
            this.ensureMethodNodeExists(currentMethodKey, cfqn, mname);
        };
        const addEdge = (calleeFqn, calleeName, kind) => {
            if (!calleeFqn || !calleeName || !currentMethodKey)
                return;
            const calleeKey = (0, canonical_1.canonKey)(calleeFqn, calleeName);
            this.ensureMethodNodeExists(calleeKey, calleeFqn, calleeName);
            if (!this.graph.hasEdge(currentMethodKey, calleeKey)) {
                this.graph.addEdge(currentMethodKey, calleeKey, { kind });
            }
            if (!this.reverseAdjacencyMap.has(calleeKey)) {
                this.reverseAdjacencyMap.set(calleeKey, new Set());
            }
            this.reverseAdjacencyMap.get(calleeKey).add(currentMethodKey);
        };
        const resolveExprType = (expr) => {
            if (!expr)
                return null;
            if (expr.kind === 'new') {
                return name_resolver_1.NameResolver.resolveName(expr.what, currentNs, currentUses);
            }
            if (expr.kind === 'variable' && typeof expr.name === 'string') {
                return localTypes[expr.name] || paramTypes[expr.name] || null;
            }
            if (expr.kind === 'call') {
                return this.resolveFactoryCallType(expr, classFqn, currentNs, currentUses);
            }
            return null;
        };
        this.parser.walk(ast, (node) => {
            if (node.kind === 'namespace') {
                currentNs = name_resolver_1.NameResolver.nsNameToString(node.name);
                currentUses = {};
            }
            if (node.kind === 'useitem') {
                name_resolver_1.NameResolver.addUseItemToMap(node, currentNs, currentUses);
            }
            if (node.kind === 'usegroup') {
                const baseName = name_resolver_1.NameResolver.nsNameToString(node.name);
                const base = baseName.startsWith('\\') ? baseName : '\\' + baseName;
                for (const item of (node.items || [])) {
                    name_resolver_1.NameResolver.addUseItemToMap(item, currentNs, currentUses, base);
                }
            }
            if (node.kind === 'class') {
                this.processClass(node, currentNs, currentUses, enterMethod, addEdge, resolveExprType, localTypes, paramTypes);
            }
        });
    }
    processMethodParameters(stmtNode, mname, cfqn, propTypes, currentNs, currentUses, paramTypes) {
        const params = this.extractParameters(stmtNode);
        for (const param of params) {
            const parameterName = this.extractParameterName(param);
            const parameterType = this.resolveParameterType(param, currentNs, currentUses);
            if (parameterName && parameterType) {
                paramTypes[parameterName] = parameterType;
                const isConstructor = mname === '__construct';
                if (isConstructor && this.isPromotedProperty(param)) {
                    propTypes[parameterName] = parameterType;
                    this.logger?.('[prop-promoted]', `${cfqn}::$${parameterName}`, '=>', parameterType);
                }
            }
        }
    }
    extractParameters(stmtNode) {
        if (Array.isArray(stmtNode?.params))
            return stmtNode.params;
        if (Array.isArray(stmtNode?.arguments))
            return stmtNode.arguments;
        return [];
    }
    extractParameterName(param) {
        if (param.name && typeof param.name.name === 'string') {
            return String(param.name.name);
        }
        if (typeof param.name === 'string') {
            return param.name;
        }
        return null;
    }
    resolveParameterType(param, currentNs, currentUses) {
        if (!param.type)
            return null;
        const typeNode = param.type.kind === 'nullabletype'
            ? param.type.what
            : param.type;
        return name_resolver_1.NameResolver.resolveName(typeNode, currentNs, currentUses);
    }
    isPromotedProperty(param) {
        const hasFlagsSet = !!(param.flags && param.flags !== 0);
        const hasVisibility = !!(param.visibility && param.visibility !== null);
        return hasFlagsSet || hasVisibility;
    }
    ensureMethodNodeExists(key, classFqn, methodName) {
        if (!this.graph.hasNode(key)) {
            const md = this.methods.get(key);
            this.graph.addNode(key, md
                ? { classFQN: md.classFQN, method: md.name, visibility: md.visibility }
                : { classFQN: (0, canonical_1.ensureFqn)(classFqn), method: methodName, visibility: 'unknown' });
        }
    }
    resolveFactoryCallType(expr, classFqn, _currentNs, _currentUses) {
        if (!classFqn)
            return null;
        const chain = chain_unwrapper_1.ChainUnwrapper.unwrapChain(expr);
        const names = chain.names;
        const sawFactory = names.includes('getFactory') || names.includes('getBusinessFactory');
        let createIdx = -1;
        for (let i = names.length - 1; i >= 0; i--) {
            const nm = names[i];
            if (nm === 'getFactory' || nm === 'getBusinessFactory')
                break;
            if (typeof nm === 'string' && (nm.startsWith('create') || nm.startsWith('get'))) {
                createIdx = i;
                break;
            }
        }
        if (sawFactory && createIdx !== -1) {
            const factoryMethod = names[createIdx];
            const factFqn = factory_resolver_1.FactoryResolver.factoryClassFor(classFqn, this.ownerToFactory);
            const lookupKey = factFqn ? (0, canonical_1.canonKey)(factFqn, factoryMethod) : null;
            const retFqn = lookupKey ? this.factoryReturnByClassMethod.get(lookupKey) : null;
            return retFqn || null;
        }
        return null;
    }
    processClass(classNode, currentNs, currentUses, enterMethod, addEdge, resolveExprType, localTypes, paramTypes) {
        const cls = classNode.name ? String(classNode.name.name) : null;
        if (!cls)
            return;
        const cfqn = (0, canonical_1.ensureFqn)(currentNs ? `${currentNs}\\${cls}` : cls);
        if (!Array.isArray(classNode.body))
            return;
        const propTypes = this.propTypesByClass.get(cfqn) || {};
        this.propTypesByClass.set(cfqn, propTypes);
        for (const stmt of classNode.body) {
            if (stmt.kind === 'property') {
                this.processPropertyDeclaration(stmt, cfqn, propTypes, currentNs, currentUses);
                continue;
            }
            if (stmt.kind !== 'method')
                continue;
            const method = stmt;
            const mname = method.name ? String(method.name.name) : null;
            if (!mname)
                continue;
            enterMethod(cfqn, mname, method, propTypes);
            this.parser.walk(method, (sub) => {
                this.processMethodBody(sub, cfqn, mname, propTypes, localTypes, paramTypes, currentNs, currentUses, addEdge, resolveExprType);
            });
        }
    }
    processPropertyDeclaration(prop, cfqn, propTypes, currentNs, currentUses) {
        const propertyType = this.extractPropertyType(prop, currentNs, currentUses);
        if (propertyType) {
            this.registerPropertyTypes(prop, cfqn, propTypes, propertyType);
        }
    }
    extractPropertyType(prop, currentNs, currentUses) {
        const declaredType = this.extractDeclaredType(prop, currentNs, currentUses);
        if (declaredType)
            return declaredType;
        const docText = property_type_extractor_1.PropertyTypeExtractor.collectCommentText(prop);
        return property_type_extractor_1.PropertyTypeExtractor.extractVarFqnFromDoc(docText, currentNs, currentUses);
    }
    extractDeclaredType(prop, currentNs, currentUses) {
        if (!prop.type)
            return null;
        const typeNode = prop.type.kind === 'nullabletype'
            ? prop.type.what
            : prop.type;
        return name_resolver_1.NameResolver.resolveName(typeNode, currentNs, currentUses);
    }
    registerPropertyTypes(prop, cfqn, propTypes, propertyType) {
        for (const property of prop.properties || []) {
            const propertyName = this.extractPropertyName(property);
            if (propertyName && !propTypes[propertyName]) {
                propTypes[propertyName] = propertyType;
                this.logger?.('[prop-decl]', `${cfqn}::$${propertyName}`, '=>', propertyType);
            }
        }
    }
    extractPropertyName(property) {
        if (property.name?.name) {
            return String(property.name.name);
        }
        if (typeof property.name === 'string') {
            return property.name;
        }
        return null;
    }
    processMethodBody(sub, cfqn, mname, propTypes, localTypes, paramTypes, currentNs, currentUses, addEdge, resolveExprType) {
        if (sub.kind === 'assign') {
            this.handleAssignment(sub, cfqn, propTypes, localTypes, currentNs, currentUses, resolveExprType);
            return;
        }
        if (sub.kind === 'staticcall') {
            this.processStaticCall(sub, cfqn, currentNs, currentUses, addEdge);
            return;
        }
        if (sub.kind === 'call') {
            this.processCall(sub, cfqn, mname, propTypes, localTypes, paramTypes, currentNs, currentUses, addEdge);
        }
    }
    handleAssignment(assign, cfqn, propTypes, localTypes, currentNs, currentUses, resolveExprType) {
        const isVariableAssignment = assign.left?.kind === 'variable';
        const isPropertyAssignment = assign.left?.kind === 'propertylookup';
        if (isVariableAssignment && assign.right?.kind === 'new') {
            this.trackLocalVariableType(assign, localTypes, currentNs, currentUses);
        }
        if (isPropertyAssignment) {
            this.trackPropertyType(assign, cfqn, propTypes, resolveExprType);
        }
    }
    trackLocalVariableType(assign, localTypes, currentNs, currentUses) {
        const variableName = typeof assign.left.name === 'string'
            ? assign.left.name
            : null;
        const className = name_resolver_1.NameResolver.resolveName(assign.right.what, currentNs, currentUses);
        if (variableName && className) {
            localTypes[variableName] = className;
        }
    }
    trackPropertyType(assign, cfqn, propTypes, resolveExprType) {
        const propertyLookup = assign.left;
        const isThisProperty = propertyLookup.what?.kind === 'variable'
            && propertyLookup.what.name === 'this';
        if (isThisProperty) {
            const propertyName = name_resolver_1.NameResolver.getIdentifierName(propertyLookup.offset);
            const propertyType = resolveExprType(assign.right);
            if (propertyName && propertyType) {
                propTypes[propertyName] = propertyType;
                this.logger?.('[prop-type]', `${cfqn}::$${propertyName}`, '=>', propertyType);
            }
        }
    }
    processStaticCall(staticCall, cfqn, currentNs, currentUses, addEdge) {
        const receiverClass = this.resolveStaticCallReceiver(staticCall, cfqn, currentNs, currentUses);
        const methodName = name_resolver_1.NameResolver.getIdentifierName(staticCall.what);
        if (methodName) {
            addEdge(receiverClass, methodName, 'static');
        }
    }
    resolveStaticCallReceiver(staticCall, cfqn, currentNs, currentUses) {
        if (staticCall.class?.kind === 'name') {
            const className = String(staticCall.class.name).toLowerCase();
            const isSelfReference = className === 'self' || className === 'static' || className === 'parent';
            if (isSelfReference) {
                return cfqn;
            }
        }
        return name_resolver_1.NameResolver.resolveName(staticCall.class, currentNs, currentUses);
    }
    processCall(call, cfqn, mname, propTypes, localTypes, paramTypes, _currentNs, _currentUses, addEdge) {
        const chain = chain_unwrapper_1.ChainUnwrapper.unwrapChain(call);
        const methodName = chain.tail;
        this.logCallChain(cfqn, mname, chain);
        if (!methodName)
            return;
        this.handleDirectMethodCall(chain, cfqn, methodName, addEdge);
        this.handlePropertyMethodCall(chain, cfqn, mname, propTypes, methodName, addEdge);
        this.handleVariableMethodCall(chain, localTypes, paramTypes, methodName, addEdge);
        this.handleFactoryMethodCall(chain, cfqn, methodName, addEdge);
    }
    logCallChain(cfqn, mname, chain) {
        this.logger?.('[call-chain]', (0, canonical_1.canonKey)(cfqn, mname), 'names=', JSON.stringify(chain.names), 'tail=', chain.tail, 'baseKind=', chain.base?.kind || '?');
    }
    handleDirectMethodCall(chain, cfqn, methodName, addEdge) {
        const isThisVariable = chain.base?.kind === 'variable' && chain.base.name === 'this';
        const isSingleMethodCall = chain.names.length === 1;
        if (isThisVariable && isSingleMethodCall) {
            addEdge(cfqn, methodName, 'intra');
        }
    }
    handlePropertyMethodCall(chain, cfqn, mname, propTypes, methodName, addEdge) {
        const isThisVariable = chain.base?.kind === 'variable' && chain.base.name === 'this';
        const hasPropertyAccess = chain.names.length >= 2;
        if (isThisVariable && hasPropertyAccess) {
            const propertyName = chain.names[0];
            const propertyType = propTypes[propertyName];
            if (propertyType) {
                addEdge(propertyType, methodName, 'this-prop');
                this.logger?.('[this-prop]', (0, canonical_1.canonKey)(cfqn, mname), '->', `${propertyType}::${methodName}`);
                this.addInterfaceImplementationEdges(propertyType, methodName, addEdge);
            }
            else {
                this.logger?.('[prop-miss]', (0, canonical_1.canonKey)(cfqn, mname), 'prop', propertyName, 'no type found');
            }
        }
    }
    handleVariableMethodCall(chain, localTypes, paramTypes, methodName, addEdge) {
        const isVariable = chain.base?.kind === 'variable';
        const variableName = isVariable ? chain.base.name : null;
        const isNotThisVariable = typeof variableName === 'string' && variableName !== 'this';
        if (isVariable && isNotThisVariable) {
            const variableType = localTypes[variableName] || paramTypes[variableName] || null;
            if (variableType) {
                addEdge(variableType, methodName, 'method');
                this.addInterfaceImplementationEdges(variableType, methodName, addEdge);
            }
        }
    }
    handleFactoryMethodCall(chain, cfqn, methodName, addEdge) {
        const factoryMethodIndex = this.findFactoryMethodIndex(chain.names, cfqn);
        if (factoryMethodIndex !== -1) {
            const factoryMethodName = chain.names[factoryMethodIndex];
            const returnType = this.resolveFactoryReturnType(cfqn, factoryMethodName);
            if (returnType) {
                addEdge(returnType, methodName, 'factory-return');
            }
        }
    }
    findFactoryMethodIndex(names, cfqn) {
        for (let i = names.length - 2; i >= 0; i--) {
            const name = names[i];
            if (typeof name !== 'string')
                continue;
            if (name.startsWith('create') || name.startsWith('get')) {
                const lookupKey = (0, canonical_1.canonKey)(cfqn, name);
                if (this.factoryReturnByClassMethod.has(lookupKey)) {
                    return i;
                }
                const factoryClass = factory_resolver_1.FactoryResolver.factoryClassFor(cfqn, this.ownerToFactory);
                if (factoryClass) {
                    const factoryLookupKey = (0, canonical_1.canonKey)(factoryClass, name);
                    if (this.factoryReturnByClassMethod.has(factoryLookupKey)) {
                        return i;
                    }
                }
            }
        }
        return -1;
    }
    resolveFactoryReturnType(cfqn, factoryMethodName) {
        const factoryClass = factory_resolver_1.FactoryResolver.factoryClassFor(cfqn, this.ownerToFactory);
        if (!factoryClass)
            return null;
        const lookupKey = (0, canonical_1.canonKey)(factoryClass, factoryMethodName);
        return this.factoryReturnByClassMethod.get(lookupKey) || null;
    }
    addInterfaceImplementationEdges(typeFqn, methodName, addEdge) {
        const impls = this.interfaceToImplementations.get((0, canonical_1.ensureFqn)(typeFqn));
        if (impls) {
            for (const impl of impls) {
                addEdge(impl, methodName, 'iface-impl');
                this.logger?.('[iface-impl]', String(typeFqn), '⇒', `${String(impl)}::${methodName}`);
            }
        }
    }
}
exports.EdgeIndexer = EdgeIndexer;
//# sourceMappingURL=edge-indexer.js.map