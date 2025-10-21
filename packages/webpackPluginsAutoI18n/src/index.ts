// plugin.ts
// 从 webpack 导入核心接口
// 导入 auto-i18n-plugin-core 提供的工具和类型
import {
    fileUtils,
    translateUtils,
    OptionInfo,
    option,
    initOption,
    checkOption,
    FunctionFactoryOption
} from 'auto-i18n-plugin-core'
// 兼容 webpack 4 和 5 的导入方式
import * as webpack from 'webpack'
// 导入 path 模块，用于处理文件和目录路径
import path from 'path'

// 重新导出 auto-i18n-plugin-core 内容
export * from 'auto-i18n-plugin-core'

/**
 * 允许处理的文件扩展名列表。
 * 如果只处理 `.js` 文件，可能会有遗漏。
 * 因此需要结合用户的配置，只处理特定目录内的指定文件类型。
 */
const allowedExtensions = ['.vue', '.tsx', '.jsx', '.js', '.ts']

/**
 * Webpack 插件实现，用于自动化处理国际化翻译功能
 * 兼容 webpack 4 和 5
 */
export default class webpackPluginsAutoI18n {
    /**
     * 初始化插件并合并用户配置
     * @param optionInfo 用户提供的配置
     */
    constructor(optionInfo: OptionInfo) {
        // 初始化插件配置
        initOption(optionInfo)

        // 检查配置有效性，如果无效则不执行后续逻辑
        if (!checkOption()) return

        // 初始化语言文件
        fileUtils.initLangFile()

        // 获取来源语言内容对象（暂时注释，等待 core 包方法修复）
        const originLangObj = fileUtils.getLangObjByJSONFileWithLangKey(option.originLang)

        // 补全语言配置，确保来源语言文件的内容完整性
        translateUtils.languageConfigCompletion(originLangObj)

        // 初始化翻译对象（用于翻译操作）
        translateUtils.initLangObj(originLangObj)

        // 配置初始语言选项，将来源语言设置为配置的 originLang
        FunctionFactoryOption.originLang = option.originLang
    }

    /**
     * Webpack 插件核心方法，用于集成到编译流程中
     * 兼容 webpack 4 和 5
     * @param compiler Webpack 编译器实例
     */
    apply(compiler: webpack.Compiler) {
        // 检测 webpack 版本
        const webpackVersion = this.getWebpackVersion(compiler)

        /**
         * 检查是否已经添加过这个自定义 Loader，避免重复添加
         * @param rule Webpack 模块规则
         * @returns 如果已经添加过自定义 Loader 则返回 true，否则返回 false
         */
        const hasCustomLoader = (rule: any) =>
            rule.use &&
            Array.isArray(rule.use) &&
            rule.use.some(
                ({ loader }: { loader: string }) =>
                    loader && loader.includes('customLoader/index.cjs')
            )

        /**
         * 在编译前阶段动态添加自定义 Loader
         */
        compiler.hooks.environment.tap('webpackPluginsAutoI18n', () => {
            // 检查 compiler 配置中是否有 module.rules 且没有添加过自定义 Loader
            if (
                compiler.options.module?.rules &&
                !compiler.options.module.rules.some(hasCustomLoader)
            ) {
                // 向 module.rules 中添加自定义 Loader
                compiler.options.module?.rules.push({
                    // 生成高级正则表达式，用于匹配目标文件
                    test: generateAdvancedRegex([
                        ...allowedExtensions,
                        ...(option.insertFileExtensions || [])
                    ]),
                    // 设置 Loader 执行顺序为后置
                    enforce: 'post',
                    use: [
                        {
                            // 指定自定义 Loader 的路径
                            loader: path.resolve(__dirname, './customLoader/index.cjs')
                        }
                    ]
                })
            }
        })

        /**
         * 在构建阶段执行翻译任务
         * 兼容 webpack 4 和 5 的 emit hook
         */
        if (webpackVersion.majorVersion >= 5) {
            // webpack 5 使用 tapPromise
            compiler.hooks.emit.tapPromise('webpackPluginsAutoI18n', async _compilation => {
                // 替换为 core 提供的批量执行函数，输出由 core 统一负责
                await this.performTranslation()
            })
        } else {
            // webpack 4 兼容处理
            compiler.hooks.emit.tapAsync(
                'webpackPluginsAutoI18n',
                async (_compilation, callback) => {
                    try {
                        await this.performTranslation()
                        callback()
                    } catch (error) {
                        callback(error as Error)
                    }
                }
            )
        }
    }

    /**
     * 执行翻译任务的统一方法
     */
    private async performTranslation() {
        // 清理多余的翻译配置JSON文件（静默）
        translateUtils.cleanupUnusedTranslations()

        // 使用 core 中的批量执行函数，统一处理输出与错误
        await translateUtils.runAutoTranslateBatch()

        // 写入主文件按需执行，避免空写入
        if (translateUtils.hasTranslationChanges) {
            await fileUtils.buildSetLangConfigToIndexFile()
        }
        // 不在此处打印成功/失败信息，输出由 core.runAutoTranslateBatch() 统一处理
    }

    /**
     * 获取 webpack 版本信息
     * @param compiler webpack 编译器实例
     * @returns 版本信息对象
     */
    private getWebpackVersion(compiler: any): { version: string; majorVersion: number } {
        let webpackVersion: string

        try {
            // 尝试从 compiler.webpack.version 获取 (webpack 5)
            webpackVersion = compiler.webpack?.version || require('webpack/package.json').version
        } catch {
            // 降级处理，假设是 webpack 4
            webpackVersion = '4.0.0'
        }

        const majorVersion = parseInt(webpackVersion.split('.')[0])

        return {
            version: webpackVersion,
            majorVersion
        }
    }
}

/**
 * 动态生成一个正则表达式，用于匹配目标文件。
 *
 * 验证以下条件：
 *  - 文件名需以特定的扩展名结尾（如 `.vue`, `.ts` 等）
 *  - 必须满足 `option.includePath` 中的至少一个短语或正则表达式；
 *  - 不能满足 `option.excludedPath` 中的任何短语或正则表达式。
 *
 * @param extensions 文件扩展名数组 (如: ['.vue', '.tsx', '.jsx', '.js', '.ts'])
 * @returns 匹配文件的动态生成正则表达式
 */
function generateAdvancedRegex(extensions: string[]): RegExp {
    // 生成扩展名的正则表达式部分
    const extensionsRegex = `(${extensions.map(ext => ext.replace('.', '\\.')).join('|')})$`

    /**
     * 将短语（字符串或正则）转化为正则表达式
     * @param phrase 包含字符串或正则的短语
     * @returns 短语对应的正则表达式
     */
    function phraseToRegex(phrase: string | RegExp): string {
        if (phrase instanceof RegExp) {
            // 如果是正则表达式，直接返回其源字符串
            return phrase.source
        }
        // 如果是字符串，对特殊字符进行转义
        return phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    }

    // 获取用户配置的包含路径
    const includePhrases = option.includePath

    // 获取用户配置的排除路径
    const excludePhrases = option.excludedPath

    // 生成包含路径的正则表达式部分
    const includeRegex = includePhrases.length
        ? `(?=.*(${includePhrases.map(phraseToRegex).join('|')}))`
        : ''

    // 生成排除路径的正则表达式部分
    const excludeRegex = excludePhrases.length
        ? `^(?!.*(${excludePhrases.map(phraseToRegex).join('|')}))`
        : ''

    // 组合最终的正则表达式
    const finalRegex = `${excludeRegex}${includeRegex}.*${extensionsRegex}`
    // 返回忽略大小写的正则表达式对象
    return new RegExp(finalRegex, 'i')
}
