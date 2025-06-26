/*
 * @Author: xiaoshanwen
 * @Date: 2023-10-26 17:34:47
 * @LastEditTime: 2025-03-31 19:58:37
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/option.ts
 */

import { GoogleTranslator, Translator, TranslatorOption } from './translators'
import { OriginLangKeyEnum, TranslateTypeEnum } from './enums'
import { BaseExtendsType } from './extends'
import { cloneDeep } from './utils/base'

const EXCLUDED_CALL = [
    '$deepScan',
    'console.info',
    'console.warn',
    'console.error',
    '$i8n',
    'console.log',
    '$t',
    'require',
    '$$i8n',
    '$$t',
    '_createCommentVNode'
]
/**
 * 默认插件配置选项
 */
const DEFAULT_OPTION = {
    /** 是否启用插件，默认启用 */
    enabled: true as boolean | (() => boolean),
    /** 翻译调用函数，默认为 $t */
    translateKey: '$t',

    /** 标记不翻译调用函数列表，避免某些调用被错误翻译 */
    excludedCall: [] as string[],

    /** 标记不用翻译的字符串模式数组，默认是匹配文件扩展名 */
    excludedPattern: [/\.\w+$/],

    /** 排查不需要翻译的目录下的文件路径（黑名单）, 默认不处理node_modules */
    excludedPath: ['node_modules'] as string[],

    /** 指定需要翻译文件的目录路径正则（白名单） */
    includePath: [/src\//, /src\\/],

    /** 配置文件生成位置，默认为 './lang' */
    globalPath: './lang',

    /** 打包后生成文件的位置，例如 './dist/assets' */
    distPath: '',

    /** 打包后生成文件的主文件名称，默认是 'index' */
    distKey: 'index',

    /** 来源语言，默认是中文 */
    originLang: OriginLangKeyEnum.ZH as OriginLangKeyEnum | string,

    /** 翻译目标语言列表，默认包含英文 */
    targetLangList: ['en'],

    /** 语言key，用于请求谷歌api和生成配置文件下对应语言的内容文件 */
    langKey: [] as string[],

    /** 命名空间，防止全局命名冲突 */
    namespace: 'lang',

    /** 是否在构建结束之后将最新的翻译重新打包到主包中，默认不打包 */
    buildToDist: false,

    /** 翻译器，决定自动翻译使用的api与调用方式，默认使用 Google 翻译器并使用7890(clash)端口代理 */
    translator: new GoogleTranslator({
        proxyOption: {
            port: 7890,
            host: '127.0.0.1',
            headers: {
                'User-Agent': 'Node'
            }
        }
    }) as Translator,

    /** 翻译器配置选项，优先级低于translator */
    translatorOption: undefined as TranslatorOption | undefined,

    /**
     * 翻译类型，支持全自动和半自动两种模式
     * 全自动：所有翻译任务自动完成
     * 半自动：需要人工标识，类似于 $t('key') 的方式
     * 默认值为全自动
     */
    translateType: TranslateTypeEnum.FULL_AUTO as TranslateTypeEnum | string,

    /**
     * 是否重写配置文件，默认为true
     */
    rewriteConfig: true,

    /**
     * 通用翻译key，默认使用namespace，如果commonTranslateKey不为空，则使用commonTranslateKey
     */
    commonTranslateKey: '',

    /**
     * 实验性属性，表示是否进行深层扫描字符串，默认为 false
     * 当设置为 true 时，会对代码中的字符串进行更深入的扫描
     */
    deepScan: false,

    /**
     * 自定义文件拓展名数组
     */
    insertFileExtensions: [] as string[],

    /**
     * 自定义拓展类，插件默认翻译函数挂载在window上，如果希望自定义翻译函数挂载在其他对象上，可以使用该属性
     * 注意：该属性需要继承BaseExtends类，并且需要实现handleInitFile和handleCodeCall和handleCodeString方法
     */
    translateExtends: null as BaseExtendsType | null
}

/**
 * 类型定义：插件配置选项类型
 */
type OptionType = typeof DEFAULT_OPTION

/**
 * 全局插件配置实例，复制自默认配置
 */
export let option: OptionType = { ...DEFAULT_OPTION }

/**
 * 类型定义：用户传入的配置选项
 */
export interface OptionInfo extends Partial<OptionType> {}

/**
 * 通过深度克隆提供的选项信息生成一个用户选项对象，
 * 确保原始配置不被修改。它还根据用户的配置初始化翻译器。
 * @param optionInfo - 包含用户选项和翻译器细节的选项信息。
 * @returns 一个新的、可能已初始化翻译器的用户选项对象。
 */
function generateUserOption(optionInfo: OptionInfo) {
    // 深拷贝用户传入的配置，防止修改原配置对象
    const userOption = cloneDeep(optionInfo)
    userOption.translator = optionInfo?.translator

    // 如果用户配置了translatorOption则初始化translator，如果都没有则不设置translator
    userOption.translator ||= userOption.translatorOption
        ? new Translator(userOption.translatorOption)
        : undefined
    if (!userOption.translator) delete userOption.translator
    return userOption
}

/**
 * 初始化插件配置选项
 * @param optionInfo 用户提供的配置选项
 */
export function initOption(optionInfo: OptionInfo) {
    // 合并默认配置和用户配置
    option = { ...DEFAULT_OPTION, ...generateUserOption(optionInfo) }

    // 初始化语言key数组，包含来源语言和目标语言
    option.langKey = [option.originLang, ...option.targetLangList]
    // 初始化排除调用函数列表，包含默认排除和调用函数主动排除
    option.excludedCall = [
        ...option.excludedCall,
        ...EXCLUDED_CALL,
        ...[option.translateKey, '$' + option.translateKey]
    ]

    return option
}

/**
 * 校验插件配置选项是否完整有效
 * 主要用于校验用户在不使用ts类型检查的情况下硬传的奇怪的配置选项
 * @returns {boolean} 校验结果，完整返回 true，否则返回 false
 */
export function checkOption() {
    // 校验翻译调用函数是否配置
    if (!option.translateKey) {
        console.error('❌请配置翻译调用函数')
        return false
    }

    // 校验命名空间是否配置
    if (!option.namespace) {
        console.error('❌请配置命名空间')
        return false
    }

    // 校验是否配置了打包后生成文件的主文件名称（如果需要打包到主包中）
    if (option.buildToDist && !option.distKey) {
        console.log('❌请配置打包后生成文件的主文件名称')
        return false
    }

    // 校验是否配置了打包后生成文件的位置（如果需要打包到主包中）
    if (option.buildToDist && !option.distPath) {
        console.log('❌请配置打包后生成文件的位置')
        return false
    }

    // 校验来源语言是否配置
    if (!option.originLang) {
        console.error('❌请配置来源语言')
        return false
    }

    // 校验目标翻译语言数组是否配置
    if (!option.targetLangList || !option.targetLangList.length) {
        console.error('❌请配置目标翻译语言数组')
        return false
    }

    // 如果所有校验通过，返回 true
    return true
}
