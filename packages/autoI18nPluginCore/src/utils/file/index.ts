/*
 * @Date: 2025-02-14 10:48:41
 * @LastEditors: xiaoshan
 * @LastEditTime: 2025-03-31 02:15:23
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/utils/file.ts
 */
import { initTranslateBasicFnFile } from './insertTranslateBasic'
import { jsonFormatter } from '../json'
import { option } from '../../option'
import path from 'path'
import fs from 'fs'

/**
 * @description: 新建国际化配置文件夹
 * @return {*}
 */
export function initLangFile() {
    if (!fs.existsSync(option.globalPath)) {
        fs.mkdirSync(option.globalPath) // 创建lang文件夹
    }
    initLangTranslateJSONFile()
    initTranslateBasicFnFile()
}
/**
 * @description: 读取并合并所有分离的语言文件
 * @param {string} langDir - 语言文件目录
 * @param {string[]} langFiles - 语言文件列表
 * @return {Record<string, Record<string, any>>} 合并后的数据，格式为 { "hash1": { "en": "value1", "zh-cn": "值1" } }
 */
function readAndMergeLangFiles(
    langDir: string,
    langFiles: string[]
): Record<string, Record<string, any>> {
    // 结构转换: { "en.json": { "hash1": "value1" } } => { "hash1": { "en": "value1" } }
    const merged: Record<string, Record<string, any>> = {}

    langFiles.forEach(file => {
        const lang = path.basename(file, '.json')
        try {
            // 读取单个语言文件: { "hash1": "value1", "hash2": "value2" }
            const langData = JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf-8'))

            // 遍历所有 hash，重组为 { hash: { lang: value } } 结构
            Object.keys(langData).forEach(hashKey => {
                if (!merged[hashKey]) {
                    merged[hashKey] = {}
                }
                merged[hashKey][lang] = langData[hashKey]
            })
        } catch (error) {
            console.warn(`⚠️ 读取语言文件 ${file} 失败，跳过该文件`)
        }
    })

    return merged
}

/**
 * @description: 将分离的语言 JSON 合并为 index.json
 * @param {string} langDir - 语言文件目录
 * @param {string[]} langFiles - 语言文件列表
 * @param {string} indexPath - index.json 路径
 */
function mergeLangFilesToIndex(langDir: string, langFiles: string[], indexPath: string) {
    // 使用通用函数读取并合并所有语言文件
    const merged = readAndMergeLangFiles(langDir, langFiles)

    // 写入 index.json
    fs.writeFileSync(indexPath, JSON.stringify(merged, null, 2))

    // 删除分离的语言 JSON 文件
    langFiles.forEach(file => {
        try {
            fs.unlinkSync(path.join(langDir, file))
        } catch (error) {
            console.warn(`⚠️ 删除语言文件 ${file} 失败`)
        }
    })

    console.log('✅ 已将分离的语言文件合并到 index.json')
}

/**
 * @description: 将 index.json 拆分为各语言独立 JSON
 * @param {string} langDir - 语言文件目录
 * @param {string} indexPath - index.json 路径
 */
function splitIndexToLangFiles(langDir: string, indexPath: string) {
    try {
        // 读取 index.json: { "hash1": { "en": "value1", "zh-cn": "值1" } }
        const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))

        // 收集所有语言
        const languages = new Set<string>()
        Object.values(indexData).forEach((langObj: any) => {
            if (typeof langObj === 'object' && langObj !== null) {
                Object.keys(langObj).forEach(lang => languages.add(lang))
            }
        })

        // 为每个语言生成独立的 JSON 文件
        languages.forEach(lang => {
            const langFileData: Record<string, any> = {}

            // 遍历所有 hash，提取该语言的值
            Object.keys(indexData).forEach(hashKey => {
                if (indexData[hashKey] && indexData[hashKey][lang] !== undefined) {
                    langFileData[hashKey] = indexData[hashKey][lang]
                }
            })

            // 写入语言文件: { "hash1": "value1", "hash2": "value2" }
            fs.writeFileSync(
                path.join(langDir, `${lang}.json`),
                JSON.stringify(langFileData, null, 2)
            )
        })

        // 删除 index.json
        fs.unlinkSync(indexPath)
        console.log('✅ 已将 index.json 拆分为独立的语言文件')
    } catch (error) {
        console.error('❌ 拆分 index.json 失败:', error)
    }
}

/**
 * @description: 创建空的语言 JSON 文件
 * @param {string} langDir - 语言文件目录
 * @param {string[]} langs - 语言列表
 */
function createEmptyLangFiles(langDir: string, langs: string[]) {
    langs.forEach(lang => {
        fs.writeFileSync(path.join(langDir, `${lang}.json`), JSON.stringify({}, null, 2))
    })
}

/**
 * @description: 生成国际化JSON文件（支持合并/分离模式自动切换）
 * @return {*}
 */
export function initLangTranslateJSONFile() {
    const langDir = option.globalPath
    const mode = option.languageJsonMode // 'merged' | 'split'
    const indexPath = path.join(langDir, 'index.json')

    // 获取所有语言 JSON 文件（排除 index.json）
    const langFiles = fs.existsSync(langDir)
        ? fs.readdirSync(langDir).filter(f => f.endsWith('.json') && f !== 'index.json')
        : []

    const hasIndex = fs.existsSync(indexPath)
    const hasLangFiles = langFiles.length > 0

    if (mode === 'merged') {
        // ========== 合并模式：所有语言存储在 index.json 中 ==========
        // 结构: { "hash1": { "en": "value1", "zh-cn": "值1" } }

        if (hasLangFiles) {
            // 场景1: 有分离的语言 json，需要合并为 index.json
            mergeLangFilesToIndex(langDir, langFiles, indexPath)
        } else if (!hasIndex) {
            // 场景2: 什么都没有，生成空 index.json
            fs.writeFileSync(indexPath, JSON.stringify({}, null, 2))
        }
        // 场景3: 已有 index.json，无需操作
    } else {
        // ========== 分离模式：每个语言单独存储为一个 JSON 文件 ==========
        // 结构: en.json => { "hash1": "value1", "hash2": "value2" }

        if (hasIndex) {
            // 场景1: 有 index.json，需要拆分为各语言 json
            splitIndexToLangFiles(langDir, indexPath)
        } else if (!hasLangFiles) {
            // 场景2: 什么都没有，生成各语言空 json
            const langs = [...option.targetLangList, option.originLang]
            createEmptyLangFiles(langDir, langs)
        }
        // 场景3: 已有分离的语言 json，无需操作
    }
}

/**
 * @description: 读取国际化JSON文件（根据模式自动选择读取方式）
 * @return {string} 返回 JSON 字符串
 */
export function getLangTranslateJSONFile() {
    const langDir = option.globalPath
    const mode = option.languageJsonMode // 'merged' | 'split'

    try {
        if (mode === 'merged') {
            // 合并模式：直接读取 index.json
            const indexPath = path.join(langDir, 'index.json')
            if (!fs.existsSync(indexPath)) {
                console.log('❌读取JSON配置文件异常，index.json 文件不存在')
                return JSON.stringify({})
            }
            const content = fs.readFileSync(indexPath, 'utf-8')
            return content
        } else {
            // 分离模式：读取所有语言 JSON 文件并合并
            const langFiles = fs.existsSync(langDir)
                ? fs.readdirSync(langDir).filter(f => f.endsWith('.json') && f !== 'index.json')
                : []

            if (langFiles.length === 0) {
                console.log('❌读取JSON配置文件异常，没有找到语言文件')
                return JSON.stringify({})
            }

            // 使用通用函数读取并合并所有语言文件
            const merged = readAndMergeLangFiles(langDir, langFiles)

            return JSON.stringify(merged)
        }
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log('❌读取JSON配置文件异常，文件不存在')
        } else {
            console.log('❌读取JSON配置文件异常，无法读取文件')
        }
        return JSON.stringify({})
    }
}

/**
 * @description: 基于langKey获取JSON配置文件中对应语言对象
 * @param {string} key
 * @return {*}
 */
export function getLangObjByJSONFileWithLangKey(
    key: string,
    insertJSONObj: object | undefined = undefined
) {
    // 获取翻译配置对象，优先使用传入的配置，否则从本地文件读取
    const JSONObj = insertJSONObj || JSON.parse(getLangTranslateJSONFile())

    // 初始化语言映射对象，用于存储不同语言的hash: value映射
    const langObj: Record<string, any> = {}

    // 遍历hash，提取hash对应语言key的值，并写入到langObj
    Object.keys(JSONObj).forEach(langCode => {
        langObj[langCode] = JSONObj[langCode][key]
    })

    // 返回当前语言的hash: value映射对象
    // 例如: 'zh-cn' > {'hash1': '你好', 'hash2': '世界'}
    // 'en' > {'hash1': 'hello', 'hash2': 'world'}
    return langObj
}

/**
 * @description: 设置国际化JSON文件（根据模式自动选择写入方式）
 * @param {object} obj - 要写入的数据对象，格式为 { "hash1": { "en": "value1", "zh-cn": "值1" } }
 * @return {*}
 */
export function setLangTranslateJSONFile(obj: object) {
    const langDir = option.globalPath
    const mode = option.languageJsonMode // 'merged' | 'split'

    try {
        if (mode === 'merged') {
            // 合并模式：写入到 index.json
            const indexPath = path.join(langDir, 'index.json')
            const jsonObj = jsonFormatter(obj)
            if (fs.existsSync(indexPath)) {
                fs.writeFileSync(indexPath, jsonObj)
            } else {
                console.log('❌JSON配置文件写入异常，index.json 文件不存在')
            }
        } else {
            // 分离模式：拆分写入到各语言 JSON 文件
            // 输入格式: { "hash1": { "en": "value1", "zh-cn": "值1" } }
            const indexData = obj as Record<string, Record<string, any>>

            // 收集所有语言
            const languages = new Set<string>()
            Object.values(indexData).forEach((langObj: any) => {
                if (typeof langObj === 'object' && langObj !== null) {
                    Object.keys(langObj).forEach(lang => languages.add(lang))
                }
            })

            // 为每个语言生成独立的 JSON 文件
            languages.forEach(lang => {
                const langFileData: Record<string, any> = {}

                // 遍历所有 hash，提取该语言的值
                Object.keys(indexData).forEach(hashKey => {
                    if (indexData[hashKey] && indexData[hashKey][lang] !== undefined) {
                        langFileData[hashKey] = indexData[hashKey][lang]
                    }
                })

                // 写入语言文件: { "hash1": "value1", "hash2": "value2" }
                const langFilePath = path.join(langDir, `${lang}.json`)
                fs.writeFileSync(langFilePath, jsonFormatter(langFileData))
            })
        }
    } catch (error) {
        console.error('❌写入JSON配置文件失败:', error)
    }
}

/**
 * @description: 构建时把lang配置文件设置到打包后到主文件中
 * @return {*}
 */
export function buildSetLangConfigToIndexFile() {
    if (!option.buildToDist) return
    let langObjMap: any = {}
    option.langKey.forEach(item => {
        langObjMap[item] = getLangObjByJSONFileWithLangKey(item)
    })
    if (fs.existsSync(option.distPath)) {
        fs.readdir(option.distPath, (err, files) => {
            if (err) {
                console.error('❌构建文件夹为空，翻译配置无法写入')
                return
            }

            files.forEach(file => {
                if (file.startsWith(option.distKey) && file.endsWith('.js')) {
                    const filePath = path.join(option.distPath, file)
                    fs.readFile(filePath, 'utf-8', (err, data) => {
                        if (err) {
                            console.log(filePath)
                            console.error('❌构建主文件不存在，翻译配置无法写入')
                            return
                        }
                        let buildLangConfigString = ''
                        Object.keys(langObjMap).forEach(item => {
                            buildLangConfigString =
                                buildLangConfigString +
                                `globalThis['${option.namespace}']['${item}']=${JSON.stringify(langObjMap[item])};`
                        })
                        try {
                            // 翻译配置写入主文件
                            fs.writeFileSync(
                                filePath,
                                `globalThis['${option.namespace}']={};${buildLangConfigString}` +
                                    data
                            )
                            console.info('恭喜：翻译配置写入构建主文件成功🌟🌟🌟')
                        } catch (err) {
                            console.error('翻译配置写入构建主文件失败:', err)
                        }
                    })
                }
            })
        })
    }
}
