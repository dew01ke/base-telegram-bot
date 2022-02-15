import typescript from 'rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import renameNodeModules from 'rollup-plugin-rename-node-modules';

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
      preserveModules: false
    },
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({
        transpileOnly: true
      }),
      renameNodeModules('external_modules'),
    ],
  }
];