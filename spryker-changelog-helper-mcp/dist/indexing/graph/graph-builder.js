"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphBuilder = void 0;
const graphology_1 = __importDefault(require("graphology"));
const canonical_1 = require("../../utils/canonical");
class GraphBuilder {
    constructor(methods) {
        this.methods = methods;
        this.graph = new graphology_1.default();
        this.reverseAdjacencyMap = new Map();
    }
    ensureMethodNode(key, classFqn, methodName) {
        if (!this.graph.hasNode(key)) {
            const metadata = this.methods.get(key);
            this.graph.addNode(key, metadata
                ? { classFQN: metadata.classFQN, method: metadata.name, visibility: metadata.visibility }
                : { classFQN: (0, canonical_1.ensureFqn)(classFqn), method: methodName, visibility: 'unknown' });
        }
    }
    addEdge(callerKey, calleeKey, kind) {
        if (!this.graph.hasEdge(callerKey, calleeKey)) {
            this.graph.addEdge(callerKey, calleeKey, { kind });
        }
        if (!this.reverseAdjacencyMap.has(calleeKey)) {
            this.reverseAdjacencyMap.set(calleeKey, new Set());
        }
        this.reverseAdjacencyMap.get(calleeKey).add(callerKey);
    }
    getGraph() {
        return this.graph;
    }
    getReverseAdjacencyMap() {
        return this.reverseAdjacencyMap;
    }
}
exports.GraphBuilder = GraphBuilder;
//# sourceMappingURL=graph-builder.js.map