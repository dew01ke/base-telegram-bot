import typescript from 'rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import renameNodeModules from 'rollup-plugin-rename-node-modules';

export default [
  {
    input: 'src/index.ts',
    external: ['typeorm', 'telegraf', 'pg'],
    output: {
      dir: 'dist',
      format: 'cjs',
      sourcemap: false,
      preserveModules: false,
    },
    plugins: [
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
      typescript({
        transpileOnly: true
      }),
      renameNodeModules('external_modules'),
    ],
  }
];