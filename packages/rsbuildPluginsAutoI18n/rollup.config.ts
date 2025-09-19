import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { babel } from '@rollup/plugin-babel'
import nodeExternals from 'rollup-plugin-node-externals'
import dts from 'rollup-plugin-dts'

export default defineConfig([
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.cjs',
                format: 'cjs',
                exports: 'auto'
            },
            {
                file: 'dist/index.mjs',
                format: 'es'
            }
        ],
        plugins: [
            nodeExternals({
                devDeps: false
            }),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false
            }),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
                extensions: ['.js', '.ts']
            })
        ]
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'es'
        },
        plugins: [
            nodeExternals({
                devDeps: false
            }),
            dts()
        ]
    }
])
