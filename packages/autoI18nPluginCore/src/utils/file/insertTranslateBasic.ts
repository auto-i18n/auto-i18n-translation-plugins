import { option } from '../../option'
import { generateId } from '../base'
import path from 'path'
import fs from 'fs'

/**
 * @description: 生成导入语句（根据模式）
 */
function generateImportStatement(mode: string): string {
    if (mode === 'merged') {
        return `// 导入国际化JSON文件（合并模式）
    import langJSON from './index.json'`
    } else {
        // 分离模式：根据实际存在的语言文件生成 import 语句
        const langDir = option.globalPath
        const langFiles = fs.existsSync(langDir)
            ? fs.readdirSync(langDir).filter(f => f.endsWith('.json') && f !== 'index.json')
            : []

        if (langFiles.length === 0) {
            return `// 分离模式：未找到语言文件
    const langJSON = {};`
        }

        // 为每个语言文件生成 import 语句
        const imports = langFiles
            .map(file => {
                const langCode = path.basename(file, '.json')
                const varName = `lang_${langCode.replace('-', '_')}`
                return `import ${varName} from './${file}'`
            })
            .join('\n    ')

        return `// 分离模式：导入各语言文件
    ${imports}
    const langJSON = {};`
    }
}

/**
 * @description: 生成辅助函数（根据模式）
 */
function generateHelperFunction(mode: string): string {
    if (mode === 'merged') {
        return `// 定义从JSON文件中获取指定键的语言对象的方法（合并模式）
    globalThis._getJSONKey = function (key, insertJSONObj = undefined) {
        // 获取JSON对象
        const JSONObj = insertJSONObj;
        // 初始化语言对象
        const langObj = {};
        // 遍历JSON对象的所有键
        Object.keys(JSONObj).forEach((value) => {
            // 将每个语言的对应键值添加到语言对象中
            langObj[value] = JSONObj[value][key];
        });
        // 返回语言对象
        return langObj;
    };`
    } else {
        // 分离模式：生成语言文件映射对象
        const langDir = option.globalPath
        const langFiles = fs.existsSync(langDir)
            ? fs.readdirSync(langDir).filter(f => f.endsWith('.json') && f !== 'index.json')
            : []

        // 构建语言文件映射: { 'en': lang_en, 'zh-cn': lang_zh_cn }
        const langFileMap = langFiles
            .map(file => {
                const langCode = path.basename(file, '.json')
                const varName = `lang_${langCode.replace('-', '_')}`
                return `'${langCode}': ${varName}`
            })
            .join(',\n        ')

        return `// 定义从独立语言文件中获取语言对象的方法（分离模式）
    const _langFileMap = {
        ${langFileMap} || {}
    };
    globalThis._getLangFromFile = function (langCode) {
        return _langFileMap[langCode] || {};
    };`
    }
}

/**
 * @description: 生成语言映射列表
 */
function generateLangMapList(
    targetLangList: string[],
    originLang: string,
    namespace: string,
    mode: string
): string {
    const langs = [...targetLangList, originLang]

    return langs
        .map(item => [item.replace('-', ''), item])
        .map(([langKey, langCode]) => {
            const globalLangCheck = `(globalThis && globalThis.${namespace} && globalThis.${namespace}.${langKey}) ? globalThis.${namespace}.${langKey}`

            if (mode === 'merged') {
                return `'${langKey}': ${globalLangCheck} : globalThis._getJSONKey('${langCode}', langJSON)`
            } else {
                return `'${langKey}': ${globalLangCheck} : globalThis._getLangFromFile('${langCode}')`
            }
        })
        .join(',\n')
}

/**
 * @description: 生成核心翻译函数
 */
function generateCoreFunctions(translateKey: string): string {
    return `(function () {
    // 定义翻译函数
    let ${translateKey} = function (key, val, nameSpace) {
      // 获取指定命名空间下的语言包
      const langPackage = ${translateKey}[nameSpace];
      // 返回翻译结果，如果不存在则返回默认值
      return (langPackage || {})[key] || val;
    };
    // 定义简单翻译函数，直接返回传入的值
    let $${translateKey} = function (val) {
      return val;
    };
    globalThis.$deepScan = function (val) {
      return val;
    };
    globalThis.$iS = function (val, args) {
        // 如果参数不是字符串或数组，直接返回原值
        if (typeof val !== 'string' || !Array.isArray(args)) {
            return val;
        }
        try {
            // 使用更安全的正则表达式替换方式
            return val.replace(/\\$(?:\\{|\\｛)(\\d+)(?:\\}|\\｝)/g, (match, index) => {
                // 将index转换为数字
                const position = parseInt(index, 10);
                // 如果args[position]存在则替换，否则保留原占位符
                return args[position] !== undefined ? String(args[position]) : match;
            });
        } catch (error) {
            console.warn('字符串替换过程出现异常:', error);
            return val;
        }
    }
    // 定义设置语言包的方法
    ${translateKey}.locale = function (locale, nameSpace) {
      // 将指定命名空间下的语言包设置为传入的locale
      ${translateKey}[nameSpace] = locale || {};
    };
    // 将翻译函数挂载到globalThis对象上，如果已经存在则使用已有的
    globalThis.${translateKey} = globalThis.${translateKey} || ${translateKey};
    // 将简单翻译函数挂载到globalThis对象上
    globalThis.$${translateKey} = $${translateKey};`
}

/**
 * @description: 生成语言初始化逻辑
 */
function generateLanguageInitialization(
    translateKey: string,
    namespace: string,
    commonTranslateKey: string,
    originLang: string
): string {
    return `// 定义语言映射对象
    const langMap = {
        {{LANG_MAP_LIST}}
    };
    globalThis.langMap = langMap;
    // 存储语言是否存在
    // 判断 globalThis.localStorage.getItem 是否为函数
    const isFunction = (fn) => {
        return typeof fn === 'function';
    };
    
    const withStorageLang = isFunction && globalThis && globalThis.localStorage && 
    isFunction(globalThis.localStorage.getItem) && globalThis.localStorage.getItem('${namespace}');
    const withStorageCommonLang = isFunction && globalThis && globalThis.localStorage && 
    isFunction(globalThis.localStorage.getItem) && globalThis.localStorage.getItem('${commonTranslateKey}');
    // 从本地存储中获取通用语言，如果不存在则使用空字符串
    const commonLang = withStorageCommonLang ? globalThis.localStorage.getItem('${commonTranslateKey}') : '';
    // 从本地存储中获取当前语言，如果不存在则使用源语言
    const baseLang = withStorageLang ? globalThis.localStorage.getItem('${namespace}') : '${originLang.replace('-', '')}';
    const lang = commonLang ? commonLang : baseLang;
    // 根据当前语言设置翻译函数的语言包
    globalThis.${translateKey}.locale(globalThis.langMap[lang], '${namespace}');
    globalThis.$changeLang = (lang) => {
        globalThis.${translateKey}.locale(globalThis.langMap[lang], '${namespace}');
    };`
}

/**
 * @description: 生成完整的翻译基础函数文本
 */
function generateTranslateBasicFnText(): string {
    const {
        translateKey,
        namespace,
        originLang,
        targetLangList,
        commonTranslateKey,
        languageJsonMode
    } = option
    const mode = languageJsonMode || 'merged'

    // 生成各个部分
    const importStatement = generateImportStatement(mode)
    const coreFunctions = generateCoreFunctions(translateKey)
    const helperFunction = generateHelperFunction(mode)
    const langMapList = generateLangMapList(targetLangList, originLang, namespace, mode)
    const languageInit = generateLanguageInitialization(
        translateKey,
        namespace,
        commonTranslateKey,
        originLang
    )

    // 组合完整文本
    return `
    ${importStatement}
    ${coreFunctions}
    ${helperFunction}
    })();
    ${languageInit.replace('{{LANG_MAP_LIST}}', langMapList)}
  `
}

/**
 * @description: 检查文件是否需要更新
 */
function shouldUpdateFile(filePath: string, newContent: string): boolean {
    // 如果要重写配置
    if (option.rewriteConfig) {
        if (!fs.existsSync(filePath)) {
            return true
        }

        // 哈希比对
        const currentHash = generateId(newContent)
        const existingContent = fs.readFileSync(filePath, 'utf-8')
        const existingHash = generateId(existingContent)

        return currentHash !== existingHash
    } else {
        return false
    }
}

/**
 * @description: 初始化翻译基础函数文件
 * @returns {void}
 */
export function initTranslateBasicFnFile() {
    const indexPath = path.join(option.globalPath, 'index.js')
    const translateBasicFnText = generateTranslateBasicFnText()

    // 检查是否需要更新文件
    if (shouldUpdateFile(indexPath, translateBasicFnText)) {
        fs.writeFileSync(indexPath, translateBasicFnText)
        console.log('✅ 已更新翻译基础函数文件')
    }
}
