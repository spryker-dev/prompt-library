import * as fs from 'fs';
import { CLIParser } from './cli/cli-parser';
import { LoggerFactory } from './utils/logger';
import { ImpactAnalyzer } from './impact/impact-analyzer';
import { ImpactAnalysisService, AnalysisOptions } from './analysis/analysis-service';
import { JsonFormatter } from './reporting/formatters/json-formatter';

export async function run(): Promise<void> {
  try {
    const options = CLIParser.parse(process.argv.slice(2));

    if (options.diff) {
      await runDiffMode(options);
      return;
    }

    await runImpactMode(options);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function runImpactMode(options: any): Promise<void> {
  const logger = options.log ? LoggerFactory.createLogger(options.root, options.log) : null;

  const analyzer = new ImpactAnalyzer({
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
  } else {
    console.log('Analysis complete.');
    console.log(JSON.stringify(result, null, 2));
  }

  if (options.log) {
    fs.writeFileSync(options.log, JSON.stringify(result, null, 2));
  }
}

async function runDiffMode(options: any): Promise<void> {
  const service = new ImpactAnalysisService(options.modulePatterns);
  
  const analysisOptions: AnalysisOptions = {
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
  } else {
    const jsonFormatter = new JsonFormatter();
    const cleanJson = jsonFormatter.format(report);
    console.log(cleanJson);
  }
}

if (require.main === module) {
  run();
}
