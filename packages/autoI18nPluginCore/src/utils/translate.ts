/*
 * @Author: xiaoshanwen
 * @Date: 2023-10-30 18:23:03
 * @LastEditTime: 2025-03-16 19:12:54
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/utils/translate.ts
 */

import { AutoTranslateResult, IncompleteResultsError, TranslateError } from './translateResult'
import { getLangTranslateJSONFile, setLangTranslateJSONFile } from './file'
import { baseUtils, chunkUtils } from '.'
import { option } from 'src/option'
import { generateId } from './base'
import Progress from 'progress'

export const SEPARATOR = '\n┇┇┇\n'
export const SPLIT_SEPARATOR_REGEX = /\n┇ *┇ *┇\n/

/** 需要翻译的源文本集合 */
export const sourceTextSet = new Set<string>()

/** 对外暴露“是否有翻译变更”的标记，供插件在 closeBundle 时决定是否写入索引文件 */
export let hasTranslationChanges = false

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
 * @param [all=true] 是否翻译所有文本
 */
export async function autoTranslate(all = true): Promise<AutoTranslateResult> {
    const enabled = typeof option.enabled === 'function' ? option.enabled() : option.enabled
    if (!enabled) return { hasChanges: false, errors: [] }

    hasTranslationChanges = false

    /** index.json的内容对象 */
    let jsonObj: {
        [hash: string]: {
            [langKey: string]: string
        }
    } = {}
    try {
        jsonObj = JSON.parse(getLangTranslateJSONFile()) || {}
    } catch (e) {
        jsonObj = {}
    }

    if (option.isClear) {
        if (all) {
            const sourceHashSet = new Set(Array.from(sourceTextSet).map(text => generateId(text)))
            Object.keys(jsonObj).forEach(key => {
                if (!sourceHashSet.has(key)) {
                    delete jsonObj[key]
                }
            })
        } else {
            console.warn('⚠️ 当前模式下 isClear 选项无法激活')
        }
    }

    /** 待翻译内容，key为目标语言，value为源语言数组 */
    const transLangMap: Record<string, string[]> = {}
    const { langKey, originLang } = option
    langKey.forEach(key => (transLangMap[key] = []))

    sourceTextSet.forEach(text => {
        const hash = generateId(text)
        const langObj = (jsonObj[hash] ||= { [originLang]: text })
        langKey.forEach(key => {
            // 如果对象中不存在对应语言key表示需要翻译（空字符串表示不需要翻译）
            if (!(key in langObj)) {
                transLangMap[key].push(text)
            }
        })
    })

    if (Object.values(transLangMap).every(arr => !arr.length)) {
        // 无新内容：不写入、不输出，由插件侧统一处理提示
        return { hasChanges: false, errors: [] }
    }

    const errors: TranslateError[] = []

    for (const key in transLangMap) {
        const textList = transLangMap[key].filter(str => str) // 过滤空字符串（如果有的话）
        try {
            const result = await translateChunks(textList, key)
            textList.forEach((text, index) => {
                const hash = generateId(text) // 生成json里对应的hash值
                jsonObj[hash][key] = result[index]
            })
        } catch (e) {
            if (e instanceof TranslateError) {
                errors.push(e)
            } else {
                console.error(e)
            }
        }
    }

    // 仅在真正有新增内容时写入文件
    try {
        setLangTranslateJSONFile(jsonObj)
        // 如果报错个数小于需要翻译的总数，说明有部分内容被成功翻译
        hasTranslationChanges = errors.length < Object.keys(transLangMap).length
        return { hasChanges: hasTranslationChanges, errors }
    } catch (error) {
        // 抛出让上层统一处理异常输出
        throw error
    }
}

/** 分块翻译流程函数
 * @description: 分块翻译流程函数
 * @param textList 待翻译文本列表
 * @param translateKey 目标语言
 * @return 翻译后的文本列表，可以保证长度和入参textList一致
 */
async function translateChunks(textList: string[], translateKey: string): Promise<string[]> {
    const { translator } = option
    // 获取分块后的文本列表
    const translationChunks = chunkUtils.createTextSplitter(
        textList,
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
    const result = chunkResults
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
    if (result.length !== textList.length) {
        throw new IncompleteResultsError(textList.length, result.length, translateKey)
    }
    console.info(`✅ ${translateKey} 翻译完成`)
    return result
}

/*
 * 批量调用的防抖控制
 */
let pendingPaths = new Set<string>()
let debounceTimer: NodeJS.Timeout | null = null
const DEBOUNCE_MS = 250
export async function runAutoTranslateBatch(all = false) {
    const files = Array.from(pendingPaths)
    pendingPaths.clear()
    try {
        console.info('开始自动翻译...')
        const res = await autoTranslate(all)
        const errors = res.errors
        if (errors.length) {
            // 统一红色输出：文件列表 + 错误详情
            const errorMsg: string[] = []

            if (files.length) {
                errorMsg.push('处理以下文件时发生异常：')
                files.forEach(file => errorMsg.push(`  - ${file}`))
                errorMsg.push('')
            }
            errorMsg.push(...errors.map(err => err.toString()))

            console.error(baseUtils.red(errorMsg.join('\n')))
        } else if (res.hasChanges) {
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

export function scheduleAutoTranslate(path: string) {
    if (path) pendingPaths.add(path)
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        debounceTimer = null
        runAutoTranslateBatch(false)
    }, DEBOUNCE_MS)
}
