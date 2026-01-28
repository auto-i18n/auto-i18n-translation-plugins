export const versionHistory = [
  {
    version: 'v1.1.16',
    date: '2024-12-15',
    title: '推荐版本',
    changes: [
      {
        type: 'fix',
        description: '修复模板字符串内部出现"导致生成id映射异常问题'
      }
    ]
  },
  {
    version: 'v1.1.15',
    date: '2024-12-10',
    title: '推荐版本',
    changes: [
      {
        type: 'improvement',
        description: '补充node14兼容'
      }
    ]
  },
  {
    version: 'v1.1.14',
    date: '2024-12-05',
    title: '推荐版本',
    changes: [
      {
        type: 'fix',
        description: '修复rewriteConfig异常问题'
      }
    ]
  },
  {
    version: 'v1.1.13',
    date: '2024-11-28',
    title: '不推荐版本',
    changes: [
      {
        type: 'feature',
        description: '新增json拆分配置'
      }
    ]
  },
  {
    version: 'v1.1.12',
    date: '2024-11-25',
    title: '推荐版本',
    changes: [
      {
        type: 'improvement',
        description: '优化控制台输出格式'
      }
    ]
  },
  {
    version: 'v1.1.11',
    date: '2024-11-20',
    title: '推荐版本',
    changes: [
      {
        type: 'improvement',
        description: '优化控制台输出格式，减少冗余打印'
      },
      {
        type: 'feature',
        description: '新增翻译进度条显示'
      },
      {
        type: 'feature',
        description: '支持 Webpack 4'
      }
    ]
  },
  {
    version: 'v1.1.10',
    date: '2024-11-15',
    title: '推荐版本',
    changes: [
      {
        type: 'feature',
        description: '新增 rsbuild 插件'
      }
    ]
  },
  {
    version: 'v1.1.9',
    date: '2024-11-10',
    title: '推荐版本',
    changes: [
      {
        type: 'fix',
        description: '修复 deepScan 切分字符串不处理换行符等问题'
      }
    ]
  },
  {
    version: 'v1.1.8',
    date: '2024-11-05',
    title: '推荐版本',
    changes: [
      {
        type: 'improvement',
        description: '是否支持清除前后空格配置重命名'
      }
    ]
  },
  {
    version: 'v1.1.7',
    date: '2024-11-01',
    title: '推荐版本',
    changes: [
      {
        type: 'feature',
        description: 'enable 能力兼容 翻译初始化补全'
      },
      {
        type: 'feature',
        description: '新增扫描是否支持清除前后空格配置'
      },
      {
        type: 'fix',
        description: '修复异常触发新增翻译问题'
      },
      {
        type: 'fix',
        description: '修复清理配置异常不生效问题'
      }
    ]
  },
  {
    version: 'v1.1.6',
    date: '2024-10-25',
    title: '推荐版本',
    changes: [
      {
        type: 'fix',
        description: '修复模板字符串前后空格清空导致 JSON 对应不上翻译函数的问题'
      },
      {
        type: 'fix',
        description: '修复插值中文括号导致插值失效的问题'
      },
      {
        type: 'feature',
        description: '新增清理配置功能'
      }
    ]
  },
  {
    version: 'v1.1.5',
    date: '2024-10-20',
    title: '推荐版本',
    changes: [
      {
        type: 'feature',
        description: '支持插值翻译'
      }
    ]
  },
  {
    version: 'v1.1.4',
    date: '2024-10-15',
    title: '推荐版本',
    changes: [
      {
        type: 'fix',
        description: '修复排除函数处理模版字符串异常问题'
      },
      {
        type: 'feature',
        description: '谷歌新增interval配置'
      },
      {
        type: 'feature',
        description: '新增翻译器支持自定义接口入参'
      }
    ]
  },
  {
    version: 'v1.1.3',
    date: '2024-10-10',
    title: '推荐版本',
    changes: [
      {
        type: 'feature',
        description: '新增无刷更新语言能力及最佳实践'
      }
    ]
  },
  {
    version: 'v1.1.2',
    date: '2024-10-05',
    title: '',
    changes: [
      {
        type: 'fix',
        description: '修复ai翻译异常'
      }
    ]
  },
  {
    version: 'v1.1.1',
    date: '2024-10-01',
    title: '',
    changes: [
      {
        type: 'feature',
        description: '新增翻译禁用功能'
      }
    ]
  },
  {
    version: 'v1.1.0',
    date: '2024-09-25',
    title: '',
    changes: [
      {
        type: 'feature',
        description: '新增ai翻译器'
      },
      {
        type: 'feature',
        description: '新增翻译插件vue2拓展插件机制'
      }
    ]
  },
  {
    version: 'v1.0.26',
    date: '2024-09-20',
    title: '推荐版本',
    changes: [
      {
        type: 'feature',
        description: '新增自定义拓展名数组'
      }
    ]
  },
  {
    version: 'v1.0.25',
    date: '2024-09-15',
    title: '推荐版本',
    changes: [
      {
        type: 'feature',
        description: '新增通用翻译key'
      }
    ]
  },
  {
    version: 'v1.0.24',
    date: '2024-09-10',
    title: '推荐版本',
    changes: [
      {
        type: 'fix',
        description: '修复半自动模式异常问题'
      }
    ]
  },
  {
    version: 'v1.0.23',
    date: '2024-09-05',
    title: '推荐版本',
    changes: [
      {
        type: 'fix',
        description: '修复打包写入重大bug'
      }
    ]
  },
  {
    version: 'v1.0.22',
    date: '2024-09-01',
    title: '',
    changes: [
      {
        type: 'feature',
        description: '新增扫描翻译器'
      }
    ]
  },
  {
    version: 'v1.0.21',
    date: '2024-08-25',
    title: '',
    changes: [
      {
        type: 'feature',
        description: '新增深度扫描'
      }
    ]
  },
  {
    version: 'v1.0.20',
    date: '2024-08-20',
    title: '',
    changes: [
      {
        type: 'fix',
        description: '修复过滤函数异常问题，以及补充是否覆盖生成配置文件项'
      }
    ]
  },
  {
    version: 'v1.0.19',
    date: '2024-08-15',
    title: '',
    changes: [
      {
        type: 'improvement',
        description: '配置文件兼容旧版本'
      }
    ]
  },
  {
    version: 'v1.0.18',
    date: '2024-08-10',
    title: '',
    changes: [
      {
        type: 'fix',
        description: '修复了低版本 Node 中可选链操作导致运行时异常的问题'
      }
    ]
  },
  {
    version: 'v1.0.17',
    date: '2024-08-05',
    title: '',
    changes: [
      {
        type: 'feature',
        description: '支持基本的服务器端渲染（实验性）'
      }
    ]
  },
  {
    version: 'v1.0.16',
    date: '2024-08-01',
    title: '',
    changes: [
      {
        type: 'fix',
        description: '修复已知问题（vue3注释节点）'
      }
    ]
  },
  {
    version: 'v1.0.15',
    date: '2024-07-25',
    title: '',
    changes: [
      {
        type: 'feature',
        description: '新增百度翻译'
      }
    ]
  },
  {
    version: 'v1.0.14',
    date: '2024-07-20',
    title: '',
    changes: [
      {
        type: 'fix',
        description: '修复新增语言类型，不主动切割问题'
      },
      {
        type: 'feature',
        description: '自动翻译能力新增日语，韩语，俄语'
      }
    ]
  },
  {
    version: 'v1.0.13',
    date: '2024-07-15',
    title: '',
    changes: [
      {
        type: 'fix',
        description: '已知问题修复'
      }
    ]
  },
  {
    version: 'v1.0.12',
    date: '2024-07-10',
    title: '',
    changes: [
      {
        type: 'improvement',
        description: '优化类型'
      }
    ]
  },
  {
    version: 'v1.0.11',
    date: '2024-07-05',
    title: '',
    changes: [
      {
        type: 'fix',
        description: '修复已知缺陷'
      },
      {
        type: 'feature',
        description: '新增翻译状态选项，支持半自动状态（用户可以用 translateKey 包裹需要翻译的文案，如：$t(\'hello\')，插件会扫描这些文案并实现自动翻译）'
      }
    ]
  }
]

export default {
  versionHistory
}
