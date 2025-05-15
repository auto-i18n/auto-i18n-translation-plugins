/*
 * @Author: xiaoshanwen
 * @Date: 2023-10-30 18:23:03
 * @LastEditTime: 2025-03-16 19:12:54
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/utils/translate.ts
 */

import { option } from 'src/option'
import * as fileUtils from './file'
import { chunkUtils } from '.'

export const SEPARATOR = '\n┇┇┇\n'
export const SPLIT_SEPARATOR_REGEX = /\n┇ *┇ *┇\n/

type langObj = { [key: string]: string }

export let langObj: langObj = {}

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
export function initLangObj(obj: langObj) {
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
export async function autoTranslate() {
    const enabled = typeof option.enabled === 'function' ? option.enabled() : option.enabled

    if (!enabled) {
        console.info('❗ 自动翻译功能未启用')
        return
    }

    // 初始化现有翻译文件缓存
    const originLangObjMap: Record<string, any> = {}

    // 加载所有语言的现有翻译内容
    option.langKey.forEach(lang => {
        originLangObjMap[lang] = fileUtils.getLangObjByJSONFileWithLangKey(lang)
    })

    // 获取当前待翻译内容（深拷贝避免污染原始数据）
    const currentLangObj = JSON.parse(JSON.stringify(getLangObj()))

    // 筛选需要翻译的新增内容
    const transLangObj: Record<string, string> = {}
    Object.keys(currentLangObj).forEach(key => {
        if (!originLangObjMap[option.originLang][key]) {
            transLangObj[key] = currentLangObj[key]
        }
    })

    // 无新内容提前退出
    if (Object.keys(transLangObj).length === 0) {
        console.info('✅ 当前没有需要翻译的新内容')
        return
    }

    // 初始化翻译结果存储结构
    const newLangObjMap: Record<string, (string | number)[]> = {}

    // 遍历所有目标语言进行处理
    for (let langIndex = 0; langIndex < option.langKey.length; langIndex++) {
        const currentLang = option.langKey[langIndex]

        // 原始语言直接存储原文，读取扫出来的元素翻译内容
        if (langIndex === 0) {
            newLangObjMap[option.originLang] = Object.values(transLangObj)
            continue
        }

        console.info('开始自动翻译...')

        // ─── 分块翻译流程开始 ───
        const translatedValues = await translateChunks(transLangObj, option.langKey[langIndex])
        // ─── 分块翻译流程结束 ───=

        // ─── 翻译结果校验 ───
        if (translatedValues.length !== Object.keys(transLangObj).length) {
            console.error(
                '❌ 使用付费翻译时，请检查翻译API额度是否充足，或是否已申请对应翻译API使用权限'
            )
            console.error(`❌ 翻译结果不完整
                预期数量: ${Object.keys(transLangObj).length}
                实际数量: ${translatedValues.length}
                样例数据: ${JSON.stringify(translatedValues.slice(0, 3))}`)
            return
        }

        // 存储当前语言翻译结果
        newLangObjMap[currentLang] = translatedValues
        console.info(`✅ ${currentLang} 翻译完成`)
    }

    // ─── 合并翻译结果到配置 ───
    Object.keys(transLangObj).forEach((key: any, index) => {
        option.langKey.forEach(item => {
            originLangObjMap[item][key] = newLangObjMap[item][index]
        })
    })

    // ─── 生成最终配置文件结构 ───
    console.log('📄 构建配置文件数据结构...')
    const configLangObj: Record<string, Record<string, string>> = {}
    Object.keys(originLangObjMap[option.originLang]).forEach(key => {
        configLangObj[key] = {}
        option.langKey.forEach(lang => {
            configLangObj[key][lang] = originLangObjMap[lang][key]
        })
    })

    // ─── 写入文件系统 ───
    try {
        fileUtils.setLangTranslateJSONFile(configLangObj)
        console.info('🎉 多语言配置文件已成功更新')
    } catch (error) {
        console.error('❌ 配置文件写入失败，原因:', error)
        // todo 可添加重试逻辑或回滚机制
    }
}

/**
 * @description: 新增语言类型配置补全
 * @param {any} obj
 * @return {*}
 */
export function languageConfigCompletion(obj: any) {
    if (!Object.keys(obj)) return
    let needCompletionList: any[] = []
    const JSONobj = JSON.parse(fileUtils.getLangTranslateJSONFile())
    option.targetLangList.forEach(item => {
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
    // 生产需要更新的语言对象
    const transLangObj: Record<string, string> = {}
    Object.keys(langObj).forEach(key => {
        if (!curLangObj[key]) {
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

    console.log('开始写入JSON配置文件...')
    const configLangObj: any = JSON.parse(fileUtils.getLangTranslateJSONFile())

    Object.keys(transLangObj).forEach(key => {
        configLangObj[key][translateKey] = curLangObj[key]
    })
    try {
        fileUtils.setLangTranslateJSONFile(configLangObj)
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
    // 并行执行分块翻译
    const translatePromises = []
    for (let i = 0; i < translationChunks.length; i++) {
        translatePromises.push(
            translator.translate(translationChunks[i], option.originLang, translateKey, SEPARATOR)
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
