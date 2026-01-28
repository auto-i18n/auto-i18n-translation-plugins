<template>
  <section class="quickstart">
    <div class="container">
      <div class="quickstart__content">
        <div class="quickstart__text">
          <h2 class="quickstart__title">几分钟内快速开始</h2>
          <p class="quickstart__description">
            通过几个简单的步骤，将您的项目转换为支持多种语言。
          </p>
          
          <div class="quickstart__steps">
            <div 
              v-for="(step, index) in quickStartSteps" 
              :key="index"
              class="quickstart__step"
              :class="{ 'quickstart__step--active': activeStep === index }"
              @click="activeStep = index"
            >
              <div class="quickstart__step-number">{{ index + 1 }}</div>
              <div class="quickstart__step-content">
                <h3 class="quickstart__step-title">{{ step.title }}</h3>
                <p class="quickstart__step-description">{{ step.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="quickstart__actions">
            <router-link to="/principle" class="btn btn-primary btn-lg">
              查看完整文档
            </router-link>
            <router-link to="/configuration" class="btn btn-secondary btn-lg">
              配置指南
            </router-link>
          </div>
        </div>
        
        <div class="quickstart__demo">
          <div class="quickstart__demo-container">
            <div class="quickstart__demo-header">
              <div class="quickstart__demo-tabs">
                <button 
                  v-for="(tab, index) in demoTabs" 
                  :key="index"
                  class="quickstart__demo-tab"
                  :class="{ 'quickstart__demo-tab--active': activeDemo === index }"
                  @click="activeDemo = index"
                >
                  {{ tab.name }}
                </button>
              </div>
            </div>
            
            <div class="quickstart__demo-content">
              <div class="quickstart__code-block">
                <div class="quickstart__code-header">
                  <span class="quickstart__code-lang">{{ demoTabs[activeDemo].lang }}</span>
                  <button 
                    class="quickstart__copy-btn"
                    @click="copyCode(demoTabs[activeDemo].code)"
                    :class="{ 'quickstart__copy-btn--copied': copiedDemo === activeDemo }"
                  >
                    <svg v-if="copiedDemo !== activeDemo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="m5 15-4-4 4-4"></path>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    {{ copiedDemo === activeDemo ? '已复制!' : '复制' }}
                  </button>
                </div>
                <pre class="quickstart__code"><code>{{ demoTabs[activeDemo].code }}</code></pre>
              </div>
            </div>
          </div>
          
          <div class="quickstart__features-mini">
            <div class="quickstart__feature-mini">
              <span class="quickstart__feature-icon">⚡</span>
              <span class="quickstart__feature-text">零配置</span>
            </div>
            <div class="quickstart__feature-mini">
              <span class="quickstart__feature-icon">📦</span>
              <span class="quickstart__feature-text">支持Vite</span>
            </div>
            <div class="quickstart__feature-mini">
              <span class="quickstart__feature-icon">🔧</span>
              <span class="quickstart__feature-text">可自定义</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'QuickStart',
  data() {
    return {
      activeStep: 0,
      activeDemo: 0,
      copiedDemo: null,
      quickStartSteps: [
        {
          title: '安装包',
          description: '使用npm或yarn将插件添加到您的项目中'
        },
        {
          title: '配置插件',
          description: '将插件添加到您的构建工具配置中'
        },
        {
          title: '运行构建',
          description: '构建您的项目，见证奇迹的发生'
        }
      ],
      demoTabs: [
        {
          name: '安装',
          lang: 'bash',
          code: `# 通过npm安装
npm install auto-i18n-translation-plugins --save-dev

# 或通过yarn安装
yarn add auto-i18n-translation-plugins --dev

# 或通过pnpm安装
pnpm add auto-i18n-translation-plugins --save-dev`
        },
        {
          name: 'Vite配置',
          lang: 'javascript',
          code: `// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { autoI18nTranslation } from 'auto-i18n-translation-plugins'

export default defineConfig({
  plugins: [
    vue(),
    autoI18nTranslation({
      mode: 'full-auto',
      translator: 'youdao',
      youdaoConfig: {
        appKey: '你的应用密钥',
        appSecret: '你的应用秘钥'
      },
      targetLanguages: ['en', 'ja', 'ko'],
      exclude: ['node_modules', 'dist']
    })
  ]
})`
        },
        {
          name: 'Webpack配置',
          lang: 'javascript',
          code: `// webpack.config.js
const { autoI18nTranslationWebpack } = require('auto-i18n-translation-plugins')

module.exports = {
  // ... 其他配置
  plugins: [
    new autoI18nTranslationWebpack({
      mode: 'full-auto',
      translator: 'google',
      googleConfig: {
        apiKey: '你的API密钥'
      },
      targetLanguages: ['en', 'es', 'fr'],
      srcDir: './src',
      outputDir: './locales'
    })
  ]
}`
        },
        {
          name: 'package.json',
          lang: 'json',
          code: `{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "i18n:extract": "auto-i18n extract",
    "i18n:translate": "auto-i18n translate",
    "i18n:build": "auto-i18n build"
  },
  "devDependencies": {
    "auto-i18n-translation-plugins": "^1.1.16",
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0"
  }
}`
        }
      ]
    }
  },
  methods: {
    async copyCode(code) {
      try {
        await navigator.clipboard.writeText(code)
        this.copiedDemo = this.activeDemo
        setTimeout(() => {
          this.copiedDemo = null
        }, 2000)
      } catch (err) {
        console.error('复制代码失败:', err)
      }
    }
  }
}
</script>

<style scoped>
.quickstart {
  padding: var(--spacing-5xl) 0;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
}

.quickstart__content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-5xl);
  align-items: start;
}

@media (min-width: 1024px) {
  .quickstart__content {
    grid-template-columns: 1fr 1fr;
  }
}

.quickstart__title {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.quickstart__description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-xl);
}

.quickstart__steps {
  margin-bottom: var(--spacing-xl);
}

.quickstart__step {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quickstart__step:last-child {
  margin-bottom: 0;
}

.quickstart__step:hover,
.quickstart__step--active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
  transform: translateX(4px);
}

.quickstart__step-number {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: 50%;
  font-weight: 600;
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.quickstart__step--active .quickstart__step-number {
  background-color: var(--color-primary-hover);
}

.quickstart__step-content {
  flex: 1;
}

.quickstart__step-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.quickstart__step-description {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--line-height-relaxed);
}

.quickstart__actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.quickstart__demo-container {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.quickstart__demo-header {
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-light);
}

.quickstart__demo-tabs {
  display: flex;
  overflow-x: auto;
}

.quickstart__demo-tab {
  flex-shrink: 0;
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  border-bottom: 2px solid transparent;
}

.quickstart__demo-tab:hover {
  color: var(--color-text-primary);
  background-color: var(--color-bg-tertiary);
}

.quickstart__demo-tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  background-color: var(--color-bg-primary);
}

.quickstart__demo-content {
  padding: var(--spacing-lg);
}

.quickstart__code-block {
  position: relative;
}

.quickstart__code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.quickstart__code-lang {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quickstart__copy-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quickstart__copy-btn:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.quickstart__copy-btn--copied {
  background-color: var(--color-success);
  color: var(--color-text-inverse);
  border-color: var(--color-success);
}

.quickstart__code {
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--color-text-primary);
}

.quickstart__features-mini {
  display: flex;
  justify-content: space-around;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

.quickstart__feature-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.quickstart__feature-icon {
  font-size: var(--text-lg);
}

.quickstart__feature-text {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-secondary);
}

@media (max-width: 1023px) {
  .quickstart__demo-container {
    max-width: 100%;
  }
  
  .quickstart__code {
    font-size: var(--text-xs);
  }
}
</style>