export const translatorComparison = [
  {
    id: 'youdao',
    name: '有道翻译',
    logo: '🔵',
    status: 'recommended',
    pricing: 'freemium',
    description: '稳定可靠的翻译服务，适合日常开发使用',
    features: {
      stability: 5,
      quality: 4,
      speed: 4,
      cost: 4
    },
    pros: [
      '服务稳定，很少出现连接问题',
      '提供50个字符的免费额度',
      '翻译质量较好，中文支持优秀',
      'API文档完善，集成简单'
    ],
    cons: [
      '免费额度有限，大项目需付费',
      '需要实名认证申请API',
      '部分语种支持有限'
    ],
    configuration: {
      installation: 'npm install vite-auto-i18n-plugin --save-dev',
      setup: `import { YoudaoTranslator } from 'vite-auto-i18n-plugin'

vitePluginsAutoI18n({
  translator: new YoudaoTranslator({
    appId: '你申请的appId',
    appKey: '你申请的appKey'
  })
})`,
      apiApplication: {
        url: 'https://ai.youdao.com',
        steps: [
          '注册有道智云账号',
          '进入控制台创建应用',
          '获取AppId和AppKey',
          '查看剩余免费额度'
        ]
      }
    },
    useCase: '推荐用于中小型项目的日常开发和生产环境'
  },
  {
    id: 'google',
    name: '谷歌翻译',
    logo: '🔴',
    status: 'free',
    pricing: 'free',
    description: '完全免费的翻译服务，翻译质量高但需要代理',
    features: {
      stability: 2,
      quality: 5,
      speed: 3,
      cost: 5
    },
    pros: [
      '完全免费，无需申请API',
      '翻译质量最高，语种最全',
      'Google的AI技术支持',
      '支持所有主流语言'
    ],
    cons: [
      '需要稳定的代理环境',
      '国内访问不稳定',
      '频繁请求可能被限制',
      '依赖网络环境质量'
    ],
    configuration: {
      installation: '无需额外安装',
      setup: `import { GoogleTranslator } from 'vite-auto-i18n-plugin'

vitePluginsAutoI18n({
  translator: new GoogleTranslator({
    proxyOption: {
      host: '127.0.0.1',
      port: 7890,  // Clash默认端口
      headers: {
        'User-Agent': 'Node'
      }
    }
  })
})`,
      proxySetup: {
        requirements: '需要HTTP/HTTPS代理',
        commonPorts: [7890, 8080, 1080, 8888],
        troubleshooting: [
          '确保代理软件正在运行',
          '检查代理端口配置',
          '开启"允许局域网连接"',
          '尝试不同的代理节点'
        ]
      }
    },
    useCase: '适合开发测试、预算有限或需要高质量翻译的场景'
  },
  {
    id: 'baidu',
    name: '百度翻译',
    logo: '🔶',
    status: 'stable',
    pricing: 'freemium',
    description: '国内稳定的翻译服务，免费额度充足',
    features: {
      stability: 4,
      quality: 4,
      speed: 4,
      cost: 4
    },
    pros: [
      '国内访问稳定，无需代理',
      '每月提供数万字符免费额度',
      '中文翻译质量较好',
      'API响应速度快'
    ],
    cons: [
      '需要申请API并实名认证',
      '部分小语种支持有限',
      '翻译风格偏向中式表达'
    ],
    configuration: {
      installation: 'npm install vite-auto-i18n-plugin --save-dev',
      setup: `import { BaiduTranslator } from 'vite-auto-i18n-plugin'

vitePluginsAutoI18n({
  translator: new BaiduTranslator({
    appId: '你申请的appId',
    appKey: '你申请的appKey'
  })
})`,
      apiApplication: {
        url: 'https://api.fanyi.baidu.com',
        steps: [
          '注册百度开发者账号',
          '进入翻译API控制台',
          '创建翻译应用',
          '获取APP ID和密钥',
          '完成实名认证'
        ]
      }
    },
    useCase: '适合大型项目，特别是中文为主的国际化需求'
  },
  {
    id: 'volcengine',
    name: '火山引擎AI翻译',
    logo: '🟣',
    status: 'premium',
    pricing: 'paid',
    description: '基于AI大模型的高质量翻译服务',
    features: {
      stability: 4,
      quality: 5,
      speed: 2,
      cost: 2
    },
    pros: [
      '基于AI大模型，翻译最准确',
      '支持上下文理解，翻译更自然',
      '支持专业术语和领域翻译',
      '可配置不同模型（doubao、deepseek）'
    ],
    cons: [
      '成本较高，按使用量计费',
      '翻译速度相对较慢',
      '需要开通火山引擎服务',
      '配置相对复杂'
    ],
    configuration: {
      installation: 'npm install vite-auto-i18n-plugin --save-dev',
      setup: `import { VolcengineTranslator } from 'vite-auto-i18n-plugin'

vitePluginsAutoI18n({
  translator: new VolcengineTranslator({
    apiKey: '你申请的apiKey',
    model: 'doubao-1-5-pro-32k-250115'  // 或其他支持的模型
  })
})`,
      apiApplication: {
        url: 'https://www.volcengine.com/docs/82379/1299455',
        requirements: [
          '注册火山引擎账号',
          '开通大模型服务',
          '申请API密钥',
          '选择合适的模型'
        ]
      }
    },
    useCase: '适合对翻译质量要求极高的专业项目'
  },
  {
    id: 'empty',
    name: '扫描翻译器',
    logo: '⚪',
    status: 'utility',
    pricing: 'free',
    description: '仅扫描生成翻译文件，不进行实际翻译',
    features: {
      stability: 5,
      quality: 0,
      speed: 5,
      cost: 5
    },
    pros: [
      '完全免费，无需网络',
      '快速生成翻译模板',
      '适合预处理和测试',
      '无外部依赖'
    ],
    cons: [
      '不进行实际翻译',
      '需要手动填写翻译内容',
      '仅用于文件结构生成'
    ],
    configuration: {
      installation: 'npm install vite-auto-i18n-plugin --save-dev',
      setup: `import { EmptyTranslator } from 'vite-auto-i18n-plugin'

vitePluginsAutoI18n({
  translator: new EmptyTranslator()
})`,
      usage: '生成的JSON文件包含所有需要翻译的文本，但翻译内容为空，需要手动填写'
    },
    useCase: '适合需要人工翻译或使用其他翻译工具的场景'
  },
  {
    id: 'custom',
    name: '自定义翻译器',
    logo: '⚙️',
    status: 'advanced',
    pricing: 'depends',
    description: '基于Translator基类创建自定义翻译器',
    features: {
      stability: 3,
      quality: 3,
      speed: 3,
      cost: 3
    },
    pros: [
      '完全可控的翻译逻辑',
      '可接入任意翻译API',
      '支持复杂的业务需求',
      '灵活的错误处理'
    ],
    cons: [
      '需要自己实现翻译逻辑',
      '需要处理错误和重试',
      '开发成本较高'
    ],
    configuration: {
      installation: 'npm install vite-auto-i18n-plugin --save-dev',
      setup: `import { Translator } from 'vite-auto-i18n-plugin'
import axios from 'axios'

// 基础自定义翻译器
vitePluginsAutoI18n({
  translator: new Translator({
    name: '我的翻译器',
    fetchMethod: (str, fromKey, toKey, separator) => {
      const myApi = 'https://api.my-translator.com/translate'
      return axios.post(myApi, { 
        text: str, 
        from: fromKey, 
        to: toKey 
      }).then(res => res.data.result)
    },
    interval: 1000  // 请求间隔
  })
})

// 高级自定义翻译器
class MyCustomTranslator extends Translator {
  constructor() {
    super({
      name: '高级自定义翻译器',
      fetchMethod: this.customFetch.bind(this),
      onError: this.handleError.bind(this)
    })
  }
  
  async customFetch(text, from, to, separator) {
    // 自定义翻译逻辑
  }
  
  handleError(error, defaultHandler) {
    // 自定义错误处理
  }
}`,
      examples: [
        '接入企业内部翻译服务',
        '实现翻译结果缓存',
        '添加翻译质量检查',
        '支持批量翻译优化'
      ]
    },
    useCase: '适合有特殊翻译需求或使用企业内部翻译服务的场景'
  }
]

export const selectionGuide = {
  scenarios: [
    {
      title: '新项目快速上手',
      description: '刚开始的项目，需要快速实现国际化',
      recommendation: 'youdao',
      reasons: ['配置简单', '稳定可靠', '免费额度够用', '质量不错']
    },
    {
      title: '大型项目生产环境',
      description: '大量文本需要翻译，对稳定性要求高',
      recommendation: 'baidu',
      reasons: ['免费额度大', '国内访问稳定', '批量翻译高效', '成本可控']
    },
    {
      title: '预算有限的开源项目',
      description: '个人项目或开源项目，预算有限',
      recommendation: 'google',
      reasons: ['完全免费', '翻译质量最高', '语种支持全面']
    },
    {
      title: '高质量专业翻译',
      description: '对翻译质量要求极高的项目',
      recommendation: 'volcengine',
      reasons: ['AI驱动最准确', '上下文理解', '专业术语处理', '自然度高']
    },
    {
      title: '特殊业务需求',
      description: '有特殊翻译需求或使用企业服务',
      recommendation: 'custom',
      reasons: ['完全可控', '业务定制', '企业服务接入', '灵活扩展']
    }
  ],
  decisionMatrix: {
    criteria: [
      { name: '成本', weight: 0.3 },
      { name: '质量', weight: 0.25 },
      { name: '稳定性', weight: 0.25 },
      { name: '易用性', weight: 0.2 }
    ],
    scores: {
      youdao: { cost: 4, quality: 4, stability: 5, usability: 5 },
      google: { cost: 5, quality: 5, stability: 2, usability: 3 },
      baidu: { cost: 4, quality: 4, stability: 4, usability: 4 },
      volcengine: { cost: 2, quality: 5, stability: 4, usability: 3 },
      custom: { cost: 3, quality: 3, stability: 3, usability: 2 }
    }
  }
}

export default {
  translatorComparison,
  selectionGuide
}