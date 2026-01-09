import {
    filter,
    fileUtils,
    translateUtils,
    baseUtils,
    FunctionFactoryOption,
    OptionInfo,
    option,
    initOption,
    checkOption,
    initCore
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

    const plugin: RsbuildPlugin = {
        name,
        async setup(api: RsbuildPluginAPI) {
            try {
                initCore(optionInfo)
            } catch (e) {
                return
            }

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
                async ({ code, resourcePath }) => {
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

                        // 开发模式下：改为批量防抖调用，避免每次 transform 都触发完整翻译流程与重复输出
                        if (isDevMode) {
                            translateUtils.scheduleAutoTranslate(resourcePath)
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

            // 构建开始前（保留简短提示或可删除）
            api.onBeforeBuild(() => {
                console.info('Rsbuild 构建阶段批量翻译开始')
            })

            // 构建结束后：批量翻译并统一输出
            api.onAfterBuild(async () => {
                console.info('构建阶段批量翻译')
                await translateUtils.runAutoTranslateBatch()
            })

            // 构建完全结束：清理并按需写入主文件（避免空写入）
            api.onCloseBuild(async () => {
                if (translateUtils.hasTranslationChanges) {
                    await fileUtils.buildSetLangConfigToIndexFile()
                }
            })

            // 开发服务器关闭时也需要清理并按需写入
            api.onCloseDevServer(async () => {
                if (translateUtils.hasTranslationChanges) {
                    await fileUtils.buildSetLangConfigToIndexFile()
                }
                console.info('开发服务器关闭，翻译完成✔')
            })
        }
    }

    return plugin
}
