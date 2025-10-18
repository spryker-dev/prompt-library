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
exports.OutputFormatter = void 0;
const path = __importStar(require("path"));
class OutputFormatter {
    static formatJSON(result, logPath, root) {
        process.stdout.write(JSON.stringify(result, null, 2) + '\n');
        if (logPath && root) {
            console.error('[log] wrote details to', path.resolve(root, String(logPath)));
        }
    }
    static formatText(result) {
        console.log(`Impacted entrypoints matching /${result.entrypointRegex}/i`);
        for (const targetKey of result.targets) {
            console.log(`\nTarget: ${targetKey}`);
            const impacted = result.impacted[targetKey] || [];
            if (!impacted.length) {
                console.log('  (none)');
                continue;
            }
            for (const item of impacted) {
                console.log(`  - ${item.key}  [hops=${item.hops}]`);
            }
        }
    }
}
exports.OutputFormatter = OutputFormatter;
//# sourceMappingURL=output-formatter.js.map