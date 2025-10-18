"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeIndexer = void 0;
const graph_builder_1 = require("./graph-builder");
const parameter_processor_1 = require("./parameter-processor");
const property_type_tracker_1 = require("./property-type-tracker");
const type_resolver_1 = require("./type-resolver");
const factory_call_resolver_1 = require("./factory-call-resolver");
const method_call_processor_1 = require("./method-call-processor");
const file_processor_1 = require("./file-processor");
const ast_walker_1 = require("./ast-walker");
const class_processor_1 = require("./class-processor");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
const canonical_1 = require("../../utils/canonical");
class EdgeIndexer {
    constructor(parser, methods, ownerToFactory, factoryReturnByClassMethod, classImplements, logger, _debug) {
        this.graphBuilder = new graph_builder_1.GraphBuilder(methods);
        this.fileProcessor = new file_processor_1.FileProcessor(parser);
        this.astWalker = new ast_walker_1.AstWalker(parser);
        this.typeResolver = new type_resolver_1.TypeResolver();
        this.factoryCallResolver = new factory_call_resolver_1.FactoryCallResolver(ownerToFactory, factoryReturnByClassMethod);
        const parameterProcessor = new parameter_processor_1.ParameterProcessor(logger);
        const propertyTypeTracker = new property_type_tracker_1.PropertyTypeTracker(logger);
        const methodCallProcessor = new method_call_processor_1.MethodCallProcessor(ownerToFactory, factoryReturnByClassMethod, this.buildInterfaceMap(classImplements), logger);
        this.propertyTypesByClass = new Map();
        this.classProcessor = new class_processor_1.ClassProcessor(parser, this.graphBuilder, parameterProcessor, propertyTypeTracker, methodCallProcessor, this.propertyTypesByClass);
    }
    buildInterfaceMap(classImplements) {
        const map = new Map();
        for (const [classFqn, interfaces] of classImplements) {
            for (const interfaceFqn of interfaces) {
                const key = (0, canonical_1.ensureFqn)(interfaceFqn);
                if (!map.has(key)) {
                    map.set(key, new Set());
                }
                map.get(key).add((0, canonical_1.ensureFqn)(classFqn));
            }
        }
        return map;
    }
    async indexEdges(files) {
        await this.fileProcessor.processFiles(files, (ast) => {
            this.astWalker.walkAst(ast, (classNode, namespace, uses) => {
                const className = classNode.name ? String(classNode.name.name) : null;
                if (!className)
                    return;
                const classFqn = (0, canonical_1.ensureFqn)(namespace ? `${namespace}\\${className}` : className);
                this.classProcessor.processClass(classNode, namespace, uses, (expr) => {
                    const basicType = this.typeResolver.resolveExpressionType(expr, {}, {}, namespace, uses);
                    if (basicType)
                        return basicType;
                    if (expr?.kind === ast_node_kinds_1.AstNodeKind.CALL) {
                        return this.factoryCallResolver.resolveFactoryCallReturnType(expr, classFqn);
                    }
                    return null;
                });
            });
        });
        return {
            graph: this.graphBuilder.getGraph(),
            reverseAdjacencyMap: this.graphBuilder.getReverseAdjacencyMap(),
        };
    }
}
exports.EdgeIndexer = EdgeIndexer;
//# sourceMappingURL=edge-indexer.js.map