/*
 * @Date: 2025-01-08 11:51:33
 * @LastEditors: xiaoshan
 * @LastEditTime: 2025-02-13 15:49:56
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/rollup.config.ts
 */
import externals from 'rollup-plugin-node-externals'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import { fileURLToPath } from 'url'
import path from 'node:path'

const input = resolve('./src/index.ts')

function resolve(filePath: string) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    return path.resolve(__dirname, filePath)
}

const buildConfig = defineConfig({
    input: input,
    output: [
        {
            file: resolve('./dist/index.mjs'),
            format: 'esm',
            sourcemap: true // 输出 sourcemap 方便调试
        },
        {
            file: resolve('./dist/index.cjs'),
            format: 'cjs',
            sourcemap: true // 输出 sourcemap 方便调试
        }
    ],
    plugins: [
        externals(), // 自动排除 node_modules 中的依赖
        typescript({
            tsconfig: resolve('./tsconfig.json'), // 使用 tsconfig.json 中的配置
            target: 'ES5' // 兼容低版本 JavaScript
        }),
        babel({
            babelHelpers: 'runtime', // 使用 runtime 来管理 Babel helpers
            extensions: ['.js', '.ts'], // 支持 TypeScript 和 JavaScript 文件的转译
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: '14.18.0' // 明确指定 Node 14.18+ 兼容性
                        },
                        useBuiltIns: false // 库不应该注入 polyfills，由用户处理
                    }
                ]
            ],
            plugins: [
                '@babel/plugin-transform-runtime' // 使用 runtime 避免编译问题
            ]
        }),
        terser() // 压缩输出的代码
    ]
})

const dtsConfig = defineConfig({
    input: input,
    output: {
        file: resolve('./dist/index.d.ts'),
        format: 'esm'
    },
    plugins: [
        dts() // 生成类型定义文件 (.d.ts)
    ]
})

export default [buildConfig, dtsConfig]
