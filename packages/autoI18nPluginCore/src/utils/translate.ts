/*
 * @Author: xiaoshanwen
 * @Date: 2023-10-30 18:23:03
 * @LastEditTime: 2025-03-16 19:12:54
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/utils/translate.ts
 */

import { baseUtils, chunkUtils } from '.'
import { option } from 'src/option'
import * as fileUtils from './file'
import Progress from 'progress'

export const SEPARATOR = '\n┇┇┇\n'
export const SPLIT_SEPARATOR_REGEX = /\n┇ *┇ *┇\n/

type LangObj = { [key: string]: string }

let langObj: LangObj = {}

// 对外暴露“是否有翻译变更”的标记，供插件在 closeBundle 时决定是否写入索引文件
export let hasTranslationChanges = false

// 统一的返回类型，供插件侧统一输出
export type AutoTranslateResult = {
    hasChanges: boolean
    errors: Array<{ expected: number; actual: number; lang?: string; extra?: string }>
}

/**
 * @description: 设置翻译对象属性
 * @param {string} key
 * @param {string} value
 * @return {*}
 */
export function setLangObj(key: string, value: string) {
    if (!langObj[key]) {
        langObj[key] = value
    }
}

/**
 * @description: 读取翻译对象
 * @return {*}
 */
export function getLangObj() {
    return langObj
}

/**
 * @description: 初始化翻译对象
 * @param {langObj} obj
 * @return {*}
 */
export function initLangObj(obj: LangObj) {
    if (!Object.keys(langObj)) {
        langObj = obj
    }
}

// todo 类型修复
/**
 * 自动生成多语言配置文件的核心方法
 *
 * 主要流程：
 * 1. 加载现有翻译文件
 * 2. 对比找出新增需要翻译的内容
 * 3. 分块并行翻译所有目标语言
 * 4. 合并翻译结果并生成最终配置文件
 *
 * 异常处理：
 * - 翻译结果不完整时中断流程
 * - 文件读写失败时明确报错
 */
export async function autoTranslate(): Promise<AutoTranslateResult> {
    const enabled = typeof option.enabled === 'function' ? option.enabled() : option.enabled
    if (!enabled) return { hasChanges: false, errors: [] }

    hasTranslationChanges = false

    // 初始化现有翻译文件缓存
    const originLangObjMap: Record<string, any> = {}

    // 加载所有语言的现有翻译内容
    // 获取当前待翻译内容（深拷贝避免污染原始数据）
    const currentLangObj = JSON.parse(JSON.stringify(getLangObj()))
    option.langKey.forEach(lang => {
        const keyMap = fileUtils.getLangObjByJSONFileWithLangKey(lang)
        originLangObjMap[lang] = keyMap
    })

    // 筛选需要翻译的新增内容
    const transLangObj: Record<string, string> = {}
    Object.keys(currentLangObj).forEach(key => {
        if (!originLangObjMap[option.originLang][key]) {
            transLangObj[key] = currentLangObj[key]
        }
    })

    // 无新内容提前退出
    if (Object.keys(transLangObj).length === 0) {
        // 无新内容：不写入、不输出，由插件侧统一处理提示
        return { hasChanges: false, errors: [] }
    }

    // 初始化翻译结果存储结构
    const newLangObjMap: Record<string, (string | number)[]> = {}
    const errors: AutoTranslateResult['errors'] = []

    // 遍历所有目标语言进行处理
    for (let langIndex = 0; langIndex < option.langKey.length; langIndex++) {
        const currentLang = option.langKey[langIndex]

        // 原始语言直接存储原文，读取扫出来的元素翻译内容
        if (langIndex === 0) {
            newLangObjMap[option.originLang] = Object.values(transLangObj)
            continue
        }

        // 分块翻译 + 进度条（仅临时输出）
        const translatedValues = await translateChunks(transLangObj, currentLang)

        // 校验数量是否一致，不一致则终止并返回错误信息
        if (translatedValues.length !== Object.keys(transLangObj).length) {
            errors.push({
                extra: '❌ 使用付费翻译时，请检查翻译API额度是否充足，或是否已申请对应翻译API使用权限',
                expected: Object.keys(transLangObj).length,
                actual: translatedValues.length,
                lang: currentLang
            })
            return { hasChanges: false, errors }
        }

        // 存储当前语言翻译结果
        newLangObjMap[currentLang] = translatedValues
    }

    // 合并结果
    Object.keys(transLangObj).forEach((key: any, index) => {
        option.langKey.forEach(item => {
            originLangObjMap[item][key] = newLangObjMap[item][index]
        })
    })

    // 生成配置结构并写入
    const configLangObj: Record<string, Record<string, string>> = {}
    Object.keys(originLangObjMap[option.originLang]).forEach(key => {
        configLangObj[key] = {}
        option.langKey.forEach(lang => {
            configLangObj[key][lang] = originLangObjMap[lang][key]
        })
    })

    // 仅在真正有新增内容时写入文件
    try {
        fileUtils.setLangTranslateJSONFile(configLangObj)
        hasTranslationChanges = true
        return { hasChanges: true, errors: [] }
    } catch (error) {
        // 抛出让上层统一处理异常输出
        throw error
    }
}

/**
 * @description: 新增语言类型配置补全
 * @param {any} obj
 * @return {*}
 */
export function languageConfigCompletion(obj: any) {
    if (!Object.keys(obj)) return
    const enabled = typeof option.enabled === 'function' ? option.enabled() : option.enabled
    if (!enabled) return
    let needCompletionList: any[] = []
    const JSONobj = JSON.parse(fileUtils.getLangTranslateJSONFile())
    option.targetLangList.forEach(item => {
        // 获取目标语言 hash：value 对象 和 语言的复合对象，如果当前语言不存在，是langObj的value卡都为空
        let langObj = fileUtils.getLangObjByJSONFileWithLangKey(item, JSONobj)
        needCompletionList.push({
            key: item,
            curLangObj: langObj
        })
    })
    needCompletionList.forEach(async item => {
        await completionTranslateAndWriteConfigFile(obj, item.curLangObj, item.key)
    })
}

/**
 * @description: 补全新增语言翻译写入函数
 * @param langObj
 * @param curLangObj
 * @param translateKey
 * @return
 */
export async function completionTranslateAndWriteConfigFile(
    langObj: Record<string, string>,
    curLangObj: Record<string, string>,
    translateKey: string
) {
    // 构建需要翻译的语言映射对象
    // langObj: 源语言的键值对映射，格式为 { hash: sourceText }
    // curLangObj: 目标语言的键值对映射，格式为 { hash: targetText }，未翻译的值为空

    // 创建待翻译内容对象，仅包含未翻译的条目，key是hash，value是源语言的对应hash的文本
    const transLangObj: Record<string, string> = {}
    Object.keys(langObj).forEach(key => {
        // 如果目标语言中对应的翻译为空，则将 源语言的对应hash的文本 加入待翻译内容对象 中
        if (curLangObj[key] === undefined) {
            transLangObj[key] = langObj[key]
        }
    })

    if (!Object.values(transLangObj).length) return

    // ─── 分块翻译流程开始 ───

    console.info('进入新增语言补全翻译...')

    // 调用抽离的函数
    const resultValues = await translateChunks(transLangObj, translateKey)
    // ─── 分块翻译流程结束 ───

    if (resultValues.length !== Object.values(langObj).length) {
        console.error('翻译异常，翻译结果缺失❌')
        return
    }
    let newLangObjMap = resultValues
    console.info('翻译成功⭐️⭐️⭐️')

    Object.keys(transLangObj).forEach((key, index) => {
        curLangObj[key] = newLangObjMap[index]
    })

    const configLangObj: any = JSON.parse(fileUtils.getLangTranslateJSONFile())

    Object.keys(transLangObj).forEach(key => {
        configLangObj[key][translateKey] = curLangObj[key]
    })
    try {
        fileUtils.setLangTranslateJSONFile(configLangObj)
        hasTranslationChanges = true
        console.info('JSON配置文件写入成功⭐️⭐️⭐️')
    } catch (error) {
        console.error('❌JSON配置文件写入失败' + error)
    }
    console.info('新增语言翻译补全成功⭐️⭐️⭐️')
}

// 分块翻译流程函数
async function translateChunks(transLangObj: Record<string, string>, translateKey: string) {
    const { translator } = option
    // 获取分块后的文本列表
    const translationChunks = chunkUtils.createTextSplitter(
        Object.values(transLangObj),
        translator.option.maxChunkSize
    )
    const progressBar = new Progress(`正在翻译${translateKey} :sign [:bar] :percent`, {
        curr: 0,
        total: translationChunks.length,
        width: 30,
        complete: '█',
        incomplete: '░',
        renderThrottle: 100
    })
    // 执行动画
    const signs = ['|', '/', '-', '\\']
    let signIndex = 0
    const timer = setInterval(() => {
        if (progressBar.curr >= progressBar.total) {
            clearInterval(timer)
            return
        }
        signIndex++
        progressBar.tick(0, { sign: signs[signIndex % signs.length] })
    }, 200)

    // 并行执行分块翻译
    const translatePromises = []
    for (let i = 0; i < translationChunks.length; i++) {
        translatePromises.push(
            translator
                .translate(translationChunks[i], option.originLang, translateKey, SEPARATOR)
                .finally(() => {
                    progressBar.tick({ sign: signs[signIndex % signs.length] })
                })
        )
    }

    // 等待所有分块完成并合并结果
    const chunkResults = await Promise.all(translatePromises)
    return chunkResults
        .map(item => {
            // 提取分割逻辑到单独的函数中，提高代码复用性
            const splitTranslation = (text: string, separatorRegex: RegExp) => {
                return text.split(separatorRegex).map(v => v.trim())
            }

            // 分割符可能会被翻译，所以这里做了兼容处理
            if (SPLIT_SEPARATOR_REGEX.test(item)) {
                return splitTranslation(item, SPLIT_SEPARATOR_REGEX)
            } else {
                const lines = item.split('\n')
                const separator = lines.find(line => line.length === 3)
                let value: string[] = []
                if (separator) {
                    value = splitTranslation(item, new RegExp(`\\n${separator}\\n`))
                }
                const realList = value.filter(Boolean)
                if (realList.length > 1) {
                    return realList
                }
                return splitTranslation(item, SPLIT_SEPARATOR_REGEX)
            }
        })
        .flat()
}
/**
 * @description: 清理多余的翻译配置JSON文件
 * @return {void} 无返回值
 */
export function cleanupUnusedTranslations() {
    if (!option.isClear) return
    console.log('🧹 进入清理流程')
    // 获取当前的语言对象，如果不存在则使用空对象
    const langObj = getLangObj() || {}

    // 创建一个Set用于存储当前语言对象的所有key，便于快速查找
    let langSet = new Set(Object.keys(langObj))

    // 获取基础对象：优先使用传入的insertObj，否则从翻译文件中读取
    const baseObj = JSON.parse(fileUtils.getLangTranslateJSONFile())

    // 获取基础对象的所有key
    const baseObjKeys = Object.keys(baseObj)
    // 遍历所有key，删除在当前语言对象中不存在的配置
    baseObjKeys.forEach(key => {
        if (!langSet.has(key)) {
            baseObj[key] && delete baseObj[key]
        }
    })
    fileUtils.setLangTranslateJSONFile(baseObj)
}

/*
 * 批量调用的防抖控制
 */
let pendingPaths = new Set<string>()
let debounceTimer: NodeJS.Timeout | null = null
const DEBOUNCE_MS = 250
export async function runAutoTranslateBatch() {
    const files = Array.from(pendingPaths)
    pendingPaths.clear()
    try {
        console.info('开始自动翻译...')
        const res = await autoTranslate()
        const errors = res?.errors || []
        if (errors.length) {
            // 统一红色输出：文件列表 + 错误详情
            const first = errors[0]
            const errorMsg = []

            if (files.length) {
                errorMsg.push('处理以下文件时发生异常：')
                files.forEach(file => errorMsg.push(`  - ${file}`))
                errorMsg.push('')
            }

            errorMsg.push(
                `❌ 翻译异常：返回结果不完整，预期文字数量: ${first.expected}，实际文字数量: ${first.actual}，目标语言: ${first.lang}`
            )
            if (first.extra) {
                errorMsg.push(first.extra)
            }

            console.error(baseUtils.red(errorMsg.join('\n')))
        } else if (res?.hasChanges) {
            console.log(baseUtils.green('✅ 翻译完成'))
        } else {
            // 无新内容统一提示（可改为静默）
            console.log(baseUtils.green('ℹ️  当前没有需要翻译的新内容'))
        }
    } catch (e) {
        console.error(
            baseUtils.red(`❌ 翻译任务异常：${e instanceof Error ? e.message : String(e)}`)
        )
    }
}

export function scheduleAutoTranslate(path?: string) {
    if (path) pendingPaths.add(path)
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        debounceTimer = null
        runAutoTranslateBatch()
    }, DEBOUNCE_MS)
}
