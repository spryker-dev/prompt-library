import * as path from 'path';
import * as fs from 'fs';
import minimist from 'minimist';
import { getEntrypointPattern } from '../spryker/constants/spryker-constants';

export interface CLIOptions {
  root: string;
  globs: string[];
  excludes: string[];
  targets: string[];
  entrypoints: string;
  json: boolean;
  changelog: boolean;
  debug: boolean;
  noInterfaces: boolean;
  log?: string;
  diff?: string;
  includeTests?: boolean;
  noOutputFiles?: boolean;
  modulePatternsFile?: string;
  modules?: string[];
}

export class CLIParser {
  static parse(args: string[]): CLIOptions {
    const argv = minimist(args, {
      string: ['root', 'globs', 'exclude', 'target', 'targets', 'targets-file', 'entrypoints', 'log', 'diff', 'module-patterns', 'module', 'modules'],
      boolean: ['json', 'changelog', 'debug', 'no-interfaces', 'include-tests', 'no-output-files'],
      default: {
        root: process.cwd(),
        globs: 'src/**/*.php',
        exclude: 'vendor/**',
        entrypoints: getEntrypointPattern(),
        json: false,
        changelog: false,
        debug: false,
        diff: undefined,
        'include-tests': false,
        'no-output-files': false,
        'module-patterns': undefined,
      },
    });

    if (argv.help) {
      this.printHelp();
      process.exit(0);
    }

    const root = path.resolve(argv.root);
    const globs = Array.isArray(argv.globs) ? argv.globs : [argv.globs];
    const excludes = (Array.isArray(argv.exclude) ? argv.exclude : [argv.exclude]).filter(Boolean);
    const targets = this.parseTargets(argv, root);

    const modules = this.parseModules(argv);

    return {
      root,
      globs,
      excludes,
      targets,
      entrypoints: argv.entrypoints,
      json: argv.json,
      changelog: argv.changelog,
      debug: argv.debug,
      noInterfaces: argv['no-interfaces'],
      log: argv.log,
      diff: argv.diff,
      includeTests: argv['include-tests'],
      noOutputFiles: argv['output-files'] === false,
      modulePatternsFile: argv['module-patterns'],
      modules,
    };
  }

  private static parseTargets(argv: any, root: string): string[] {
    let targets: string[] = [];

    if (argv.target) {
      targets = targets.concat(Array.isArray(argv.target) ? argv.target : [argv.target]);
    }

    if (argv.targets) {
      targets = targets.concat(
        String(argv.targets)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }

    if (argv['targets-file']) {
      const targetsFilePath = path.resolve(root, String(argv['targets-file']));
      if (fs.existsSync(targetsFilePath)) {
        const raw = fs.readFileSync(targetsFilePath, 'utf8');
        const lines = raw
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        targets = targets.concat(lines);
      }
    }

    targets = targets.filter(Boolean);

    // Targets are optional in diff mode
    if (!targets.length && !argv.diff) {
      console.error('Error: provide at least one --target, or --targets "A::m,B::n", or --targets-file path');
      process.exit(1);
    }

    return Array.from(new Set(targets));
  }

  private static parseModules(argv: any): string[] | undefined {
    let modules: string[] = [];

    if (argv.module) {
      modules = modules.concat(Array.isArray(argv.module) ? argv.module : [argv.module]);
    }

    if (argv.modules) {
      modules = modules.concat(
        String(argv.modules)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }

    modules = modules.filter(Boolean);
    return modules.length > 0 ? Array.from(new Set(modules)) : undefined;
  }

  private static printHelp(): void {
    console.log(`
Spryker Changelog Helper MCP v1.0.0
Comprehensive change analysis and automated changelog generation for Spryker projects

Usage:
  node spryker-changelog.js [options]

Options:
  --root <path>              Root directory of the project (default: current directory)
  --globs <pattern>          Glob patterns for PHP files to analyze (default: src/**/*.php)
  --exclude <pattern>        Glob patterns to exclude (default: vendor/**)
  --target <FQCN::method>    Target method to analyze (can be specified multiple times)
  --targets <list>           Comma-separated list of target methods
  --targets-file <path>      File containing target methods (one per line)
  --entrypoints <regex>      Regex pattern to match entrypoint classes (default: ${getEntrypointPattern()})
  --json                     Output results as JSON
  --changelog                Output changelog-friendly format (structured for AI/human changelog generation)
  --debug                    Enable debug output
  --no-interfaces            Disable interface edge linking
  --log <path>               Path to log file for detailed debugging
  --diff <branch>            Analyze git diff against specified branch (e.g., origin/master)
  --include-tests            Include test files in diff analysis
  --no-output-files          Skip writing output files (console only)
  --module <name>            Filter results to specific module(s) (can be specified multiple times)
  --modules <list>           Comma-separated list of modules to filter
  --help                     Show this help message

Examples:
  node spryker-changelog.js --target "\\MyClass::myMethod" --json
  node spryker-changelog.js --targets "\\A::m1,\\B::m2" --debug
  node spryker-changelog.js --targets-file targets.txt --log debug.log
  node spryker-changelog.js --diff origin/master --json
  node spryker-changelog.js --diff origin/master --include-tests
  node spryker-changelog.js --diff origin/master --module Acl --json
  node spryker-changelog.js --diff origin/master --modules "Acl,MerchantProductOffer" --json
    `);
  }
}
