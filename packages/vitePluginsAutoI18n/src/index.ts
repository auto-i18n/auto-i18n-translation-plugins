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
    initOption,
    checkOption
} from 'auto-i18n-plugin-core'
import { ResolvedConfig, Plugin } from 'vite'
import * as babel from '@babel/core'
export * from 'auto-i18n-plugin-core'

const allowedExtensions = ['.vue', '.ts', '.js', '.tsx', '.jsx']

export default function vitePluginsAutoI18n(optionInfo: OptionInfo) {
    const name = 'vite-auto-i18n-plugin'
    let config: ResolvedConfig

    initOption(optionInfo)

    if (!checkOption()) return { name }

    fileUtils.initLangFile()
    const originLangObj = fileUtils.getLangObjByJSONFileWithLangKey(option.originLang)
    translateUtils.languageConfigCompletion(originLangObj)
    translateUtils.initLangObj(originLangObj)

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
                            // 改为批量防抖调用，避免多次输出
                            translateUtils.scheduleAutoTranslate(path)
                        }
                        return result?.code
                    })
                    .catch(e => {
                        console.error(e)
                    })
            }
        },
        async buildEnd() {
            // 构建阶段批量翻译与统一输出
            await translateUtils.runAutoTranslateBatch()
        },
        async closeBundle() {
            translateUtils.cleanupUnusedTranslations()
            // 仅在有变更时写入主文件，避免空写入污染工作区
            if (translateUtils.hasTranslationChanges) {
                await fileUtils.buildSetLangConfigToIndexFile()
            }
            // 不在此处重复打印“翻译完成”，防止多次输出
        }
    }

    return plugin
}
