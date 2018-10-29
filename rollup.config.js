import path from 'path';
import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';

import pkg from './package.json';

process.env.NODE_ENV = 'production';

const createConfig = ({ umd = false, output } = {}) => ({
  input: 'src/index.ts',
  output,
  external: [
    ...Object.keys(umd ? {} : pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript(),
    umd && uglify(),
    license({
      banner: {
        file: path.join(__dirname, 'LICENSE'),
      },
    }),
  ].filter(Boolean),
});

export default [
  createConfig({
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  }),
  createConfig({
    umd: true,
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'TbdDnd',
    },
  }),
];