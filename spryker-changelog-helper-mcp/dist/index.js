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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFactory = exports.ChainUnwrapper = exports.CanonicalNameUtils = exports.NameResolver = exports.PHPParser = exports.InterfaceEdgeLinker = exports.EntrypointFinder = exports.EdgeIndexer = exports.FactoryIndexer = exports.CodeElementIndexer = exports.ImpactAnalyzer = void 0;
var impact_analyzer_1 = require("./impact/impact-analyzer");
Object.defineProperty(exports, "ImpactAnalyzer", { enumerable: true, get: function () { return impact_analyzer_1.ImpactAnalyzer; } });
var code_element_indexer_1 = require("./indexing/code-elements/indexers/code-element-indexer");
Object.defineProperty(exports, "CodeElementIndexer", { enumerable: true, get: function () { return code_element_indexer_1.CodeElementIndexer; } });
var factory_indexer_1 = require("./indexing/factory/factory-indexer");
Object.defineProperty(exports, "FactoryIndexer", { enumerable: true, get: function () { return factory_indexer_1.FactoryIndexer; } });
var edge_indexer_1 = require("./indexing/graph/edge-indexer");
Object.defineProperty(exports, "EdgeIndexer", { enumerable: true, get: function () { return edge_indexer_1.EdgeIndexer; } });
var entrypoint_finder_1 = require("./graph/entrypoint-finder");
Object.defineProperty(exports, "EntrypointFinder", { enumerable: true, get: function () { return entrypoint_finder_1.EntrypointFinder; } });
var interface_edge_linker_1 = require("./graph/interface-edge-linker");
Object.defineProperty(exports, "InterfaceEdgeLinker", { enumerable: true, get: function () { return interface_edge_linker_1.InterfaceEdgeLinker; } });
var php_parser_1 = require("./parser/php-parser");
Object.defineProperty(exports, "PHPParser", { enumerable: true, get: function () { return php_parser_1.PHPParser; } });
var name_resolver_1 = require("./utils/name-resolver");
Object.defineProperty(exports, "NameResolver", { enumerable: true, get: function () { return name_resolver_1.NameResolver; } });
var canonical_1 = require("./utils/canonical");
Object.defineProperty(exports, "CanonicalNameUtils", { enumerable: true, get: function () { return canonical_1.CanonicalNameUtils; } });
var chain_unwrapper_1 = require("./utils/chain-unwrapper");
Object.defineProperty(exports, "ChainUnwrapper", { enumerable: true, get: function () { return chain_unwrapper_1.ChainUnwrapper; } });
var logger_1 = require("./utils/logger");
Object.defineProperty(exports, "LoggerFactory", { enumerable: true, get: function () { return logger_1.LoggerFactory; } });
__exportStar(require("./types/domain.types"), exports);
__exportStar(require("./types/ast.types"), exports);
//# sourceMappingURL=index.js.map