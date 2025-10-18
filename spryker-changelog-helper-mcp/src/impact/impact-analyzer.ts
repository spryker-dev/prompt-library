import { globby } from 'globby';
import { AnalysisResult, Logger, CanonicalKey } from '../types/domain.types';
import { PHPParser } from '../parser/php-parser';
import { canonKey } from '../utils/canonical';
import { CodeElementIndexer } from '../indexing/code-elements/indexers/code-element-indexer';
import { FactoryIndexer } from '../indexing/factory/factory-indexer';
import { EdgeIndexer } from '../indexing/graph/edge-indexer';
import { InterfaceEdgeLinker } from '../graph/interface-edge-linker';
import { EntrypointFinder } from '../graph/entrypoint-finder';

export interface AnalyzerConfig {
  root: string;
  globs: string[];
  excludes: string[];
  targets: string[];
  entrypointRegex: RegExp;
  linkInterfaces: boolean;
  debug: boolean;
  logger: Logger;
}

export class ImpactAnalyzer {
  constructor(private config: AnalyzerConfig) {}

  async analyze(): Promise<AnalysisResult> {
    const { root, globs, excludes, targets, entrypointRegex, linkInterfaces, debug, logger } = this.config;

    const files = await globby(globs, {
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

    const parser = new PHPParser();

    const codeElementIndexer = new CodeElementIndexer(parser, logger);
    const { classes, methods, ownerToFactory, classImplements } = await codeElementIndexer.indexSymbols(files);

    if (debug) {
      console.error('[info] classes:', classes.size, 'methods:', methods.size);
    }

    const factoryIndexer = new FactoryIndexer(parser, logger);
    const { factoryReturnByClassMethod } = await factoryIndexer.indexFactoryReturnTypes(files);

    if (debug) {
      console.error('[info] factory map:', factoryReturnByClassMethod.size);
    }

    const edgeIndexer = new EdgeIndexer(
      parser,
      methods,
      ownerToFactory,
      factoryReturnByClassMethod,
      classImplements,
      logger,
      debug
    );

    const { graph, reverseAdjacencyMap } = await edgeIndexer.indexEdges(files);

    if (debug) {
      console.error('[info] graph nodes:', graph.order, 'edges:', graph.size);
    }

    if (linkInterfaces) {
      InterfaceEdgeLinker.linkInterfaceEdges(methods, classImplements, reverseAdjacencyMap);
    }

    const normalizedTargets = this.normalizeTargets(targets);
    const impactedMap: Record<CanonicalKey, any[]> = {};

    for (const key of normalizedTargets) {
      if (debug) {
        const callers = reverseAdjacencyMap.get(key);
        console.error('[debug] target has callers:', !!callers, 'count:', callers ? callers.size : 0);
      }

      impactedMap[key] = EntrypointFinder.findImpactedEntrypoints(
        key,
        methods,
        reverseAdjacencyMap,
        entrypointRegex
      );
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

  private normalizeTargets(targets: string[]): CanonicalKey[] {
    const normalized: CanonicalKey[] = [];

    for (const target of targets) {
      const [cls, method] = String(target).split('::');
      if (!cls || !method) {
        console.error('Skipping invalid target (expected \\FQCN::method):', target);
        continue;
      }
      normalized.push(canonKey(cls, method));
    }

    return normalized;
  }
}
