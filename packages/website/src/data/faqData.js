export const faqCategories = [
  {
    id: 'getting-started',
    title: '快速开始',
    icon: '🚀',
    description: '安装配置和基础使用问题'
  },
  {
    id: 'configuration',
    title: '配置相关',
    icon: '⚙️',
    description: '翻译器配置和参数设置问题'
  },
  {
    id: 'troubleshooting',
    title: '常见问题',
    icon: '🔧',
    description: '使用过程中的常见错误和解决方案'
  },
  {
    id: 'advanced',
    title: '高级用法',
    icon: '💡',
    description: '多义词处理、自定义功能等高级特性'
  },
  {
    id: 'compatibility',
    title: '兼容性',
    icon: '🔄',
    description: '与其他工具和框架的兼容性问题'
  }
]

export const faqData = [
  {
    id: 'how-to-configure-translator',
    category: 'getting-started',
    question: '如何配置翻译器？',
    answer: '插件默认支持多种翻译服务，你可以根据需要选择配置：',
    code: `// 有道翻译（推荐，稳定）
import { YoudaoTranslator } from 'vite-auto-i18n-plugin'

vitePluginsAutoI18n({
  translator: new YoudaoTranslator({
    appId: '你申请的appId',
    appKey: '你申请的appKey'
  })
})

// 谷歌翻译（免费，需翻墙）
import { GoogleTranslator } from 'vite-auto-i18n-plugin'

vitePluginsAutoI18n({
  translator: new GoogleTranslator({
    proxyOption: {
      host: '127.0.0.1',
      port: 7890,
      headers: {
        'User-Agent': 'Node'
      }
    }
  })
})

// 百度翻译（稳定，免费额度大）
import { BaiduTranslator } from 'vite-auto-i18n-plugin'

vitePluginsAutoI18n({
  translator: new BaiduTranslator({
    appId: '你申请的appId',
    appKey: '你申请的appKey'
  })
})`,
    tags: ['翻译器', '配置', '有道', '谷歌', '百度'],
    importance: 'high'
  },
  {
    id: 'how-to-apply-api-keys',
    category: 'getting-started',
    question: '如何申请翻译API的appId和key？',
    answer: '不同翻译服务的申请流程：',
    details: [
      {
        service: '有道翻译',
        url: 'https://ai.youdao.com',
        quota: '50免费额度',
        steps: [
          '访问有道智云开放平台',
          '注册账号并登录',
          '创建应用获取appId和appKey',
          '查看剩余额度避免超限'
        ]
      },
      {
        service: '百度翻译',
        url: 'https://api.fanyi.baidu.com',
        quota: '每月数万字免费额度',
        steps: [
          '访问百度翻译开放平台',
          '注册百度账号',
          '创建翻译应用',
          '获取APP ID和密钥'
        ]
      },
      {
        service: '谷歌翻译',
        url: '无需申请',
        quota: '免费但有频率限制',
        steps: [
          '无需申请账号',
          '需要稳定的代理环境',
          '默认代理端口7890',
          '频繁使用可能被限制'
        ]
      }
    ],
    tags: ['API', 'appId', 'appKey', '申请流程'],
    importance: 'high'
  },
  {
    id: 'how-to-modify-translations',
    category: 'configuration',
    question: '如何修改翻译内容？',
    answer: '插件运行后会在globalPath目录生成翻译配置文件，你可以直接修改：',
    code: `// lang/index.json 文件结构
{
  "hash_key_1": {
    "zh-cn": "中文原文",
    "en": "English Translation",  // 直接修改这里
    "ja": "日本語訳"
  },
  "hash_key_2": {
    "zh-cn": "另一个文本",
    "en": "Another Text"
  }
}`,
    details: [
      '翻译键（hash_key_1）是基于源语言生成的唯一标识，不可修改',
      '只需修改对应语言的翻译内容即可',
      '保存文件后刷新页面即可看到效果',
      '建议将翻译文件纳入版本控制'
    ],
    tags: ['翻译修改', 'JSON', 'hash键'],
    importance: 'high'
  },
  {
    id: 'how-to-exclude-text',
    category: 'configuration',
    question: '如何排除不需要翻译的文本？',
    answer: '使用$$t()语法可以标记不需要翻译的内容：',
    code: `// 需要翻译的内容
const text = 'Hello World!'; // ✅ 会被自动翻译

// 不需要翻译的内容  
const name = $$t('Tom');     // ❌ 被排除，不会翻译

// 也可以通过配置排除
vitePluginsAutoI18n({
  excludedCall: ['myFunction', 'console.log'],
  excludedPattern: [/^[A-Z_]+$/, /\.\\w+$/],
  excludedPath: ['node_modules', 'dist']
})`,
    details: [
      '$$t()是默认的排除语法',
      'excludedCall可排除特定函数内的文本',
      'excludedPattern用正则排除特定模式的字符串',
      'excludedPath排除特定目录下的文件'
    ],
    tags: ['排除', '$$t', 'excludedCall', '正则'],
    importance: 'medium'
  },
  {
    id: 'how-to-handle-ambiguous-words',
    category: 'advanced',
    question: '多义词如何处理？',
    answer: '同一个词在不同上下文中需要不同翻译时，可以使用命名空间：',
    code: `// 场景1：天空的"天"
<div>今天的<span>天</span>很蓝</div>  
// 自动生成：$t('auto_hash_1', '天', 'lang') → "sky"

// 场景2：时间单位的"天" 
<div>还有{{num}}天</div>
// 手动指定：$t('day_hash', '天', 'lang') → "day"`,
    details: [
      '插件会为相同文本生成相同的hash键',
      '如需区分含义，可以手动指定不同的hash键',
      '在JSON文件中为不同hash键配置不同翻译',
      '命名空间可以进一步隔离不同模块的翻译'
    ],
    example: `// JSON配置示例
{
  "auto_hash_1": {
    "zh-cn": "天", 
    "en": "sky"
  },
  "day_hash": {
    "zh-cn": "天",
    "en": "day" 
  }
}`,
    tags: ['多义词', '命名空间', 'hash键', '上下文'],
    importance: 'medium'
  },
  {
    id: 'can-translate-english-projects',
    category: 'advanced',
    question: '能否翻译英文项目？',
    answer: '可以，但需要使用半自动模式：',
    code: `// 配置半自动模式支持英文源语言
vitePluginsAutoI18n({
  translateType: 'semi-auto',  // 必须使用半自动模式
  originLang: 'en',            // 源语言设为英文
  targetLangList: ['zh-cn', 'ja'],
  translator: new YoudaoTranslator({
    appId: 'YOUR_ID',
    appKey: 'YOUR_KEY'
  })
})

// 手动标记需要翻译的英文文本
<div>{$t('Hello bro')}</div>`,
    details: [
      '全自动模式只支持中日韩俄为源语言（基于正则匹配规则）',
      '半自动模式需要手动用$t()包裹要翻译的文本',
      '英文没有特色的正则匹配规则，无法自动扫描',
      '半自动模式支持任意源语言'
    ],
    tags: ['英文项目', 'semi-auto', '半自动模式'],
    importance: 'medium'
  },
  {
    id: 'full-auto-language-limitation',
    category: 'troubleshooting',
    question: '为什么全自动模式只支持中日韩俄？',
    answer: '这是由插件的文本识别机制决定的：',
    details: [
      '全自动模式依赖源语言的正则表达式扫描文本',
      '中日韩俄有明显的字符特征，容易编写正则规则',
      '英文等拉丁字符难以区分是否需要翻译',
      '比如 "Hello" 可能是要翻译的文本，也可能是变量名'
    ],
    solution: '如需翻译英文项目，请使用半自动模式配合手动标记',
    tags: ['全自动模式', '语言限制', '正则匹配'],
    importance: 'low'
  },
  {
    id: 'vue-i18n-compatibility',
    category: 'compatibility',
    question: '如何兼容Vue-i18n？',
    answer: '如果项目已使用Vue-i18n，可以修改插件的翻译函数名避免冲突：',
    code: `// 修改插件配置
vitePluginsAutoI18n({
  translateKey: '$ai18n',        // 新的翻译函数名
  excludedCall: ['$t']           // 过滤Vue-i18n的$t函数
})

// 在组件中并存使用
<template>
  <!-- Vue-i18n的本地化文本 -->
  <h1>{{ $t('greeting') }}</h1>
  
  <!-- 插件翻译的通用文本 -->
  <div>{{ $ai18n('你好世界') }}</div>
</template>`,
    tags: ['Vue-i18n', '兼容性', 'translateKey'],
    importance: 'medium'
  },
  {
    id: 'interpolation-support',
    category: 'advanced',
    question: '如何使用插值功能？',
    answer: 'v1.1.5开始支持字符串插值，使用全局$iS函数：',
    code: `// 插值函数签名
window.$iS = function (val, args)

// 使用示例
window.$iS(
  '我的名字叫\${0}，在\${1}做\${2}的工作', 
  ['小山','广州','程序员']
)
// 输出: "我的名字叫小山，在广州做程序员的工作"

// 在Vue组件中使用
<template>
  <div>{{ $iS('今天是\${0}，天气\${1}', [date, weather]) }}</div>
</template>`,
    details: [
      '$iS函数会自动挂载到全局对象',
      '占位符格式为${数字}',
      'args数组按索引替换对应占位符',
      '支持任意数量的参数替换'
    ],
    tags: ['插值', '$iS', '字符串模板'],
    importance: 'low'
  },
  {
    id: 'plugin-position',
    category: 'troubleshooting',
    question: '插件应该放在什么位置？',
    answer: '插件应该放在插件数组的最后位置：',
    code: `// 正确的插件顺序
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // 其他插件...
    vitePluginsAutoI18n({...})  // 放在最后
  ]
})`,
    reason: '插件默认操作最后生成的JS代码，因此需要在其他插件处理完成后再执行',
    tags: ['插件顺序', '配置位置'],
    importance: 'medium'
  },
  {
    id: 'translation-api-errors',
    category: 'troubleshooting',
    question: '翻译API请求失败怎么办？',
    answer: '常见的API错误及解决方案：',
    solutions: [
      {
        error: '翻译异常：返回结果不完整',
        causes: ['API额度不足', '网络连接问题', '请求频率过高'],
        solutions: ['检查翻译服务余额', '检查网络连接', '增加请求间隔时间']
      },
      {
        error: 'ETIMEDOUT 请求超时',
        causes: ['网络问题', '代理配置错误（谷歌翻译）'],
        solutions: ['检查网络连接', '确认代理端口（默认7890）', '更换翻译服务']
      },
      {
        error: '403 Forbidden',
        causes: ['API密钥错误', '请求频率超限'],
        solutions: ['检查appId和appKey', '降低请求频率', '等待一段时间后重试']
      }
    ],
    tips: [
      '国内推荐使用有道或百度翻译，稳定性更好',
      '谷歌翻译免费但不稳定，适合开发测试',
      '可以配置多个翻译器做备选方案'
    ],
    tags: ['API错误', '超时', '403'],
    importance: 'high'
  },
  {
    id: 'proxy-configuration',
    category: 'troubleshooting',
    question: '如何配置代理使用谷歌翻译？',
    answer: '谷歌翻译需要代理访问，配置方法：',
    code: `// 配置代理（默认端口7890）
import { GoogleTranslator } from 'vite-auto-i18n-plugin'

vitePluginsAutoI18n({
  translator: new GoogleTranslator({
    proxyOption: {
      host: '127.0.0.1',
      port: 7890,           // Clash默认端口
      headers: {
        'User-Agent': 'Node'
      }
    }
  })
})

// 自定义代理端口
translator: new GoogleTranslator({
  proxyOption: {
    host: '127.0.0.1', 
    port: 8080,         // 你的代理端口
    headers: {
      'User-Agent': 'Node'
    }
  }
})`,
    notes: [
      '确保代理软件正在运行',
      '检查代理端口是否正确',
      '某些代理软件需要开启"允许局域网连接"',
      '如果仍然失败，建议使用有道或百度翻译'
    ],
    tags: ['代理', '谷歌翻译', '端口配置'],
    importance: 'medium'
  }
]

export default {
  faqCategories,
  faqData
}