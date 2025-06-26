/*
 * @Author: 小山
 * @Date: 2023-08-10 17:12:17
 * @LastEditTime: 2025-02-10 22:17:18
 * @FilePath: /i18n_translation_vite/packages/vitePluginsAutoI18n/src/index.ts
 */
import {
    filter,
    fileUtils,
    translateUtils,
    baseUtils,
    FunctionFactoryOption,
    OptionInfo,
    option,
    initCore
} from 'auto-i18n-plugin-core'
import { ResolvedConfig, Plugin } from 'vite'
import * as babel from '@babel/core'
export * from 'auto-i18n-plugin-core'

const allowedExtensions = ['.vue', '.ts', '.js', '.tsx', '.jsx']

export default function vitePluginsAutoI18n(optionInfo: OptionInfo) {
    const name = 'vite-auto-i18n-plugin'
    let config: ResolvedConfig

    try {
        initCore(optionInfo)
    } catch (e) {
        return { name }
    }

    const plugin: Plugin = {
        name,
        configResolved(resolvedConfig) {
            // 存储最终解析的配置
            config = resolvedConfig
        },
        async transform(code: string, path: string) {
            // todo 没有目标语言直接返回
            if (
                [...allowedExtensions, ...(option.insertFileExtensions || [])].some(ext =>
                    path.endsWith(ext)
                )
            ) {
                if (
                    option.includePath.length &&
                    !baseUtils.checkAgainstRegexArray(path, option.includePath)
                )
                    return code
                if (
                    option.excludedPath.length &&
                    baseUtils.checkAgainstRegexArray(path, option.excludedPath)
                )
                    return code

                FunctionFactoryOption.originLang = option.originLang

                let sourceObj
                if (option.translateExtends) {
                    sourceObj = await option.translateExtends?.handleInitFile(code, path)
                } else {
                    sourceObj = {
                        source: code
                    }
                }

                return babel
                    .transformAsync(sourceObj.source, {
                        configFile: false,
                        plugins: [filter.default()]
                    })
                    .then(result => {
                        if (config?.command === 'serve') {
                            translateUtils.autoTranslate() // 执行前需要确保transformAsync已经完成
                        }
                        return result?.code
                    })
                    .catch(e => {
                        console.error(e)
                    })
            }
        },
        async buildEnd() {
            console.info('构建阶段批量翻译')
            await translateUtils.autoTranslate()
        },
        async closeBundle() {
            // 翻译配置写入主文件
            await fileUtils.buildSetLangConfigToIndexFile()
            console.info('翻译完成✔')
        }
    }

    return plugin
}
