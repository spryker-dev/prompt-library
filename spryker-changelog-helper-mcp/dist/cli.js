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
exports.run = run;
const fs = __importStar(require("fs"));
const cli_parser_1 = require("./cli/cli-parser");
const logger_1 = require("./utils/logger");
const impact_analyzer_1 = require("./impact/impact-analyzer");
const analysis_service_1 = require("./analysis/analysis-service");
const json_formatter_1 = require("./reporting/formatters/json-formatter");
async function run() {
    try {
        const options = cli_parser_1.CLIParser.parse(process.argv.slice(2));
        if (options.diff) {
            await runDiffMode(options);
            return;
        }
        await runImpactMode(options);
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}
async function runImpactMode(options) {
    const logger = options.log ? logger_1.LoggerFactory.createLogger(options.root, options.log) : null;
    const analyzer = new impact_analyzer_1.ImpactAnalyzer({
        root: options.root,
        globs: Array.isArray(options.globs) ? options.globs : [options.globs],
        excludes: Array.isArray(options.excludes) ? options.excludes : [options.excludes],
        targets: options.targets,
        entrypointRegex: new RegExp(options.entrypoints),
        linkInterfaces: !options.noInterfaces,
        logger,
        debug: options.debug,
    });
    const result = await analyzer.analyze();
    if (options.json) {
        console.log(JSON.stringify(result, null, 2));
    }
    else {
        console.log('Analysis complete.');
        console.log(JSON.stringify(result, null, 2));
    }
    if (options.log) {
        fs.writeFileSync(options.log, JSON.stringify(result, null, 2));
    }
}
async function runDiffMode(options) {
    const service = new analysis_service_1.ImpactAnalysisService(options.modulePatterns);
    const analysisOptions = {
        root: options.root,
        diff: options.diff,
        excludes: options.excludes,
        includeTests: options.includeTests,
        debug: options.debug,
        modules: options.modules,
    };
    const analysisResult = await service.analyze(analysisOptions);
    const report = await service.generateReport(analysisResult, options.root);
    if (options.changelog) {
        const { ChangelogFormatter } = require('./reporting/formatters/changelog-formatter');
        const changelogFormatter = new ChangelogFormatter();
        const changelogReport = changelogFormatter.format(report, report.moduleReports);
        const changelogJson = changelogFormatter.formatAsJson(changelogReport);
        console.log(changelogJson);
    }
    else {
        const jsonFormatter = new json_formatter_1.JsonFormatter();
        const cleanJson = jsonFormatter.format(report);
        console.log(cleanJson);
    }
}
if (require.main === module) {
    run();
}
//# sourceMappingURL=cli.js.map