
    // 导入国际化JSON文件（合并模式）
    import langJSON from './index.json'
    (function () {
    const _global = (function() {
        if (typeof globalThis !== 'undefined') return globalThis;
        if (typeof window !== 'undefined') return window;
        if (typeof global !== 'undefined') return global;
        if (typeof self !== 'undefined') return self;
        return {};
    })();
    // 定义翻译函数
    let $t = function (key, val, nameSpace) {
      // 获取指定命名空间下的语言包
      const langPackage = $t[nameSpace];
      // 返回翻译结果，如果不存在则返回默认值
      return (langPackage || {})[key] || val;
    };
    // 定义简单翻译函数，直接返回传入的值
    let $$t = function (val) {
      return val;
    };
    _global.$deepScan = function (val) {
      return val;
    };
    _global.$iS = function (val, args) {
        // 如果参数不是字符串或数组，直接返回原值
        if (typeof val !== 'string' || !Array.isArray(args)) {
            return val;
        }
        try {
            // 使用更安全的正则表达式替换方式
            return val.replace(/\$(?:\{|\｛)(\d+)(?:\}|\｝)/g, (match, index) => {
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
    $t.locale = function (locale, nameSpace) {
      // 将指定命名空间下的语言包设置为传入的locale
      $t[nameSpace] = locale || {};
    };
    // 将翻译函数挂载到全局对象上，如果已经存在则使用已有的
    _global.$t = _global.$t || $t;
    // 将简单翻译函数挂载到全局对象上
    _global.$$t = $$t;
    // 定义从JSON文件中获取指定键的语言对象的方法（合并模式）
    _global._getJSONKey = function (key, insertJSONObj = undefined) {
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
    };
    // 定义语言映射对象
    const langMap = {
        'en': (_global && _global.lang && _global.lang.en) ? _global.lang.en : _global._getJSONKey('en', langJSON),
'zhcn': (_global && _global.lang && _global.lang.zhcn) ? _global.lang.zhcn : _global._getJSONKey('zh-cn', langJSON)
    };
    _global.langMap = langMap;
    // 存储语言是否存在
    // 判断 _global.localStorage.getItem 是否为函数
    const isFunction = (fn) => {
        return typeof fn === 'function';
    };
    
    const withStorageLang = isFunction && _global && _global.localStorage && 
    isFunction(_global.localStorage.getItem) && _global.localStorage.getItem('lang');
    const withStorageCommonLang = isFunction && _global && _global.localStorage && 
    isFunction(_global.localStorage.getItem) && _global.localStorage.getItem('');
    // 从本地存储中获取通用语言，如果不存在则使用空字符串
    const commonLang = withStorageCommonLang ? _global.localStorage.getItem('') : '';
    // 从本地存储中获取当前语言，如果不存在则使用源语言
    const baseLang = withStorageLang ? _global.localStorage.getItem('lang') : 'zhcn';
    const lang = commonLang ? commonLang : baseLang;
    // 根据当前语言设置翻译函数的语言包
    _global.$t.locale(_global.langMap[lang], 'lang');
    _global.$changeLang = (lang) => {
        _global.$t.locale(_global.langMap[lang], 'lang');
    };
    })();
  