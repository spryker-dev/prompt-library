import * as path from 'path';
import { AnalysisResult } from '../types/domain.types';

export class OutputFormatter {
  static formatJSON(result: AnalysisResult, logPath?: string, root?: string): void {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    if (logPath && root) {
      console.error('[log] wrote details to', path.resolve(root, String(logPath)));
    }
  }

  static formatText(result: AnalysisResult): void {
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
