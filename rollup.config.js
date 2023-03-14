import builtins from 'builtin-modules/static'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import { minify } from 'terser'


const transformCopy = async (contents) => {
  const { code } = await minify(contents.toString())

  return code
}

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: './lib',
        format: 'cjs',
        exports: 'named',
      },
      {
        dir: './dist',
        format: 'es',
        exports: 'named',
      },
    ],
    external: [
      ...builtins,
    ],
    plugins: [
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
      typescript({
        clean: true,
      }),
      terser(),
      copy({
        targets: [
          { src: 'src/polyfill.js', dest: [ 'dist', 'lib' ], transform: transformCopy },
        ]
      })
    ],
  }
]
