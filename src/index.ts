import type { Plugin, ResolvedConfig } from 'vite';
import type { Options } from './types';
import { extname, join, sep } from 'pathe';
import { filename } from 'pathe/utils';
import {
  merge,
  readAllFiles,
  logErrors,
  logOptimizationStats,
  processFile,
  getFilesToProcess,
  ensureCacheDirectoryExists,
} from './utils';
import { PLUGIN_NAME, DEFAULT_OPTIONS } from './constants';
import fsp from 'fs/promises';
import fs from 'fs';

function FarmfeImageOptimizer(optionsParam: Options = {}): Plugin {
  const options: Options = merge(optionsParam, DEFAULT_OPTIONS);

  let outputPath: string;
  let publicDir: string;
  let rootConfig: ResolvedConfig;

  const sizesMap = new Map<
    string,
    { size: number; oldSize: number; ratio: number; skipWrite: boolean; isCached: boolean }
  >();
  const mtimeCache = new Map<string, number>();
  const errorsMap = new Map<string, string>();

  return {
    name: PLUGIN_NAME,
    enforce: 'post',
    apply: 'build',
    configResolved(c) {
      rootConfig = c;
      outputPath = c.build.outDir;
      if (typeof c.publicDir === 'string') {
        publicDir = c.publicDir.replace(/\\/g, '/');
      }
    },
    generateBundle: async (_, bundler) => {
      const allFiles: string[] = Object.keys(bundler);
      const files: string[] = getFilesToProcess(allFiles, (path) => (bundler[path] as any).name, options);

      if (files.length > 0) {
        await ensureCacheDirectoryExists(options);

        const handles = files.map(async (filePath: string) => {
          const source = (bundler[filePath] as any).source;
          const { content, skipWrite } = await processFile(filePath, source, options, sizesMap, errorsMap);
          if (content?.length > 0 && !skipWrite) {
            (bundler[filePath] as any).source = content;
          }
        });
        await Promise.all(handles);
      }
    },
    async closeBundle() {
      if (publicDir && options.includePublic) {
        const allFiles: string[] = readAllFiles(publicDir);
        const files: string[] = getFilesToProcess(allFiles, (path) => filename(path) + extname(path), options);

        if (files.length > 0) {
          await ensureCacheDirectoryExists(options);

          const handles = files.map(async (publicFilePath: string) => {
            const filePath: string = publicFilePath.replace(publicDir + sep, '');
            const fullFilePath: string = join(rootConfig.root, outputPath, filePath);

            if (fs.existsSync(fullFilePath) === false) return;

            const { mtimeMs } = await fsp.stat(fullFilePath);
            if (mtimeMs <= (mtimeCache.get(filePath) || 0)) return;

            const buffer: Buffer = await fsp.readFile(fullFilePath);
            const { content, skipWrite } = await processFile(filePath, buffer, options, sizesMap, errorsMap);

            if (content?.length > 0 && !skipWrite) {
              await fsp.writeFile(fullFilePath, content);
              mtimeCache.set(filePath, Date.now());
            }
          });
          await Promise.all(handles);
        }
      }
      if (sizesMap.size > 0 && options.logStats) {
        logOptimizationStats(rootConfig, sizesMap, options.ansiColors);
      }
      if (errorsMap.size > 0) {
        logErrors(rootConfig, errorsMap, options.ansiColors);
      }
    },
  };
}

export { FarmfeImageOptimizer };
