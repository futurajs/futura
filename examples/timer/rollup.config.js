import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy'

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    file: '_build/index.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs({extensions: [ '.js' ]}),
    production && terser(),
    copy({
      targets: [
        { src: 'src/index.html', dest: '_build/' }
      ]
    }),
    !production && serve('_build'),
  ]
};
