<template>
  <div class="translators-page">
    <!-- Hero Section -->
    <div class="hero">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">🌐 翻译器对比</h1>
          <p class="hero__description">
            6种翻译器的全面对比，从免费的Google翻译到企业级的火山引擎AI，找到最适合你项目的翻译方案
          </p>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Quick Selection Guide -->
      <section class="selection-guide">
        <h2 class="section__title">🎯 快速选择指南</h2>
        <div class="scenarios-grid">
          <div 
            v-for="scenario in selectionGuide.scenarios"
            :key="scenario.title"
            class="scenario-card"
            @click="scrollToTranslator(scenario.recommendation)"
          >
            <div class="scenario__header">
              <h3 class="scenario__title">{{ scenario.title }}</h3>
              <div class="scenario__recommendation">
                推荐: {{ getTranslatorName(scenario.recommendation) }}
              </div>
            </div>
            <p class="scenario__description">{{ scenario.description }}</p>
            <div class="scenario__reasons">
              <span 
                v-for="reason in scenario.reasons"
                :key="reason"
                class="reason-tag"
              >
                {{ reason }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Comparison Cards (Better than table) -->
      <section class="comparison-section">
        <h2 class="section__title">📊 详细对比</h2>
        
        <!-- Filter and Sort -->
        <div class="table-controls">
          <div class="filter-group">
            <label class="filter-label">筛选:</label>
            <select v-model="statusFilter" class="filter-select">
              <option value="">全部</option>
              <option value="recommended">推荐</option>
              <option value="free">免费</option>
              <option value="stable">稳定</option>
              <option value="premium">高级</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">排序:</label>
            <select v-model="sortBy" class="filter-select">
              <option value="name">名称</option>
              <option value="stability">稳定性</option>
              <option value="quality">质量</option>
              <option value="speed">速度</option>
              <option value="cost">成本</option>
            </select>
          </div>
        </div>

        <!-- Comparison Cards Grid -->
        <div class="comparison-grid">
          <div 
            v-for="translator in filteredTranslators"
            :key="translator.id"
            :id="`translator-${translator.id}`"
            class="comparison-card"
          >
            <!-- Card Header -->
            <div class="comparison-card__header">
              <div class="translator-main">
                <div class="translator__logo">{{ translator.logo }}</div>
                <div class="translator-title">
                  <h3 class="translator__name">{{ translator.name }}</h3>
                  <div class="translator__pricing">{{ getPricingLabel(translator.pricing) }}</div>
                </div>
              </div>
              <span :class="['status-badge', `status--${translator.status}`]">
                {{ getStatusLabel(translator.status) }}
              </span>
            </div>

            <!-- Card Body - Metrics -->
            <div class="comparison-card__body">
              <div class="metrics-grid">
                <div class="metric-item">
                  <div class="metric-label">稳定性</div>
                  <div class="metric-value">
                    <div class="rating-stars">
                      <span v-for="i in 5" :key="i" :class="['star', { filled: i <= translator.features.stability }]">★</span>
                    </div>
                    <span class="metric-score">{{ translator.features.stability }}/5</span>
                  </div>
                </div>
                
                <div class="metric-item">
                  <div class="metric-label">质量</div>
                  <div class="metric-value">
                    <div class="rating-stars">
                      <span v-for="i in 5" :key="i" :class="['star', { filled: i <= translator.features.quality }]">★</span>
                    </div>
                    <span class="metric-score">{{ translator.features.quality }}/5</span>
                  </div>
                </div>
                
                <div class="metric-item">
                  <div class="metric-label">速度</div>
                  <div class="metric-value">
                    <div class="rating-stars">
                      <span v-for="i in 5" :key="i" :class="['star', { filled: i <= translator.features.speed }]">★</span>
                    </div>
                    <span class="metric-score">{{ translator.features.speed }}/5</span>
                  </div>
                </div>
                
                <div class="metric-item">
                  <div class="metric-label">成本</div>
                  <div class="metric-value">
                    <div class="rating-stars">
                      <span v-for="i in 5" :key="i" :class="['star', { filled: i <= translator.features.cost }]">★</span>
                    </div>
                    <span class="metric-score">{{ translator.features.cost }}/5</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="comparison-card__footer">
              <button 
                @click="showDetails(translator)"
                class="btn-details"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedTranslator" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal__header">
          <div class="modal__title-row">
            <span class="modal__logo">{{ selectedTranslator.logo }}</span>
            <h3 class="modal__title">{{ selectedTranslator.name }}</h3>
            <button @click="closeModal" class="modal__close">×</button>
          </div>
          <p class="modal__description">{{ selectedTranslator.description }}</p>
        </div>

        <div class="modal__content">
          <!-- Pros and Cons -->
          <div class="pros-cons">
            <div class="pros">
              <h4 class="pros-cons__title">✅ 优点</h4>
              <ul class="pros-cons__list">
                <li v-for="pro in selectedTranslator.pros" :key="pro">{{ pro }}</li>
              </ul>
            </div>
            <div class="cons">
              <h4 class="pros-cons__title">❌ 缺点</h4>
              <ul class="pros-cons__list">
                <li v-for="con in selectedTranslator.cons" :key="con">{{ con }}</li>
              </ul>
            </div>
          </div>

          <!-- Configuration -->
          <div class="configuration">
            <h4 class="configuration__title">⚙️ 配置指南</h4>
            
            <!-- Installation -->
            <div class="config-section">
              <h5 class="config-section__title">安装</h5>
              <div class="code-block">
                <code>{{ selectedTranslator.configuration.installation }}</code>
                <button 
                  @click="copyToClipboard(selectedTranslator.configuration.installation)"
                  class="copy-btn"
                  title="复制代码"
                >
                  📋
                </button>
              </div>
            </div>

            <!-- Setup -->
            <div class="config-section">
              <h5 class="config-section__title">配置</h5>
              <div class="code-block">
                <pre><code>{{ selectedTranslator.configuration.setup }}</code></pre>
                <button 
                  @click="copyToClipboard(selectedTranslator.configuration.setup)"
                  class="copy-btn"
                  title="复制代码"
                >
                  📋
                </button>
              </div>
            </div>

            <!-- API Application (if exists) -->
            <div v-if="selectedTranslator.configuration.apiApplication" class="config-section">
              <h5 class="config-section__title">API申请步骤</h5>
              <div class="api-application">
                <div class="api-url">
                  <strong>官方网站:</strong> 
                  <a :href="selectedTranslator.configuration.apiApplication.url" target="_blank" rel="noopener">
                    {{ selectedTranslator.configuration.apiApplication.url }}
                  </a>
                </div>
                <ol class="api-steps">
                  <li v-for="step in selectedTranslator.configuration.apiApplication.steps" :key="step">
                    {{ step }}
                  </li>
                </ol>
              </div>
            </div>

            <!-- Proxy Setup (for Google) -->
            <div v-if="selectedTranslator.configuration.proxySetup" class="config-section">
              <h5 class="config-section__title">代理配置</h5>
              <div class="proxy-setup">
                <p><strong>要求:</strong> {{ selectedTranslator.configuration.proxySetup.requirements }}</p>
                <div class="proxy-ports">
                  <strong>常用端口:</strong>
                  <span 
                    v-for="port in selectedTranslator.configuration.proxySetup.commonPorts"
                    :key="port"
                    class="port-tag"
                  >
                    {{ port }}
                  </span>
                </div>
                <div class="troubleshooting">
                  <strong>故障排除:</strong>
                  <ul>
                    <li v-for="tip in selectedTranslator.configuration.proxySetup.troubleshooting" :key="tip">
                      {{ tip }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Use Case -->
            <div class="config-section">
              <h5 class="config-section__title">适用场景</h5>
              <p class="use-case">{{ selectedTranslator.useCase }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { translatorComparison, selectionGuide } from '@/data/translatorData'

export default {
  name: 'Translators',
  data() {
    return {
      translatorComparison,
      selectionGuide,
      selectedTranslator: null,
      statusFilter: '',
      sortBy: 'name'
    }
  },
  computed: {
    filteredTranslators() {
      let filtered = this.translatorComparison

      if (this.statusFilter) {
        filtered = filtered.filter(t => t.status === this.statusFilter)
      }

      // Sort
      return filtered.sort((a, b) => {
        if (this.sortBy === 'name') {
          return a.name.localeCompare(b.name)
        } else {
          return b.features[this.sortBy] - a.features[this.sortBy]
        }
      })
    }
  },
  methods: {
    showDetails(translator) {
      this.selectedTranslator = translator
      document.body.style.overflow = 'hidden'
    },
    closeModal() {
      this.selectedTranslator = null
      document.body.style.overflow = ''
    },
    scrollToTranslator(id) {
      const element = document.getElementById(`translator-${id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.style.backgroundColor = 'var(--color-primary-50)'
        setTimeout(() => {
          element.style.backgroundColor = ''
        }, 2000)
      }
    },
    getTranslatorName(id) {
      const translator = this.translatorComparison.find(t => t.id === id)
      return translator ? translator.name : id
    },
    getPricingLabel(pricing) {
      const labels = {
        free: '免费',
        freemium: '免费/付费',
        paid: '付费',
        depends: '依具体需求'
      }
      return labels[pricing] || pricing
    },
    getStatusLabel(status) {
      const labels = {
        recommended: '推荐',
        free: '免费',
        stable: '稳定',
        premium: '高级',
        utility: '工具',
        advanced: '高级'
      }
      return labels[status] || status
    },
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        // 可以添加提示消息
      } catch (err) {
        console.error('复制失败:', err)
      }
    }
  }
}
</script>

<style scoped>
/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
  color: white;
  padding: var(--spacing-lg) 0;
  margin-bottom: var(--spacing-md);
}

.hero__title {
  font-size: var(--text-5xl);
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.hero__description {
  font-size: var(--text-xl);
  text-align: center;
  line-height: var(--line-height-relaxed);
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.95;
}

/* Sections */
.section__title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

/* Selection Guide */
.selection-guide {
  margin-bottom: var(--spacing-lg);
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-md);
}

.scenario-card {
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  background: var(--color-background);
  cursor: pointer;
  transition: all var(--transition-base);
}

.scenario-card:hover {
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.scenario__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.scenario__title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.scenario__recommendation {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  white-space: nowrap;
}

.scenario__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
}

.scenario__reasons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.reason-tag {
  background: var(--color-background-soft);
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--text-sm);
  border: 1px solid var(--color-border);
}

/* Table */
.comparison-table {
  margin-bottom: var(--spacing-lg);
}

.table-controls {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-label {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
}

.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
}

/* Comparison Grid (Card-based) */
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.comparison-card {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-background);
  overflow: hidden;
  transition: all var(--transition-base);
}

.comparison-card:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.comparison-card__header {
  padding: var(--spacing-md);
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.translator-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
}

.translator__logo {
  font-size: var(--text-xl);
  flex-shrink: 0;
}

.translator-title {
  flex: 1;
  min-width: 0;
}

.translator__name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: var(--text-base);
  margin-bottom: var(--spacing-xs);
}

.translator__pricing {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.status--recommended {
  background: var(--color-success-100);
  color: var(--color-success-700);
}

.status--free {
  background: var(--color-blue-100);
  color: var(--color-blue-700);
}

.status--stable {
  background: var(--color-purple-100);
  color: var(--color-purple-700);
}

.status--premium {
  background: var(--color-orange-100);
  color: var(--color-orange-700);
}

.status--utility {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
}

.status--advanced {
  background: var(--color-indigo-100);
  color: var(--color-indigo-700);
}

.comparison-card__body {
  padding: var(--spacing-md);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.metric-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.metric-value {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: var(--text-sm);
  color: var(--color-gray-300);
}

.star.filled {
  color: var(--color-warning);
}

.metric-score {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  font-weight: 500;
  margin-left: var(--spacing-xs);
}

.comparison-card__footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  background: var(--color-background-soft);
}

.btn-details {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-details:hover {
  background: var(--color-primary-600);
}

/* Old rating bars - removed */

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal {
  background: var(--color-background);
  border-radius: var(--border-radius-lg);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-2xl);
}

.modal__header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-soft);
}

.modal__title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.modal__logo {
  font-size: var(--text-3xl);
}

.modal__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  flex: 1;
  margin: 0;
}

.modal__close {
  background: none;
  border: none;
  font-size: var(--text-2xl);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-base);
}

.modal__close:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.modal__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.modal__content {
  padding: var(--spacing-md);
}

/* Pros and Cons */
.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
}

@media (max-width: 768px) {
  .pros-cons {
    grid-template-columns: 1fr;
  }
}

.pros-cons__title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.pros-cons__list {
  list-style: none;
  padding: 0;
}

.pros-cons__list li {
  padding: var(--spacing-sm) 0;
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
}

.pros-cons__list li:not(:last-child) {
  border-bottom: 1px solid var(--color-border-light);
}

/* Configuration */
.configuration__title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

.config-section {
  margin-bottom: var(--spacing-md);
}

.config-section__title {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.code-block {
  position: relative;
  background: var(--color-background-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--line-height-relaxed);
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  white-space: pre-wrap;
}

.copy-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all var(--transition-base);
}

.copy-btn:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-300);
}

.api-application {
  background: var(--color-background-soft);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.api-url {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

.api-url a {
  color: var(--color-primary-600);
  text-decoration: none;
}

.api-url a:hover {
  text-decoration: underline;
}

.api-steps {
  padding-left: var(--spacing-lg);
}

.api-steps li {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.proxy-setup {
  background: var(--color-background-soft);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.proxy-setup p {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

.proxy-ports {
  margin-bottom: var(--spacing-md);
}

.port-tag {
  display: inline-block;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  margin-right: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.troubleshooting ul {
  padding-left: var(--spacing-lg);
  margin: var(--spacing-sm) 0 0;
}

.troubleshooting li {
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
}

.use-case {
  background: var(--color-success-50);
  color: var(--color-success-700);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-success-200);
  line-height: var(--line-height-relaxed);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
  
  .comparison-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero__title {
    font-size: var(--text-xl);
  }
  
  .hero__description {
    font-size: var(--text-sm);
  }
  
  .table-controls {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .modal {
    margin: var(--spacing-md);
    max-height: calc(100vh - 2 * var(--spacing-md));
  }
  
  .modal__header,
  .modal__content {
    padding: var(--spacing-md);
  }
}
</style>