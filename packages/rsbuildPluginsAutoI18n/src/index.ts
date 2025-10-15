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
import type { RsbuildPlugin, RsbuildPluginAPI } from '@rsbuild/core'
import * as babel from '@babel/core'

// 重新导出核心模块
export * from 'auto-i18n-plugin-core'

const allowedExtensions = ['.vue', '.ts', '.js', '.tsx', '.jsx']

/**
 * Rsbuild 自动翻译插件
 * @param optionInfo 插件配置选项
 * @returns Rsbuild 插件对象
 */
export default function rsbuildPluginsAutoI18n(optionInfo: OptionInfo): RsbuildPlugin {
    const name = 'rsbuild-auto-i18n-plugin'

    // 初始化插件配置
    initOption(optionInfo)

    // 配置验证失败时返回空插件
    if (!checkOption()) {
        return {
            name,
            setup() {
                // 空的 setup 函数
            }
        }
    }

    // 初始化语言文件和翻译对象
    fileUtils.initLangFile()
    const originLangObj = fileUtils.getLangObjByJSONFileWithLangKey(option.originLang)
    translateUtils.languageConfigCompletion(originLangObj)
    translateUtils.initLangObj(originLangObj)

    const plugin: RsbuildPlugin = {
        name,
        setup(api: RsbuildPluginAPI) {
            // 存储配置信息
            let isDevMode = false

            api.onBeforeStartDevServer(() => {
                isDevMode = true
            })

            // 创建动态正则表达式匹配所有支持的文件扩展名
            const extensionsPattern = new RegExp(
                `\\.(${[...allowedExtensions, ...(option.insertFileExtensions || [])].map(ext => ext.slice(1)).join('|')})$`
            )

            api.transform(
                { test: extensionsPattern, order: 'post' },
                async ({ code, resourcePath }: { code: string; resourcePath: string }) => {
                    // 白名单检查
                    if (
                        option.includePath.length &&
                        !baseUtils.checkAgainstRegexArray(resourcePath, option.includePath)
                    ) {
                        return { code }
                    }

                    // 黑名单检查
                    if (
                        option.excludedPath.length &&
                        baseUtils.checkAgainstRegexArray(resourcePath, option.excludedPath)
                    ) {
                        return { code }
                    }

                    // 设置源语言
                    FunctionFactoryOption.originLang = option.originLang

                    // 处理扩展功能
                    let sourceObj
                    if (option.translateExtends) {
                        sourceObj = await option.translateExtends?.handleInitFile(
                            code,
                            resourcePath
                        )
                    } else {
                        sourceObj = {
                            source: code
                        }
                    }

                    try {
                        // 使用 Babel 进行 AST 转换
                        const result = await babel.transformAsync(sourceObj.source, {
                            configFile: false,
                            plugins: [filter.default(sourceObj)]
                        })

                        // 开发模式下执行实时翻译
                        if (isDevMode) {
                            translateUtils.autoTranslate() // 执行前需要确保transformAsync已经完成
                        }

                        return {
                            code: result?.code || code
                        }
                    } catch (e) {
                        console.error('Rsbuild auto-i18n plugin transform error:', e)
                        return { code }
                    }
                }
            )

            // 构建开始前
            api.onBeforeBuild(() => {
                console.info('Rsbuild 构建阶段批量翻译开始')
            })

            // 构建结束后
            api.onAfterBuild(async () => {
                console.info('构建阶段批量翻译')
                await translateUtils.autoTranslate()
            })

            // 构建完全结束
            api.onCloseBuild(async () => {
                translateUtils.cleanupUnusedTranslations()
                // 翻译配置写入主文件
                await fileUtils.buildSetLangConfigToIndexFile()
                console.info('翻译完成✔')
            })

            // 开发服务器关闭时也需要清理
            api.onCloseDevServer(async () => {
                translateUtils.cleanupUnusedTranslations()
                await fileUtils.buildSetLangConfigToIndexFile()
                console.info('开发服务器关闭，翻译完成✔')
            })
        }
    }

    return plugin
}
