/**
 * 配置参数数据
 * 基于 auto-i18n-translation-plugins 的 option.ts 文件分析
 */

export const configCategories = [
    {
        id: 'core',
        title: '核心配置',
        description: '控制插件基础功能的核心参数',
        icon: '⚙️'
    },
    {
        id: 'filter',
        title: '过滤配置',
        description: '控制哪些内容需要或不需要翻译',
        icon: '🔍'
    },
    {
        id: 'file',
        title: '文件配置',
        description: '控制翻译文件的生成和存储',
        icon: '📁'
    },
    {
        id: 'translator',
        title: '翻译器配置',
        description: '配置翻译服务和相关选项',
        icon: '🌐'
    },
    {
        id: 'advanced',
        title: '高级配置',
        description: '高级功能和性能优化选项',
        icon: '🚀'
    },
    {
        id: 'extension',
        title: '扩展配置',
        description: '自定义扩展和特殊需求配置',
        icon: '🔧'
    }
]

export const configOptions = [
    // 核心配置
    {
        category: 'core',
        name: 'enabled',
        type: 'boolean | function',
        default: 'true',
        required: false,
        description: '是否启用插件',
        detail: '可以是布尔值或返回布尔值的函数，用于动态控制插件是否执行',
        example: `// ${'布尔值'}
enabled: true

// ${'函数形式（动态控制）'}
enabled: () => process.env.NODE_ENV === 'development'`,
        notes: ['可以用函数形式动态控制插件的启用状态', '在生产环境可能需要根据条件禁用插件']
    },
    {
        category: 'core',
        name: 'translateType',
        type: "'full-auto' | 'semi-auto'",
        default: "'full-auto'",
        required: false,
        description: '翻译类型模式',
        detail: '控制翻译的工作模式：全自动扫描或半自动标记',
        example: `// 全自动模式（推荐）
translateType: 'full-auto'

// ${'半自动模式（需要手动标记）'}
translateType: 'semi-auto'`,
        notes: [
            'full-auto: 自动扫描代码中的目标语言文本',
            'semi-auto: 只翻译被 $t() 包裹的文本',
            'full-auto 仅支持中日韩俄为源语言',
            'semi-auto 支持任意源语言'
        ]
    },
    {
        category: 'core',
        name: 'translateKey',
        type: 'string',
        default: "'$t'",
        required: true,
        description: '翻译调用函数名称',
        detail: '指定生成的翻译函数名，会替换源代码中的目标文本',
        example: `// ${'默认使用 $t'}
translateKey: '$t'
// 生成代码: $t('hash123', '你好', 'lang')

// ${'自定义函数名'}
translateKey: '$translate'
// 生成代码: $translate('hash123', '你好', 'lang')`,
        notes: [
            '会自动添加到 excludedCall 列表中避免被重复处理',
            '如果与现有 i18n 库冲突，建议修改此配置',
            '生成的翻译函数格式: translateKey(hash, text, namespace)'
        ]
    },
    {
        category: 'core',
        name: 'originLang',
        type: 'string',
        default: "'zh-cn'",
        required: true,
        description: '源语言类型',
        detail: '指定项目中当前使用的语言，作为翻译的基准语言',
        example: `// 中文项目
originLang: 'zh-cn'

// 英文项目（需配合 semi-auto 模式）
originLang: 'en'

// 日文项目
originLang: 'ja'`,
        notes: [
            'full-auto 模式只支持: zh-cn, ja, ko, ru',
            'semi-auto 模式支持任意语言',
            '必须确保源语言在 targetLangList 中或单独处理'
        ]
    },
    {
        category: 'core',
        name: 'targetLangList',
        type: 'string[]',
        default: "['en']",
        required: true,
        description: '目标翻译语言列表',
        detail: '指定需要翻译成的语言类型数组，支持多语言同时翻译',
        example: `// 翻译成英文
targetLangList: ['en']

// 多语言翻译
targetLangList: ['en', 'ja', 'ko', 'ru']

// 包含繁体中文
targetLangList: ['en', 'zh-tw', 'ja']`,
        notes: [
            '支持的语言类型参考各翻译器的语言代码',
            '中日韩俄语言必须使用标准代码：zh-cn, ja, ko, ru',
            '翻译器会按顺序处理每种语言'
        ]
    },

    // 过滤配置
    {
        category: 'filter',
        name: 'excludedCall',
        type: 'string[]',
        default: '[]',
        required: false,
        description: '排除的函数调用列表',
        detail: '指定不需要翻译的函数调用名称，这些函数内的文本会被忽略',
        example: `// 排除特定函数
excludedCall: ['console.log', 'alert', 'myCustomFunction']

// 排除链式调用
excludedCall: ['utils.log', 'this.showMessage']`,
        notes: [
            '默认已排除: console.log, require, $t 等',
            '支持点分割的链式调用',
            'translateKey 会自动添加到此列表',
            '可以避免某些调试或特殊函数被翻译'
        ]
    },
    {
        category: 'filter',
        name: 'excludedPattern',
        type: 'RegExp[]',
        default: '[/\\.\\w+$/]',
        required: false,
        description: '排除的字符串模式',
        detail: '使用正则表达式排除不需要翻译的字符串模式',
        example: `// 排除文件扩展名和URL
excludedPattern: [
  /\\.\\w+$/,        // 文件扩展名 .js, .css
  /^https?:\\/\\//,   // URL地址
  /^[A-Z_]+$/        // 全大写常量
]`,
        notes: [
            '默认排除文件扩展名模式',
            '可以有效避免路径、URL、常量等被误翻译',
            '使用正则表达式提供灵活的匹配规则'
        ]
    },
    {
        category: 'filter',
        name: 'excludedPath',
        type: 'string[]',
        default: "['node_modules']",
        required: false,
        description: '排除的目录路径（黑名单）',
        detail: '指定不需要处理翻译的目录路径，支持相对路径和绝对路径',
        example: `// 排除特定目录
excludedPath: [
  'node_modules',
  'dist',
  'build',
  'tests',
  'docs'
]`,
        notes: [
            '默认排除 node_modules 目录',
            '通常应排除第三方库、构建输出、测试文件等',
            '提高处理性能，避免处理不必要的文件'
        ]
    },
    {
        category: 'filter',
        name: 'includePath',
        type: 'RegExp[]',
        default: '[/src\\//]',
        required: false,
        description: '包含的目录路径（白名单）',
        detail: '使用正则表达式指定需要处理翻译的目录路径',
        example: `// 只处理 src 目录
includePath: [/src\\//]

// 处理多个目录
includePath: [
  /src\\//,
  /components\\//,
  /views\\//
]`,
        notes: [
            '默认只处理 src/ 目录',
            '与 excludedPath 配合使用可精确控制处理范围',
            '使用正则表达式提供灵活的路径匹配'
        ]
    },

    // 文件配置
    {
        category: 'file',
        name: 'globalPath',
        type: 'string',
        default: "'./lang'",
        required: false,
        description: '翻译配置文件生成路径',
        detail: '指定翻译配置文件（index.js 和 index.json）的生成位置',
        example: `// 默认位置
globalPath: './lang'

// 自定义位置
globalPath: './src/i18n'
globalPath: './public/locales'`,
        notes: [
            '生成的文件包括 index.js（运行时）和 index.json（配置）',
            '路径相对于项目根目录',
            '需要在入口文件中引入生成的 index.js'
        ]
    },
    {
        category: 'file',
        name: 'distPath',
        type: 'string',
        default: "''",
        required: false,
        description: '打包后生成文件的位置',
        detail: '指定生产环境构建后的资源文件存放目录，用于 buildToDist 功能',
        example: `// Vite 构建输出
distPath: './dist/assets'

// Webpack 构建输出
distPath: './dist/js'`,
        notes: [
            '仅在 buildToDist: true 时需要配置',
            '应该匹配构建工具的输出目录',
            '用于将翻译配置注入到构建产物中'
        ]
    },
    {
        category: 'file',
        name: 'distKey',
        type: 'string',
        default: "'index'",
        required: false,
        description: '打包后主文件名称',
        detail: '指定构建输出的主文件名（不含扩展名），用于定位注入目标',
        example: `// 默认主文件
distKey: 'index'

// 自定义主文件名
distKey: 'main'
distKey: 'app'`,
        notes: [
            '仅在 buildToDist: true 时需要配置',
            '通常是构建输出的入口文件名',
            '插件会在此文件中注入翻译配置'
        ]
    },
    {
        category: 'file',
        name: 'namespace',
        type: 'string',
        default: "'lang'",
        required: true,
        description: '项目命名空间',
        detail: '用于区分不同项目的翻译配置，防止全局命名冲突',
        example: `// 默认命名空间
namespace: 'lang'

// 项目专用命名空间
namespace: 'myapp'
namespace: 'admin-panel'`,
        notes: [
            '影响全局变量名和本地存储键名',
            '多项目部署时应使用不同的命名空间',
            '生成的全局对象为 window[namespace]'
        ]
    },
    {
        category: 'file',
        name: 'buildToDist',
        type: 'boolean',
        default: 'false',
        required: false,
        description: '是否将翻译配置打包到主包中',
        detail: '控制是否在构建时将最新的翻译文件注入到构建产物中',
        example: `// 不打包（推荐）
buildToDist: false

// 打包到主包中
buildToDist: true`,
        notes: [
            '开启后需要配置 distPath 和 distKey',
            '可能导致构建产物包含重复的翻译配置',
            '建议在 CI/CD 中处理翻译文件的同步'
        ]
    },

    // 翻译器配置
    {
        category: 'translator',
        name: 'translator',
        type: 'Translator',
        default: 'GoogleTranslator',
        required: false,
        description: '翻译器实例',
        detail: '指定用于自动翻译的翻译器实例，决定翻译API的调用方式',
        example: `// 有道翻译（推荐）
import { YoudaoTranslator } from 'vite-auto-i18n-plugin'
translator: new YoudaoTranslator({
  appId: 'your-app-id',
  appKey: 'your-app-key'
})

// 谷歌翻译（需翻墙）
import { GoogleTranslator } from 'vite-auto-i18n-plugin'
translator: new GoogleTranslator({
  proxyOption: {
    host: '127.0.0.1',
    port: 7890
  }
})

// 百度翻译
import { BaiduTranslator } from 'vite-auto-i18n-plugin'
translator: new BaiduTranslator({
  appId: 'your-app-id',
  appKey: 'your-app-key'
})`,
        notes: [
            '默认使用 GoogleTranslator',
            '国内推荐使用 YoudaoTranslator',
            '可以自定义翻译器继承 Translator 基类'
        ]
    },
    {
        category: 'translator',
        name: 'translatorOption',
        type: 'object',
        default: 'undefined',
        required: false,
        description: '翻译器配置选项',
        detail: '当不直接传入 translator 实例时，使用此配置创建默认翻译器',
        example: `// 基础翻译器配置
translatorOption: {
  name: '自定义翻译器',
  maxChunkSize: 4500,
  interval: 1000
}`,
        notes: [
            '优先级低于 translator 配置',
            '当 translator 未设置时会使用此配置创建基础翻译器',
            '主要用于简单的自定义翻译需求'
        ]
    },

    // 高级配置
    {
        category: 'advanced',
        name: 'deepScan',
        type: 'boolean',
        default: 'false',
        required: false,
        description: '深度扫描模式（实验性）',
        detail: '是否对字符串进行深层切割扫描，只翻译其中的目标语言部分',
        example: `// 开启深度扫描
deepScan: true

// 原始字符串：\`<div>你好</div>\`
// 普通模式：整个字符串被翻译
// 深度模式：\`<div>\${$t('你好')}</div>\``,
        notes: [
            '实验性功能，可能影响性能',
            '能够更精确地翻译模板字符串中的文本',
            '对包含HTML标签或特殊字符的字符串效果更好'
        ]
    },
    {
        category: 'advanced',
        name: 'rewriteConfig',
        type: 'boolean',
        default: 'true',
        required: false,
        description: '是否重写配置文件',
        detail: '控制插件每次运行时是否重新生成配置文件',
        example: `// 每次重写配置（推荐）
rewriteConfig: true

// 保持现有配置
rewriteConfig: false`,
        notes: [
            '切换 languageJsonMode 时建议设置为 true',
            '设置为 false 时会保留手动修改的翻译内容',
            '首次运行或配置变更时建议开启'
        ]
    },
    {
        category: 'advanced',
        name: 'commonTranslateKey',
        type: 'string',
        default: "''",
        required: false,
        description: '通用翻译键',
        detail: '用于多个不同命名空间的项目共享同一个语言设置',
        example: `// 使用通用语言键
commonTranslateKey: 'global-lang'

// 多个项目共享语言设置
// 项目A: namespace: 'app-a', commonTranslateKey: 'shared'
// 项目B: namespace: 'app-b', commonTranslateKey: 'shared'`,
        notes: [
            '设置后语言切换会优先读取此键对应的语言',
            '实现跨项目的统一语言管理',
            '为空时使用 namespace 作为语言键'
        ]
    },
    {
        category: 'advanced',
        name: 'isClear',
        type: 'boolean',
        default: 'false',
        required: false,
        description: '清理未使用的翻译',
        detail: '是否清除项目中不再使用的源语言键值对（仅打包模式下支持）',
        example: `// 开启清理（仅打包时）
isClear: true

// 关闭清理（保留所有翻译）
isClear: false`,
        notes: ['仅在打包模式下生效', '可以减少翻译文件的大小', '删除操作不可逆，建议谨慎使用']
    },
    {
        category: 'advanced',
        name: 'isClearSpace',
        type: 'boolean',
        default: 'true',
        required: false,
        description: '是否清除源字符串左右空格',
        detail: '控制是否清除源文本左右两边的空格字符',
        example: `// 清除空格（推荐）
isClearSpace: true
// "  你好  " → "你好"

// 保留空格
isClearSpace: false
// "  你好  " → "  你好  "`,
        notes: [
            '默认会清除空格以提高翻译准确性',
            '保留空格可能导致翻译键冲突',
            '影响 Hash 键的生成'
        ]
    },
    {
        category: 'advanced',
        name: 'languageJsonMode',
        type: "'merged' | 'split'",
        default: "'merged'",
        required: false,
        description: '语言JSON存储模式',
        detail: '控制翻译配置的存储方式：合并到单个文件或分割为多个文件',
        example: `// 合并模式（推荐）
languageJsonMode: 'merged'
// 生成：index.json

// 分割模式
languageJsonMode: 'split'  
// 生成：en.json, ja.json, zh-cn.json`,
        notes: [
            '合并模式便于管理和查看',
            '分割模式便于按需加载',
            '切换模式时建议设置 rewriteConfig: true'
        ]
    },

    // 扩展配置
    {
        category: 'extension',
        name: 'translateExtends',
        type: 'BaseExtendsType | null',
        default: 'null',
        required: false,
        description: '自定义扩展类',
        detail: '用于自定义翻译函数的挂载对象和行为，需要继承 BaseExtends 类',
        example: `// 自定义扩展示例
class MyCustomExtends extends BaseExtends {
  handleInitFile(option) {
    // 自定义初始化逻辑
  }
  
  handleCodeCall(config, insertOption) {
    // 自定义代码调用处理
  }
}

translateExtends: new MyCustomExtends()`,
        notes: [
            '默认翻译函数挂载在 window 对象上',
            '可以自定义挂载到其他对象或实现特殊逻辑',
            '需要实现 handleInitFile、handleCodeCall 等方法'
        ]
    },
    {
        category: 'extension',
        name: 'insertFileExtensions',
        type: 'string[]',
        default: '[]',
        required: false,
        description: '自定义文件扩展名列表',
        detail: '指定需要插入翻译代码的额外文件扩展名',
        example: `// 处理额外的文件类型
insertFileExtensions: ['.svelte', '.astro', '.solid']

// 处理特殊扩展名
insertFileExtensions: ['.page.tsx', '.component.vue']`,
        notes: [
            '默认支持 .js, .ts, .jsx, .tsx, .vue 等',
            '可以扩展支持其他框架的文件类型',
            '文件扩展名需要包含点号'
        ]
    }
]

export default {
    configCategories,
    configOptions
}
