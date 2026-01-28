<template>
  <div class="faq-page">
    <!-- Hero Section -->
    <div class="hero">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">❓ 常见问题</h1>
          <p class="hero__description">
            解答使用过程中的常见疑问，提供详细的故障排除指南和最佳实践建议
          </p>
          
          <!-- Search Box -->
          <div class="hero__search">
            <div class="search-box">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索问题关键词..."
                class="search-input"
              >
              <button class="search-btn">🔍</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Quick Stats -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-number">{{ totalQuestions }}</span>
          <span class="stat-label">个问题</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ filteredQuestions.length }}</span>
          <span class="stat-label">个匹配结果</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ categories.length }}</span>
          <span class="stat-label">个分类</span>
        </div>
      </div>

      <!-- Category Filter -->
      <section class="category-filter">
        <div class="filter-tabs">
          <button
            @click="activeCategory = ''"
            :class="['filter-tab', { active: activeCategory === '' }]"
          >
            <span class="tab-icon">🌐</span>
            <span class="tab-text">全部</span>
            <span class="tab-count">({{ totalQuestions }})</span>
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="activeCategory = category.id"
            :class="['filter-tab', { active: activeCategory === category.id }]"
          >
            <span class="tab-icon">{{ category.icon }}</span>
            <span class="tab-text">{{ category.title }}</span>
            <span class="tab-count">({{ getCategoryCount(category.id) }})</span>
          </button>
        </div>
      </section>

      <!-- FAQ List -->
      <section class="faq-list">
        <div v-if="filteredQuestions.length === 0" class="no-results">
          <div class="no-results-icon">🤷‍♀️</div>
          <h3 class="no-results-title">没有找到相关问题</h3>
          <p class="no-results-text">
            尝试使用不同的关键词搜索，或者浏览其他分类
          </p>
        </div>

        <div v-else class="questions-list">
          <div
            v-for="question in filteredQuestions"
            :key="question.id"
            class="question-item"
          >
            <div 
              class="question-header"
              @click="toggleQuestion(question.id)"
              :class="{ active: expandedQuestions.includes(question.id) }"
            >
              <div class="question-meta">
                <span :class="['category-badge', `category--${question.category}`]">
                  {{ getCategoryName(question.category) }}
                </span>
                <span v-if="question.tags" class="question-tags">
                  <span
                    v-for="tag in question.tags"
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </span>
              </div>
              
              <h3 class="question-title">{{ question.question }}</h3>
              
              <div class="question-indicators">
                <span v-if="question.priority === 'high'" class="priority-indicator">
                  🔥 热门
                </span>
                <span class="expand-indicator">
                  {{ expandedQuestions.includes(question.id) ? '−' : '+' }}
                </span>
              </div>
            </div>

            <div 
              v-if="expandedQuestions.includes(question.id)"
              class="question-content"
            >
              <div class="answer" v-html="question.answer"></div>
              
              <div v-if="question.code" class="code-example">
                <h4 class="code-title">代码示例</h4>
                <div class="code-block">
                  <pre><code>{{ question.code }}</code></pre>
                  <button 
                    @click="copyToClipboard(question.code)"
                    class="copy-btn"
                    title="复制代码"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div v-if="question.relatedQuestions" class="related-questions">
                <h4 class="related-title">相关问题</h4>
                <div class="related-list">
                  <button
                    v-for="relatedId in question.relatedQuestions"
                    :key="relatedId"
                    @click="scrollToQuestion(relatedId)"
                    class="related-link"
                  >
                    {{ getQuestionTitle(relatedId) }}
                  </button>
                </div>
              </div>

              <div class="question-actions">
                <button 
                  @click="markHelpful(question.id)"
                  :class="['action-btn', { active: helpfulQuestions.includes(question.id) }]"
                >
                  👍 有用 ({{ question.helpful || 0 }})
                </button>
                <button class="action-btn">
                  🔗 分享
                </button>
                <button 
                  @click="reportIssue(question.id)"
                  class="action-btn"
                >
                  🐛 报告问题
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Still Need Help -->
      <section class="need-help">
        <div class="help-card">
          <div class="help-content">
            <div class="help-icon">💬</div>
            <div class="help-text">
              <h3 class="help-title">没有找到答案？</h3>
              <p class="help-description">
                如果以上问题没有解决您的疑问，欢迎通过以下方式获取帮助
              </p>
            </div>
          </div>
          
          <div class="help-actions">
            <a href="https://github.com/your-repo/issues" class="help-btn primary">
              <span class="btn-icon">🐛</span>
              <span class="btn-text">提交 Issue</span>
            </a>
            <a href="https://github.com/your-repo/discussions" class="help-btn secondary">
              <span class="btn-icon">💬</span>
              <span class="btn-text">社区讨论</span>
            </a>
            <a href="mailto:support@example.com" class="help-btn secondary">
              <span class="btn-icon">📧</span>
              <span class="btn-text">邮件咨询</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Popular Questions -->
      <section class="popular-questions">
        <h2 class="section__title">🔥 热门问题</h2>
        <div class="popular-grid">
          <div
            v-for="question in popularQuestions"
            :key="question.id"
            class="popular-item"
            @click="scrollToQuestion(question.id)"
          >
            <div class="popular-header">
              <span :class="['category-badge', `category--${question.category}`]">
                {{ getCategoryName(question.category) }}
              </span>
              <span class="view-count">{{ question.views || 0 }} 次查看</span>
            </div>
            <h4 class="popular-title">{{ question.question }}</h4>
            <p class="popular-summary">{{ getQuestionSummary(question.answer) }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import faqData from '@/data/faqData'

export default {
  name: 'FAQ',
  data() {
    return {
      faqData,
      searchQuery: '',
      activeCategory: '',
      expandedQuestions: [],
      helpfulQuestions: JSON.parse(localStorage.getItem('helpful-questions') || '[]')
    }
  },
  computed: {
    categories() {
      return this.faqData?.faqCategories || []
    },
    totalQuestions() {
      const questions = this.faqData?.faqData || this.faqData?.questions || []
      return questions.length
    },
    filteredQuestions() {
      let questions = this.faqData?.faqData || this.faqData?.questions || []
      
      if (!questions || !Array.isArray(questions)) {
        return []
      }

      // Category filter
      if (this.activeCategory) {
        questions = questions.filter(q => q.category === this.activeCategory)
      }

      // Search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        questions = questions.filter(q => 
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query) ||
          q.tags?.some(tag => tag.toLowerCase().includes(query))
        )
      }

      return questions
    },
    popularQuestions() {
      const questions = this.faqData?.faqData || this.faqData?.questions || []
      if (!questions || !Array.isArray(questions)) {
        return []
      }
      return questions
        .filter(q => q.importance === 'high')
        .slice(0, 6)
    }
  },
  methods: {
    getCategoryCount(categoryId) {
      const questions = this.faqData?.faqData || this.faqData?.questions || []
      if (!questions || !Array.isArray(questions)) return 0
      return questions.filter(q => q.category === categoryId).length
    },
    getCategoryName(categoryId) {
      const categories = this.faqData?.faqCategories || []
      if (!categories || !Array.isArray(categories)) return categoryId
      const category = categories.find(c => c.id === categoryId)
      return category ? category.title : categoryId
    },
    toggleQuestion(questionId) {
      const index = this.expandedQuestions.indexOf(questionId)
      if (index > -1) {
        this.expandedQuestions.splice(index, 1)
      } else {
        this.expandedQuestions.push(questionId)
      }
    },
    scrollToQuestion(questionId) {
      // First expand the question if not already expanded
      if (!this.expandedQuestions.includes(questionId)) {
        this.expandedQuestions.push(questionId)
      }
      
      // Wait for DOM update, then scroll
      this.$nextTick(() => {
        const element = document.querySelector(`[data-question-id="${questionId}"]`)
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest' 
          })
          
          // Highlight the question briefly
          element.style.backgroundColor = 'var(--color-primary-50)'
          setTimeout(() => {
            element.style.backgroundColor = ''
          }, 2000)
        }
      })
    },
    getQuestionTitle(questionId) {
      const questions = this.faqData?.faqData || this.faqData?.questions || []
      if (!questions || !Array.isArray(questions)) return ''
      const question = questions.find(q => q.id === questionId)
      return question ? question.question : ''
    },
    getQuestionSummary(answer) {
      // Strip HTML and get first 100 characters
      const text = answer.replace(/<[^>]*>/g, '')
      return text.length > 100 ? text.substring(0, 100) + '...' : text
    },
    markHelpful(questionId) {
      if (!this.helpfulQuestions.includes(questionId)) {
        this.helpfulQuestions.push(questionId)
        localStorage.setItem('helpful-questions', JSON.stringify(this.helpfulQuestions))
        
        // Update the question's helpful count
        const questions = this.faqData?.faqData || this.faqData?.questions || []
        if (!questions || !Array.isArray(questions)) return
        const question = questions.find(q => q.id === questionId)
        if (question) {
          question.helpful = (question.helpful || 0) + 1
        }
      }
    },
    reportIssue(questionId) {
      const questions = this.faqData?.faqData || this.faqData?.questions || []
      if (!questions || !Array.isArray(questions)) return
      const question = questions.find(q => q.id === questionId)
      const subject = encodeURIComponent(`FAQ问题反馈: ${question?.question}`)
      const body = encodeURIComponent(`关于FAQ问题的反馈:\n\n问题ID: ${questionId}\n问题内容: ${question?.question}\n\n请描述您遇到的问题:\n`)
      
      window.open(`https://github.com/your-repo/issues/new?title=${subject}&body=${body}`)
    },
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        // 可以添加提示消息
      } catch (err) {
        console.error('复制失败:', err)
      }
    }
  },
  mounted() {
    // Check URL hash to open specific question
    if (window.location.hash) {
      const questionId = window.location.hash.substring(1)
      if (questionId) {
        setTimeout(() => {
          this.scrollToQuestion(questionId)
        }, 500)
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

.hero__content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero__title {
  font-size: var(--text-5xl);
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
}

.hero__description {
  font-size: var(--text-xl);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
  opacity: 0.95;
}

.hero__search {
  max-width: 500px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  padding-right: 60px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-lg);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: var(--text-lg);
  backdrop-filter: blur(10px);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
}

.search-btn {
  position: absolute;
  right: var(--spacing-md);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  color: white;
  cursor: pointer;
  font-size: var(--text-lg);
  transition: all var(--transition-base);
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Stats Bar */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-lg) 0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-primary-600);
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

/* Category Filter */
.category-filter {
  margin-bottom: var(--spacing-md);
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-background);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
  font-weight: 500;
}

.filter-tab:hover {
  border-color: var(--color-primary-300);
  color: var(--color-text-primary);
}

.filter-tab.active {
  border-color: var(--color-primary-500);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.tab-icon {
  font-size: var(--text-lg);
}

.tab-count {
  background: var(--color-background-muted);
  color: var(--color-text-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--text-xs);
}

.filter-tab.active .tab-count {
  background: var(--color-primary-100);
  color: var(--color-primary-600);
}

/* FAQ List */
.faq-list {
  margin-bottom: var(--spacing-lg);
}

.no-results {
  text-align: center;
  padding: var(--spacing-4xl) var(--spacing-xl);
  background: var(--color-background-soft);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border);
}

.no-results-icon {
  font-size: var(--text-6xl);
  margin-bottom: var(--spacing-lg);
}

.no-results-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.no-results-text {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

/* Question Items */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.question-item {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-background);
  overflow: hidden;
  transition: all var(--transition-base);
}

.question-item:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-md);
}

.question-header {
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.question-header:hover {
  background: var(--color-background-soft);
}

.question-header.active {
  background: var(--color-primary-25);
  border-bottom: 1px solid var(--color-border);
}

.question-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.category-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
}

.category--installation { background: var(--color-blue-100); color: var(--color-blue-700); }
.category--configuration { background: var(--color-purple-100); color: var(--color-purple-700); }
.category--usage { background: var(--color-green-100); color: var(--color-green-700); }
.category--troubleshooting { background: var(--color-red-100); color: var(--color-red-700); }
.category--performance { background: var(--color-orange-100); color: var(--color-orange-700); }

.question-tags {
  display: flex;
  gap: var(--spacing-xs);
}

.tag {
  background: var(--color-background-muted);
  color: var(--color-text-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--text-xs);
}

.question-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
  padding-right: var(--spacing-xl);
}

.question-indicators {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: absolute;
  right: var(--spacing-xl);
  top: 50%;
  transform: translateY(-50%);
}

.question-header {
  position: relative;
}

.priority-indicator {
  background: var(--color-red-100);
  color: var(--color-red-700);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
}

.expand-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-background-muted);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: 700;
}

.question-header.active .expand-indicator {
  background: var(--color-primary-100);
  color: var(--color-primary-600);
}

/* Question Content */
.question-content {
  padding: 0 var(--spacing-xl) var(--spacing-xl);
}

.answer {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.answer h4 {
  color: var(--color-text-primary);
  margin: var(--spacing-lg) 0 var(--spacing-md);
}

.answer ul, .answer ol {
  padding-left: var(--spacing-lg);
  margin: var(--spacing-md) 0;
}

.answer li {
  margin-bottom: var(--spacing-sm);
}

.answer code {
  background: var(--color-background-muted);
  color: var(--color-text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.answer strong {
  color: var(--color-text-primary);
}

/* Code Example */
.code-example {
  margin-bottom: var(--spacing-lg);
}

.code-title {
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
  overflow: hidden;
}

.code-block pre {
  margin: 0;
  padding: var(--spacing-md);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--line-height-relaxed);
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

/* Related Questions */
.related-questions {
  margin-bottom: var(--spacing-lg);
}

.related-title {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.related-link {
  background: none;
  border: none;
  color: var(--color-primary-600);
  text-align: left;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-base);
  font-size: var(--text-sm);
}

.related-link:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

/* Question Actions */
.question-actions {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.action-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all var(--transition-base);
}

.action-btn:hover {
  background: var(--color-background-soft);
  color: var(--color-text-primary);
}

.action-btn.active {
  background: var(--color-success-50);
  border-color: var(--color-success-300);
  color: var(--color-success-700);
}

/* Need Help Section */
.need-help {
  margin-bottom: var(--spacing-lg);
}

.help-card {
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
  border: 1px solid var(--color-primary-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
}

.help-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.help-icon {
  font-size: var(--text-4xl);
}

.help-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.help-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.help-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-base);
}

.help-btn.primary {
  background: var(--color-primary-500);
  color: white;
}

.help-btn.primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.help-btn.secondary {
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.help-btn.secondary:hover {
  background: var(--color-background-soft);
  border-color: var(--color-primary-300);
}

/* Popular Questions */
.popular-questions {
  margin-bottom: var(--spacing-lg);
}

.section__title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.popular-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.popular-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.popular-item:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.popular-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.view-count {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  background: var(--color-background-muted);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
}

.popular-title {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  line-height: var(--line-height-relaxed);
}

.popular-summary {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--line-height-relaxed);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero__title {
    font-size: var(--text-3xl);
  }
  
  .hero__description {
    font-size: var(--text-lg);
  }
  
  .stats-bar {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  .filter-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }
  
  .question-header {
    padding: var(--spacing-md);
  }
  
  .question-content {
    padding: 0 var(--spacing-lg) var(--spacing-lg);
  }
  
  .question-indicators {
    right: var(--spacing-lg);
  }
  
  .help-content {
    flex-direction: column;
    text-align: center;
  }
  
  .help-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .popular-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .search-input {
    font-size: var(--text-md);
    padding: var(--spacing-sm) var(--spacing-md);
    padding-right: 50px;
  }
  
  .search-btn {
    right: var(--spacing-sm);
    padding: var(--spacing-xs);
  }
  
  .question-title {
    padding-right: var(--spacing-2xl);
  }
  
  .question-actions {
    flex-wrap: wrap;
  }
}
</style>