export const heroFeatures = [
  {
    icon: '⚡',
    title: '零代码侵入',
    description: '无需修改业务代码，自动识别并翻译目标文本'
  },
  {
    icon: '🌐',
    title: '多翻译服务',
    description: '支持有道、谷歌、百度、火山AI等翻译服务'
  },
  {
    icon: '🛠️',
    title: '全工具链支持',
    description: '兼容Vite、Webpack、Rollup、Rsbuild等主流构建工具'
  },
  {
    icon: '🎯',
    title: '智能识别',
    description: '基于Babel AST精准识别需要翻译的文本内容'
  }
]

export const coreFeatures = [
  {
    id: 'ast-transformation',
    icon: '🔧',
    title: 'AST智能转换',
    description: '基于Babel抽象语法树，精准识别和转换代码中的文本',
    highlights: [
      '支持StringLiteral、JSXText、TemplateLiteral等多种语法',
      'Visitor模式遍历，确保转换的准确性',
      '自动排除注释、导入语句、对象键等不需要翻译的内容'
    ],
    technicalDetails: {
      visitors: ['StringLiteral', 'JSXText', 'TemplateLiteral', 'CallExpression'],
      supported: ['JavaScript', 'TypeScript', 'JSX', 'TSX', 'Vue SFC'],
      excluded: ['Comments', 'Import statements', 'Object keys', 'Function names']
    }
  },
  {
    id: 'dual-mode',
    icon: '🔄',
    title: '双模式支持',
    description: '提供全自动和半自动两种翻译模式，满足不同项目需求',
    highlights: [
      '全自动模式：零配置，自动扫描中日韩俄文本',
      '半自动模式：手动标记，支持任意源语言',
      '灵活切换，适应不同开发场景'
    ],
    comparison: {
      fullAuto: {
        pros: ['零配置', '开箱即用', '效率最高'],
        cons: ['仅支持中日韩俄', '可能误翻译'],
        useCase: '新项目快速国际化'
      },
      semiAuto: {
        pros: ['支持所有语言', '精确控制', '避免误翻译'],
        cons: ['需手动标记', '工作量稍大'],
        useCase: '现有项目渐进式国际化'
      }
    }
  },
  {
    id: 'smart-chunking',
    icon: '📦',
    title: '智能分块翻译',
    description: '自动分割长文本，并行翻译，提高翻译效率和成功率',
    highlights: [
      '自动按4500字符分块，避免API限制',
      '并行翻译提高速度，显示实时进度',
      '智能合并结果，保持文本完整性'
    ],
    algorithm: {
      chunkSize: 4500,
      separator: '\\n┇┇┇\\n',
      features: ['并行处理', '进度显示', '错误重试', '结果验证']
    }
  },
  {
    id: 'hash-mechanism',
    icon: '🔐',
    title: 'Hash去重机制',
    description: '基于文本内容生成唯一哈希，避免重复翻译，提高效率',
    highlights: [
      '相同文本生成相同Hash，避免重复翻译',
      '增量翻译，只处理新增内容',
      '支持命名空间，处理多义词场景'
    ],
    benefits: [
      '减少API调用次数，节约成本',
      '提高翻译速度，增量更新',
      '保持翻译一致性，避免重复工作'
    ]
  },
  {
    id: 'deep-scan',
    icon: '🔍',
    title: '深度扫描算法',
    description: '智能分词算法，精确提取模板字符串中的待翻译内容',
    highlights: [
      '基于正则的智能分词，识别标点和换行',
      '模板字符串切割，只翻译目标语言部分',
      '保持HTML标签和特殊字符结构'
    ],
    example: {
      before: '`<div>你好</div>`',
      after: '`<div>${$t(\'你好\')}</div>`',
      benefit: '避免翻译HTML标签，提高翻译准确性'
    }
  },
  {
    id: 'multi-translator',
    icon: '🌍',
    title: '多翻译器生态',
    description: '内置多种翻译服务，支持自定义翻译器，灵活满足需求',
    translators: [
      {
        name: '有道翻译',
        features: ['稳定可靠', '50免费额度', '翻译质量好'],
        suitable: '中小型项目，日常开发'
      },
      {
        name: '谷歌翻译',
        features: ['完全免费', '翻译质量高', '需要代理'],
        suitable: '开发测试，预算有限'
      },
      {
        name: '百度翻译',
        features: ['免费额度大', '国内稳定', '中文友好'],
        suitable: '大型项目，中文为主'
      },
      {
        name: '火山AI翻译',
        features: ['AI驱动', '翻译最准', '成本较高'],
        suitable: '高质量要求，专业翻译'
      }
    ]
  }
]

export const performanceStats = [
  {
    label: '处理速度',
    value: '1000+',
    unit: '文件/分钟',
    description: '基于AST的高效处理'
  },
  {
    label: '翻译准确率',
    value: '95%',
    unit: '+',
    description: '智能过滤和上下文识别'
  },
  {
    label: '支持语言',
    value: '30+',
    unit: '种',
    description: '覆盖主流国际化需求'
  },
  {
    label: '框架支持',
    value: '100%',
    unit: '',
    description: 'Vue/React/Angular全支持'
  }
]

export const useCases = [
  {
    title: '新项目快速国际化',
    description: '零配置启动，自动识别翻译，快速实现多语言支持',
    scenario: 'Vue3新项目需要支持中英日三种语言',
    solution: '使用full-auto模式，配置有道翻译器，一键生成多语言版本',
    timeReduction: '从2周缩短到2小时'
  },
  {
    title: '大型项目渐进式改造',
    description: '半自动模式精确控制，逐步完成国际化改造',
    scenario: 'React项目包含10000+行代码，需要渐进式国际化',
    solution: '使用semi-auto模式，按模块逐步标记和翻译',
    timeReduction: '减少70%人工翻译工作量'
  },
  {
    title: '多项目统一管理',
    description: '通用翻译键，实现跨项目语言设置统一管理',
    scenario: '微前端架构，多个子应用需要统一语言切换',
    solution: '配置commonTranslateKey，实现一处切换，全局生效',
    benefit: '用户体验一致，维护成本降低'
  }
]

export const integrationGuide = {
  vite: {
    title: 'Vite集成',
    installation: 'npm install vite-auto-i18n-plugin --save-dev',
    config: `import vitePluginsAutoI18n, { YoudaoTranslator } from 'vite-auto-i18n-plugin'

export default defineConfig({
  plugins: [
    vue(),
    vitePluginsAutoI18n({
      translator: new YoudaoTranslator({
        appId: 'your-app-id',
        appKey: 'your-app-key'
      })
    })
  ]
})`
  },
  webpack: {
    title: 'Webpack集成',
    installation: 'npm install webpack-auto-i18n-plugin --save-dev',
    config: `const webpackPluginsAutoI18n = require('webpack-auto-i18n-plugin')
const { YoudaoTranslator } = require('webpack-auto-i18n-plugin')

module.exports = {
  plugins: [
    new webpackPluginsAutoI18n.default({
      translator: new YoudaoTranslator({
        appId: 'your-app-id',
        appKey: 'your-app-key'
      })
    })
  ]
}`
  },
  rsbuild: {
    title: 'Rsbuild集成',
    installation: 'npm install rsbuild-auto-i18n-plugin --save-dev',
    config: `const rsbuildPluginsAutoI18n = require('rsbuild-auto-i18n-plugin')

export default defineConfig({
  plugins: [
    rsbuildPluginsAutoI18n({
      translator: new YoudaoTranslator({
        appId: 'your-app-id',
        appKey: 'your-app-key'
      })
    })
  ]
})`
  }
}

export default {
  heroFeatures,
  coreFeatures,
  performanceStats,
  useCases,
  integrationGuide
}