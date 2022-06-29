import typescript from 'rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import renameNodeModules from 'rollup-plugin-rename-node-modules';

export default [
  {
    input: 'src/index.ts',
    external: ['typeorm', 'telegraf', 'pg', 'reflect-metadata'],
    output: {
      dir: 'dist',
      format: 'cjs',
      sourcemap: false,
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    plugins: [
      resolve({
        moduleDirectories: ['node_modules']
      }),
      commonjs(),
      json(),
      typescript({
        transpileOnly: true
      }),
    ],
  }
];