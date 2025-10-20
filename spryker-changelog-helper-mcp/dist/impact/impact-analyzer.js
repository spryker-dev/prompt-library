"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactAnalyzer = void 0;
const globby_1 = require("globby");
const php_parser_1 = require("../parser/php-parser");
const canonical_1 = require("../utils/canonical");
const code_element_indexer_1 = require("../indexing/code-elements/indexers/code-element-indexer");
const factory_indexer_1 = require("../indexing/factory/factory-indexer");
const edge_indexer_1 = require("../indexing/graph/edge-indexer");
const interface_edge_linker_1 = require("../graph/interface-edge-linker");
const entrypoint_finder_1 = require("../graph/entrypoint-finder");
class ImpactAnalyzer {
    constructor(config) {
        this.config = config;
    }
    async analyze() {
        const { root, globs, excludes, targets, entrypointRegex, linkInterfaces, debug, logger } = this.config;
        const files = await (0, globby_1.globby)(globs, {
            cwd: root,
            absolute: true,
            ignore: excludes,
        });
        if (!files.length) {
            throw new Error('No PHP files matched the provided globs');
        }
        if (debug) {
            console.error('[info] files:', files.length);
        }
        const parser = new php_parser_1.PHPParser();
        const codeElementIndexer = new code_element_indexer_1.CodeElementIndexer(parser, logger);
        const { classes, methods, ownerToFactory, classImplements } = await codeElementIndexer.indexSymbols(files);
        if (debug) {
            console.error('[info] classes:', classes.size, 'methods:', methods.size);
        }
        const factoryIndexer = new factory_indexer_1.FactoryIndexer(parser, logger);
        const { factoryReturnByClassMethod } = await factoryIndexer.indexFactoryReturnTypes(files);
        if (debug) {
            console.error('[info] factory map:', factoryReturnByClassMethod.size);
        }
        const edgeIndexer = new edge_indexer_1.EdgeIndexer(parser, methods, ownerToFactory, factoryReturnByClassMethod, classImplements, logger, debug);
        const { graph, reverseAdjacencyMap } = await edgeIndexer.indexEdges(files);
        if (debug) {
            console.error('[info] graph nodes:', graph.order, 'edges:', graph.size);
        }
        if (linkInterfaces) {
            interface_edge_linker_1.InterfaceEdgeLinker.linkInterfaceEdges(methods, classImplements, reverseAdjacencyMap);
        }
        const normalizedTargets = this.normalizeTargets(targets);
        const impactedMap = {};
        for (const key of normalizedTargets) {
            if (debug) {
                const callers = reverseAdjacencyMap.get(key);
                console.error('[debug] target has callers:', !!callers, 'count:', callers ? callers.size : 0);
            }
            impactedMap[key] = entrypoint_finder_1.EntrypointFinder.findImpactedEntrypoints(key, methods, reverseAdjacencyMap, entrypointRegex);
        }
        return {
            entrypointRegex: entrypointRegex.source,
            targets: normalizedTargets,
            counts: {
                classes: classes.size,
                methods: methods.size,
                nodes: graph.order,
                edges: graph.size,
            },
            impacted: impactedMap,
            symbolIndex: { classes, methods, ownerToFactory, classImplements },
        };
    }
    normalizeTargets(targets) {
        const normalized = [];
        for (const target of targets) {
            const [cls, method] = String(target).split('::');
            if (!cls || !method) {
                console.error('Skipping invalid target (expected \\FQCN::method):', target);
                continue;
            }
            normalized.push((0, canonical_1.canonKey)(cls, method));
        }
        return normalized;
    }
}
exports.ImpactAnalyzer = ImpactAnalyzer;
//# sourceMappingURL=impact-analyzer.js.map