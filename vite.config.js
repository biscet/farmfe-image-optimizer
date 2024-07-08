import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

export default defineConfig(() => {
  return {
    plugins: [
      dts({
        insertTypesEntry: true,
        copyDtsFiles: true,
      }),
    ],
    build: {
      minify: 'terser',
      emptyOutDir: true,
      brotliSize: false,
      sourcemap: false,
      terserOptions: {
        compress: {
          dead_code: true,
          drop_console: true,
          drop_debugger: true,
        },
        mangle: true,
        format: {
          comments: false,
        },
      },
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'farmfe-image-optimizer',
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      rollupOptions: {
        external: ['fs', 'fs/promises', 'sharp', ...Object.keys(pkg.dependencies)],
        output: {
          globals: {
            fs: 'fs',
            'fs/promises': 'fsp',
            sharp: 'sharp',
          },
        },
      },
    },
  };
});
