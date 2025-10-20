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
exports.LoggerFactory = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class LoggerFactory {
    static createLogger(rootDir, logPath) {
        if (!logPath)
            return null;
        const resolvedPath = path.resolve(rootDir, String(logPath));
        try {
            fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
        }
        catch {
            // Directory might already exist
        }
        try {
            const stream = fs.createWriteStream(resolvedPath, { flags: 'w' });
            const logLine = (...args) => {
                const parts = args.map((x) => typeof x === 'string' ? x : x === undefined ? 'undefined' : JSON.stringify(x));
                stream.write(parts.join(' ') + '\n');
            };
            process.on('exit', () => {
                try {
                    stream.end();
                }
                catch {
                    // Ignore errors on exit
                }
            });
            return logLine;
        }
        catch (e) {
            console.error('[log] Failed to open log file', resolvedPath, e?.message || e);
            return null;
        }
    }
}
exports.LoggerFactory = LoggerFactory;
//# sourceMappingURL=logger.js.map