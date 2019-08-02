import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
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
    commonjs(),
    production && uglify(),
    copy({
      targets: [
        { src: "src/index.html", dest: "_build/" }
      ]
    }),
    !production && serve('_build'),
  ]
};
