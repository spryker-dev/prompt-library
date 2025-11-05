import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../types/domain.types';

export class LoggerFactory {
  static createLogger(rootDir: string, logPath?: string): Logger {
    if (!logPath) return null;

    const resolvedPath = path.resolve(rootDir, String(logPath));

    try {
      fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
    } catch {
      // Directory might already exist
    }

    try {
      const stream = fs.createWriteStream(resolvedPath, { flags: 'w' });

      const logLine: Logger = (...args: any[]) => {
        const parts = args.map((x) =>
          typeof x === 'string' ? x : x === undefined ? 'undefined' : JSON.stringify(x)
        );
        stream.write(parts.join(' ') + '\n');
      };

      process.on('exit', () => {
        try {
          stream.end();
        } catch {
          // Ignore errors on exit
        }
      });

      return logLine;
    } catch (e: any) {
      console.error('[log] Failed to open log file', resolvedPath, e?.message || e);
      return null;
    }
  }
}
