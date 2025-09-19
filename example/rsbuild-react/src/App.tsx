import { useState } from 'react';
import './App.css';

// 扩展 Window 类型定义
declare global {
  interface Window {
    $changeLang?: (lang: string) => void;
  }
}

const App = () => {
  const [count, setCount] = useState(0);
  const [currentLang, setCurrentLang] = useState('zh-cn');

  // 语言切换函数
  const changeLang = (lang: string) => {
    if (window.$changeLang) {
      window.$changeLang(lang);
      setCurrentLang(lang);
    } else {
      // 如果没有无刷新切换，使用传统方式
      window.localStorage.setItem('lang', lang);
      window.location.reload();
    }
  };

  // 测试各种翻译场景
  const testMessages = {
    greeting: '你好，世界！',
    welcome: '欢迎使用 Rsbuild 自动翻译插件',
    description: '这是一个功能强大的前端国际化解决方案',
    features: [
      '支持多种框架',
      '自动检测文本',
      '多种翻译服务',
      '无需修改源码'
    ]
  };

  return (
    <div className="content">
      {/* 标题区域 */}
      <header className="header">
        <h1>Rsbuild 自动翻译插件测试</h1>
        <p className="subtitle">测试各种翻译场景和功能</p>
      </header>

      {/* 语言切换区域 */}
      <div className="language-switcher">
        <h2>语言切换</h2>
        <div className="lang-buttons">
          <button 
            onClick={() => changeLang('zh-cn')}
            className={currentLang === 'zh-cn' ? 'active' : ''}
          >
            中文
          </button>
          <button 
            onClick={() => changeLang('en')}
            className={currentLang === 'en' ? 'active' : ''}
          >
            English
          </button>
        </div>
        <p>当前语言: {currentLang}</p>
      </div>

      {/* 基础文本测试 */}
      <section className="test-section">
        <h2>基础文本翻译测试</h2>
        <div className="test-content">
          <p>{testMessages.greeting}</p>
          <p>{testMessages.welcome}</p>
          <p>{testMessages.description}</p>
        </div>
      </section>

      {/* JSX 属性测试 */}
      <section className="test-section">
        <h2>JSX 属性翻译测试</h2>
        <div className="test-content">
          <input 
            type="text" 
            placeholder="请输入您的姓名" 
            title="姓名输入框"
          />
          <button title="点击提交">提交</button>
        </div>
      </section>

      {/* 列表渲染测试 */}
      <section className="test-section">
        <h2>列表渲染翻译测试</h2>
        <div className="test-content">
          <h3>插件特性：</h3>
          <ul>
            {testMessages.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 模板字符串测试 */}
      <section className="test-section">
        <h2>模板字符串翻译测试</h2>
        <div className="test-content">
          <p>{`当前计数器值为: ${count}`}</p>
          <p>{`这是一个包含变量的句子，变量值: ${count > 5 ? '大于5' : '小于等于5'}`}</p>
          <button onClick={() => setCount(count + 1)}>
            点击增加计数 (+1)
          </button>
          <button onClick={() => setCount(0)}>
            重置计数器
          </button>
        </div>
      </section>

      {/* 条件渲染测试 */}
      <section className="test-section">
        <h2>条件渲染翻译测试</h2>
        <div className="test-content">
          {count > 0 ? (
            <div>
              <p>计数器已启动！</p>
              <p>当前值: {count}</p>
            </div>
          ) : (
            <p>计数器尚未启动，请点击按钮开始</p>
          )}
        </div>
      </section>

      {/* 复杂嵌套测试 */}
      <section className="test-section">
        <h2>复杂嵌套翻译测试</h2>
        <div className="test-content">
          <div className="card">
            <h3>功能介绍</h3>
            <p>
              这个插件可以自动识别代码中的中文文本，
              并将其替换为翻译函数调用。
              支持 React、Vue 等主流框架。
            </p>
            <div className="actions">
              <button className="primary">开始使用</button>
              <button className="secondary">了解更多</button>
            </div>
          </div>
        </div>
      </section>

      {/* 状态信息 */}
      <footer className="footer">
        <p>插件状态: 正在运行</p>
        <p>翻译服务: EmptyTranslator (仅扫描模式)</p>
        <p>构建工具: Rsbuild + Rspack</p>
      </footer>
    </div>
  );
};

export default App;
