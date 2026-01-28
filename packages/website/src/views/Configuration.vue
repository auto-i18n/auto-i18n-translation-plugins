<template>
  <div class="configuration-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="configuration__header">
        <h1 class="configuration__title">配置指南</h1>
        <p class="configuration__subtitle">掌握30+配置参数，实现精细化的国际化控制</p>
      </div>

      <!-- 全部配置展示 -->
      <section class="all-configs-overview">
        <h2 class="overview-title">📋 全部配置参数</h2>
        <div class="config-summary">
          <div class="config-summary-grid">
            <div 
              v-for="config in allConfigs" 
              :key="config.name"
              class="config-summary-item"
              @click="scrollToConfig(config.name)"
            >
              <div class="config-summary-name">
                <span v-html="highlightText(config.name)"></span>
              </div>
              <div class="config-summary-type">{{ config.type }}</div>
              <div class="config-summary-default">{{ formatValue(config.default) }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 配置搜索 -->
      <div class="configuration__search">
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索配置项（支持模糊搜索）..."
            class="search-input"
          >
          <div class="search-filters">
            <button
              v-for="category in categories"
              :key="category.key"
              :class="['filter-btn', { 'filter-btn--active': activeCategory === category.key }]"
              @click="activeCategory = activeCategory === category.key ? '' : category.key"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 配置参数列表 -->
      <div class="configuration__content">
        <div class="config-grid">
          <div
            v-for="config in filteredConfigs"
            :key="config.name"
            :id="`config-${config.name}`"
            class="config-card"
            :class="{ 'config-card--highlighted': config.highlighted }"
          >
            <header class="config-card__header">
              <div class="config-card__title-group">
                <h3 class="config-card__title" v-html="highlightText(config.name)"></h3>
                <span class="config-card__category">{{ getCategoryName(config.category) }}</span>
              </div>
              <div class="config-card__type">
                <span class="type-badge" :class="`type-badge--${config.type.split('|')[0].trim()}`">
                  {{ config.type }}
                </span>
              </div>
            </header>

            <p class="config-card__description" v-html="highlightText(config.description)"></p>

        <div class="config-card__details">
          <div class="config-detail">
            <span class="config-detail__label">默认值:</span>
            <code class="config-detail__value">{{ formatValue(config.default) }}</code>
          </div>

          <div v-if="config.options" class="config-detail">
            <span class="config-detail__label">可选值:</span>
            <div class="config-options">
              <span
                v-for="option in config.options"
                :key="option"
                class="config-option"
              >{{ option }}</span>
            </div>
          </div>

          <div v-if="config.example" class="config-detail">
            <span class="config-detail__label">示例:</span>
            <div class="config-example">
              <pre><code>{{ config.example }}</code></pre>
              <button
                class="copy-btn"
                @click="copyToClipboard(config.example)"
                :class="{ 'copy-btn--copied': copiedConfig === config.name }"
              >
                {{ copiedConfig === config.name ? '已复制!' : '复制' }}
              </button>
            </div>
          </div>
          <div v-if="config.notes && config.notes.length > 0" class="config-detail">
            <span class="config-detail__label">注意事项:</span>
            <ul class="config-notes">
              <li v-for="note in config.notes" :key="note">{{ note }}</li>
            </ul>
          </div>
        </div>

        <div v-if="config.related && config.related.length > 0" class="config-card__related">
          <span class="related-label">相关配置:</span>
          <div class="related-configs">
            <button
              v-for="relatedKey in config.related"
              :key="relatedKey"
              class="related-config-btn"
              @click="highlightConfig(relatedKey)"
            >
              {{ relatedKey }}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- 配置生成器 -->
      <section class="config-generator">
        <h2 class="config-generator__title">配置生成器</h2>
        <p class="config-generator__description">
          选择您的配置选项，自动生成完整的配置代码
        </p>

        <div class="generator-form">
          <div class="form-section">
            <h3>基础配置</h3>
            <div class="form-grid">
              <div class="form-field">
                <label>工作模式</label>
                <select v-model="generatorConfig.mode">
                  <option value="full-auto">全自动模式</option>
                  <option value="semi-auto">半自动模式</option>
                </select>
              </div>
              
              <div class="form-field">
                <label>翻译器</label>
                <select v-model="generatorConfig.translator">
                  <option value="youdao">有道翻译</option>
                  <option value="google">谷歌翻译</option>
                  <option value="baidu">百度翻译</option>
                  <option value="volcengine">火山AI</option>
                </select>
              </div>

              <div class="form-field">
                <label>源语言</label>
                <select v-model="generatorConfig.sourceLanguage">
                  <option value="zh-cn">中文</option>
                  <option value="en">英文</option>
                  <option value="ja">日文</option>
                  <option value="ko">韩文</option>
                </select>
              </div>

              <div class="form-field form-field--full">
                <label>目标语言 (多选)</label>
                <div class="checkbox-group">
                  <label v-for="lang in availableLanguages" :key="lang.code" class="checkbox-label">
                    <input
                      type="checkbox"
                      :value="lang.code"
                      v-model="generatorConfig.targetLanguages"
                    >
                    <span>{{ lang.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>高级配置</h3>
            <div class="form-grid">
              <div class="form-field">
                <label>输出目录</label>
                <input
                  type="text"
                  v-model="generatorConfig.outputDir"
                  placeholder="./locales"
                >
              </div>

              <div class="form-field">
                <label>源码目录</label>
                <input
                  type="text"
                  v-model="generatorConfig.srcDir"
                  placeholder="./src"
                >
              </div>

              <div class="form-field form-field--full">
                <label>排除文件</label>
                <input
                  type="text"
                  v-model="excludeInput"
                  @keyup.enter="addExclude"
                  placeholder="输入要排除的文件或目录，按回车添加"
                >
                <div class="tag-list">
                  <span
                    v-for="(exclude, index) in generatorConfig.exclude"
                    :key="index"
                    class="tag"
                  >
                    {{ exclude }}
                    <button @click="removeExclude(index)" class="tag-remove">×</button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="generated-config">
          <div class="generated-config__header">
            <h3>生成的配置</h3>
            <button
              class="copy-btn"
              @click="copyToClipboard(generatedConfigCode)"
              :class="{ 'copy-btn--copied': copiedConfig === 'generated' }"
            >
              {{ copiedConfig === 'generated' ? '已复制!' : '复制配置' }}
            </button>
          </div>
          <div class="generated-config__code">
            <pre><code>{{ generatedConfigCode }}</code></pre>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { configCategories, configOptions } from '@/data/configData.js'

export default {
  name: 'Configuration',
  data() {
    return {
      searchQuery: '',
      activeCategory: '',
      copiedConfig: null,
      excludeInput: '',
      categories: configCategories.map(cat => ({ key: cat.id, name: cat.title })),
      generatorConfig: {
        mode: 'full-auto',
        translator: 'youdao',
        sourceLanguage: 'zh-cn',
        targetLanguages: ['en', 'ja', 'ko'],
        outputDir: './locales',
        srcDir: './src',
        exclude: ['node_modules', 'dist', '*.test.js']
      },
      availableLanguages: [
        { code: 'en', name: '英语' },
        { code: 'ja', name: '日语' },
        { code: 'ko', name: '韩语' },
        { code: 'fr', name: '法语' },
        { code: 'de', name: '德语' },
        { code: 'es', name: '西班牙语' },
        { code: 'it', name: '意大利语' },
        { code: 'pt', name: '葡萄牙语' },
        { code: 'ru', name: '俄语' },
        { code: 'ar', name: '阿拉伯语' }
      ]
    }
  },
  computed: {
    allConfigs() {
      return configOptions
    },
    filteredConfigs() {
      let configs = configOptions

      if (this.searchQuery) {
        configs = configs.filter(config =>
          config.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          config.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      if (this.activeCategory) {
        configs = configs.filter(config => config.category === this.activeCategory)
      }

      return configs
    },
    generatedConfigCode() {
      const config = {
        mode: this.generatorConfig.mode,
        translator: this.generatorConfig.translator,
        sourceLanguage: this.generatorConfig.sourceLanguage,
        targetLanguages: this.generatorConfig.targetLanguages,
        outputDir: this.generatorConfig.outputDir,
        srcDir: this.generatorConfig.srcDir,
        exclude: this.generatorConfig.exclude
      }

      if (this.generatorConfig.translator === 'youdao') {
        config.youdaoConfig = {
          appKey: '你的有道应用ID',
          appSecret: '你的有道应用密钥'
        }
      } else if (this.generatorConfig.translator === 'google') {
        config.googleConfig = {
          apiKey: '你的Google翻译API密钥'
        }
      } else if (this.generatorConfig.translator === 'baidu') {
        config.baiduConfig = {
          appId: '你的百度翻译应用ID',
          appKey: '你的百度翻译密钥'
        }
      } else if (this.generatorConfig.translator === 'volcengine') {
        config.volcengineConfig = {
          accessKeyId: '你的火山引擎Access Key ID',
          accessKeySecret: '你的火山引擎Access Key Secret'
        }
      }

      return `// vite.config.js 或 webpack.config.js
import { autoI18nTranslation } from 'auto-i18n-translation-plugins'

export default {
  plugins: [
    autoI18nTranslation(${JSON.stringify(config, null, 2)})
  ]
}`
    }
  },
  methods: {
    getCategoryName(key) {
      const category = this.categories.find(cat => cat.key === key)
      return category ? category.name : key
    },
    formatValue(value) {
      if (value === null) return 'null'
      if (value === undefined) return 'undefined'
      if (typeof value === 'string') return `"${value}"`
      if (Array.isArray(value)) return JSON.stringify(value)
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value)
    },
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        this.copiedConfig = text === this.generatedConfigCode ? 'generated' : 'example'
        setTimeout(() => {
          this.copiedConfig = null
        }, 2000)
      } catch (err) {
        console.error('复制失败:', err)
      }
    },
    highlightConfig(configKey) {
      const targetConfig = this.filteredConfigs.find(config => config.name === configKey)
      if (targetConfig) {
        targetConfig.highlighted = true
        setTimeout(() => {
          targetConfig.highlighted = false
        }, 2000)
        
        this.scrollToConfig(configKey)
      }
    },
    scrollToConfig(configName) {
      this.$nextTick(() => {
        const element = document.getElementById(`config-${configName}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.classList.add('config-card--highlighted')
          setTimeout(() => {
            element.classList.remove('config-card--highlighted')
          }, 2000)
        }
      })
    },
    highlightText(text) {
      if (!this.searchQuery || !text) return text
      
      const query = this.searchQuery.trim()
      if (!query) return text
      
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi')
      return text.replace(regex, '<mark class="search-highlight">$1</mark>')
    },
    escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },
    addExclude() {
      if (this.excludeInput.trim() && !this.generatorConfig.exclude.includes(this.excludeInput.trim())) {
        this.generatorConfig.exclude.push(this.excludeInput.trim())
        this.excludeInput = ''
      }
    },
    removeExclude(index) {
      this.generatorConfig.exclude.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.configuration-page {
  padding: var(--spacing-md) 0;
  background-color: var(--color-bg-primary);
  min-height: 100vh;
}

.configuration__header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.configuration__title {
  font-size: var(--text-5xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.configuration__subtitle {
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  max-width: 800px;
  margin: 0 auto;
}

/* 搜索栏 */
.configuration__search {
  margin-bottom: var(--spacing-lg);
}

.search-bar {
  max-width: 800px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  margin-bottom: var(--spacing-lg);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-filters {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* 配置卡片 */
.config-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.config-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  transition: all var(--transition-fast);
}

.config-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.config-card--highlighted {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.config-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.config-card__title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  margin-bottom: var(--spacing-xs);
}

.config-card__category {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.type-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
}

.type-badge--string {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.type-badge--boolean {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--color-info);
}

.type-badge--array {
  background-color: rgba(139, 92, 246, 0.1);
  color: var(--color-secondary);
}

.type-badge--object {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.type-badge--number {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.config-card__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.config-card__details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.config-detail__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  display: block;
  margin-bottom: var(--spacing-xs);
}

.config-detail__value {
  font-family: var(--font-mono);
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--color-primary);
}

.config-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.config-option {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
}

.config-example {
  position: relative;
}

.config-example pre {
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  overflow-x: auto;
  margin: 0;
}

.copy-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.copy-btn:hover {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.copy-btn--copied {
  background-color: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.config-notes {
  list-style: none;
  margin: 0;
}

.config-notes li {
  position: relative;
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.config-notes li::before {
  content: '⚠️';
  position: absolute;
  left: 0;
  top: 0;
}

.config-card__related {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

.related-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  display: block;
  margin-bottom: var(--spacing-sm);
}

.related-configs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.related-config-btn {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.related-config-btn:hover {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
}

/* 配置生成器 */
.config-generator {
  margin-top: var(--spacing-5xl);
  padding-top: var(--spacing-5xl);
  border-top: 2px solid var(--color-border-light);
}

.config-generator__title {
  font-size: var(--text-3xl);
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.config-generator__description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.generator-form {
  max-width: 1000px;
  margin: 0 auto var(--spacing-4xl);
}

.form-section {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-md);
}

.form-section h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.form-field input,
.form-field select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.form-field input:focus,
.form-field select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-sm);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--text-sm);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.tag {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}

.tag-remove {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--text-lg);
  cursor: pointer;
  line-height: 1;
  padding: 0;
  margin-left: var(--spacing-xs);
}

/* 生成的配置 */
.generated-config {
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
}

.generated-config__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.generated-config__header h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
}

.generated-config__code {
  position: relative;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.generated-config__code pre {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .search-filters {
    justify-content: flex-start;
  }
  
  .config-card__header {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
  
  .generated-config__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .config-summary-grid {
    grid-template-columns: 1fr;
  }
}

/* 全部配置展示 */
.all-configs-overview {
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.overview-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.config-summary {
  max-width: 100%;
  overflow-x: auto;
}

.config-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-sm);
}

.config-summary-item {
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.config-summary-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.config-summary-name {
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
  font-size: var(--text-base);
}

.config-summary-type {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-xs);
  font-family: var(--font-mono);
}

.config-summary-default {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  background-color: var(--color-bg-tertiary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  display: inline-block;
}

/* 搜索高亮 */
:deep(.search-highlight) {
  background-color: #fef08a;
  color: #854d0e;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}

</style>