<template>
  <div class="examples-page">
    <!-- Hero Section -->
    <div class="hero">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">💻 实践示例</h1>
          <p class="hero__description">
            真实项目的完整集成示例，从配置到部署的全流程演示，以及最佳实践指南
          </p>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Framework Filter -->
      <section class="framework-filter">
        <h2 class="section__title">选择框架</h2>
        <div class="filter-tabs">
          <button
            v-for="framework in frameworks"
            :key="framework.id"
            @click="activeFramework = framework.id"
            :class="['filter-tab', { active: activeFramework === framework.id }]"
          >
            <span class="framework-icon">{{ framework.icon }}</span>
            <span class="framework-name">{{ framework.name }}</span>
            <span class="example-count">({{ getExampleCount(framework.id) }})</span>
          </button>
        </div>
      </section>

      <!-- Example Projects -->
      <section class="example-projects">
        <div class="projects-grid">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card"
            @click="selectedProject = project"
          >
            <div class="project-header">
              <div class="project-meta">
                <div class="project-framework">
                  <span class="framework-badge">{{ project.framework }}</span>
                  <span class="build-tool-badge">{{ project.buildTool }}</span>
                </div>
                <span :class="['difficulty-badge', `difficulty--${project.difficulty}`]">
                  {{ getDifficultyLabel(project.difficulty) }}
                </span>
              </div>
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
            </div>

            <div class="project-features">
              <div class="features-list">
                <span
                  v-for="feature in project.features.slice(0, 4)"
                  :key="feature"
                  class="feature-tag"
                >
                  {{ feature }}
                </span>
                <span
                  v-if="project.features.length > 4"
                  class="feature-more"
                >
                  +{{ project.features.length - 4 }}
                </span>
              </div>
            </div>

            <div class="project-actions">
              <button class="btn btn-primary">查看完整示例</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Framework Integration Guides -->
      <section class="integration-guides">
        <h2 class="section__title">🚀 集成指南</h2>
        <div class="guides-grid">
          <div
            v-for="guide in frameworkGuides"
            :key="guide.framework"
            class="guide-card"
          >
            <div class="guide-header">
              <span class="guide-icon">{{ guide.icon }}</span>
              <h3 class="guide-title">{{ guide.framework }}</h3>
              <p class="guide-description">{{ guide.description }}</p>
            </div>

            <div class="guide-steps">
              <div
                v-for="(step, index) in guide.steps.slice(0, 3)"
                :key="index"
                class="step-preview"
              >
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <h4 class="step-title">{{ step.title }}</h4>
                  <p class="step-description">{{ step.description }}</p>
                </div>
              </div>
            </div>

            <div class="guide-actions">
              <button
                @click="showGuideModal(guide)"
                class="btn btn-outline"
              >
                查看详细指南
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="best-practices">
        <h2 class="section__title">⭐ 最佳实践</h2>
        <div class="practices-list">
          <div
            v-for="practice in bestPractices"
            :key="practice.title"
            class="practice-item"
          >
            <div class="practice-header">
              <h3 class="practice-title">{{ practice.title }}</h3>
              <p class="practice-description">{{ practice.description }}</p>
            </div>

            <div class="practice-examples">
              <div class="example-comparison">
                <div class="example-section good">
                  <h4 class="example-label">✅ 推荐做法</h4>
                  <div class="code-block">
                    <pre><code>{{ practice.example.good }}</code></pre>
                    <button
                      @click="copyToClipboard(practice.example.good)"
                      class="copy-btn"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div class="example-section bad">
                  <h4 class="example-label">❌ 避免做法</h4>
                  <div class="code-block">
                    <pre><code>{{ practice.example.bad }}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Project Detail Modal -->
    <div v-if="selectedProject" class="modal-overlay" @click="closeProjectModal">
      <div class="modal large-modal project-modal" @click.stop>
        <div class="modal-header">
          <div class="project-modal-header">
            <div class="project-modal-meta">
              <span class="framework-badge">{{ selectedProject.framework }}</span>
              <span class="build-tool-badge">{{ selectedProject.buildTool }}</span>
              <span :class="['difficulty-badge', `difficulty--${selectedProject.difficulty}`]">
                {{ getDifficultyLabel(selectedProject.difficulty) }}
              </span>
            </div>
            <h3 class="modal-title">{{ selectedProject.title }}</h3>
            <p class="modal-description">{{ selectedProject.description }}</p>
          </div>
          <button @click="closeProjectModal" class="close-btn">×</button>
        </div>

        <div class="modal-body">
          <!-- Features -->
          <div class="project-features-full">
            <h4>🎯 项目特性</h4>
            <div class="features-grid">
              <span
                v-for="feature in selectedProject.features"
                :key="feature"
                class="feature-tag-full"
              >
                {{ feature }}
              </span>
            </div>
          </div>

          <!-- Project Structure -->
          <div v-if="selectedProject.projectStructure" class="project-structure">
            <h4>📁 项目结构</h4>
            <div class="code-block">
              <pre><code>{{ selectedProject.projectStructure }}</code></pre>
            </div>
          </div>

          <!-- Code Comparison -->
          <div class="code-comparison">
            <h4>🔄 转换对比</h4>
            <div class="comparison-tabs">
              <button
                v-for="tab in comparisonTabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="['tab-btn', { active: activeTab === tab.id }]"
              >
                {{ tab.label }}
              </button>
            </div>

            <div class="tab-content">
              <div v-if="activeTab === 'before'" class="code-section">
                <h5>转换前 (原始代码)</h5>
                <div class="code-block">
                  <pre><code>{{ selectedProject.beforeCode }}</code></pre>
                  <button
                    @click="copyToClipboard(selectedProject.beforeCode)"
                    class="copy-btn"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div v-if="activeTab === 'after'" class="code-section">
                <h5>转换后 (国际化代码)</h5>
                <div class="code-block">
                  <pre><code>{{ selectedProject.afterCode }}</code></pre>
                  <button
                    @click="copyToClipboard(selectedProject.afterCode)"
                    class="copy-btn"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div v-if="activeTab === 'config'" class="code-section">
                <h5>配置文件</h5>
                <div class="code-block">
                  <pre><code>{{ selectedProject.config }}</code></pre>
                  <button
                    @click="copyToClipboard(selectedProject.config)"
                    class="copy-btn"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Setup Steps -->
          <div v-if="selectedProject.setupSteps" class="setup-steps">
            <h4>📋 设置步骤</h4>
            <div class="steps-list">
              <div
                v-for="(step, index) in selectedProject.setupSteps"
                :key="index"
                class="setup-step"
              >
                <div class="step-header">
                  <div class="step-number">{{ index + 1 }}</div>
                  <h5 class="step-title">{{ step.title }}</h5>
                </div>
                <p class="step-description">{{ step.description }}</p>

                <div v-if="step.commands" class="step-commands">
                  <div
                    v-for="command in step.commands"
                    :key="command"
                    class="command-line"
                  >
                    <code>$ {{ command }}</code>
                    <button
                      @click="copyToClipboard(command)"
                      class="copy-btn-small"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div v-if="step.code" class="step-code">
                  <div class="code-block">
                    <pre><code>{{ step.code }}</code></pre>
                    <button
                      @click="copyToClipboard(step.code)"
                      class="copy-btn"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div v-if="step.notes" class="step-notes">
                  <h6>💡 注意事项</h6>
                  <ul>
                    <li v-for="note in step.notes" :key="note">{{ note }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeProjectModal" class="btn btn-secondary">关闭</button>
          <a
            v-if="selectedProject.demoUrl"
            :href="selectedProject.demoUrl"
            target="_blank"
            class="btn btn-primary"
          >
            在线预览 ↗
          </a>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div v-if="selectedGuide" class="modal-overlay" @click="closeGuideModal">
      <div class="modal large-modal guide-modal" @click.stop>
        <div class="modal-header">
          <div class="guide-modal-header">
            <span class="guide-icon-large">{{ selectedGuide.icon }}</span>
            <h3 class="modal-title">{{ selectedGuide.framework }} 集成指南</h3>
            <p class="modal-description">{{ selectedGuide.description }}</p>
          </div>
          <button @click="closeGuideModal" class="close-btn">×</button>
        </div>

        <div class="modal-body">
          <div class="guide-steps-full">
            <div
              v-for="(step, index) in selectedGuide.steps"
              :key="index"
              class="guide-step"
            >
              <div class="step-header">
                <div class="step-number">{{ index + 1 }}</div>
                <h4 class="step-title">{{ step.title }}</h4>
              </div>
              <p class="step-description">{{ step.description }}</p>

              <div v-if="step.command" class="step-command">
                <div class="command-line">
                  <code>$ {{ step.command }}</code>
                  <button
                    @click="copyToClipboard(step.command)"
                    class="copy-btn-small"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div v-if="step.code" class="step-code">
                <div class="code-block">
                  <pre><code>{{ step.code }}</code></pre>
                  <button
                    @click="copyToClipboard(step.code)"
                    class="copy-btn"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeGuideModal" class="btn btn-secondary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { exampleProjects, frameworkGuides, bestPractices } from '@/data/exampleData'

export default {
  name: 'Examples',
  data() {
    return {
      exampleProjects,
      frameworkGuides,
      bestPractices,
      activeFramework: 'all',
      selectedProject: null,
      selectedGuide: null,
      activeTab: 'before',
      frameworks: [
        { id: 'all', name: '全部', icon: '🌐' },
        { id: 'Vue', name: 'Vue', icon: '💚' },
        { id: 'React', name: 'React', icon: '⚛️' },
        { id: 'Nuxt', name: 'Nuxt', icon: '💚' },
        { id: 'Angular', name: 'Angular', icon: '🅰️' }
      ],
      comparisonTabs: [
        { id: 'before', label: '转换前' },
        { id: 'after', label: '转换后' },
        { id: 'config', label: '配置' }
      ]
    }
  },
  computed: {
    filteredProjects() {
      if (this.activeFramework === 'all') {
        return this.exampleProjects
      }
      return this.exampleProjects.filter(project => project.framework === this.activeFramework)
    }
  },
  methods: {
    getExampleCount(frameworkId) {
      if (frameworkId === 'all') {
        return this.exampleProjects.length
      }
      return this.exampleProjects.filter(p => p.framework === frameworkId).length
    },
    getDifficultyLabel(difficulty) {
      const labels = {
        beginner: '入门',
        intermediate: '进阶',
        advanced: '高级'
      }
      return labels[difficulty] || difficulty
    },
    showGuideModal(guide) {
      this.selectedGuide = guide
      document.body.style.overflow = 'hidden'
    },
    closeProjectModal() {
      this.selectedProject = null
      document.body.style.overflow = ''
    },
    closeGuideModal() {
      this.selectedGuide = null
      document.body.style.overflow = ''
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

/* Framework Filter */
.framework-filter {
  margin-bottom: var(--spacing-lg);
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
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
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

.framework-icon {
  font-size: var(--text-lg);
}

.example-count {
  background: var(--color-background-muted);
  color: var(--color-text-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--text-sm);
}

.filter-tab.active .example-count {
  background: var(--color-primary-100);
  color: var(--color-primary-600);
}

/* Project Cards */
.example-projects {
  margin-bottom: var(--spacing-lg);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.project-card {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-background);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.project-card:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.project-header {
  margin-bottom: var(--spacing-lg);
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.project-framework {
  display: flex;
  gap: var(--spacing-sm);
}

.framework-badge, .build-tool-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
}

.framework-badge {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.build-tool-badge {
  background: var(--color-background-muted);
  color: var(--color-text-secondary);
}

.difficulty-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
}

.difficulty--beginner {
  background: var(--color-success-100);
  color: var(--color-success-700);
}

.difficulty--intermediate {
  background: var(--color-orange-100);
  color: var(--color-orange-700);
}

.difficulty--advanced {
  background: var(--color-red-100);
  color: var(--color-red-700);
}

.project-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.project-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.project-features {
  margin-bottom: var(--spacing-lg);
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.feature-tag {
  background: var(--color-background-soft);
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--text-sm);
  border: 1px solid var(--color-border);
}

.feature-more {
  background: var(--color-background-muted);
  color: var(--color-text-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--text-sm);
}

/* Integration Guides */
.integration-guides {
  margin-bottom: var(--spacing-lg);
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.guide-card {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-background);
  padding: var(--spacing-md);
}

.guide-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.guide-icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--spacing-md);
}

.guide-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.guide-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.guide-steps {
  margin-bottom: var(--spacing-lg);
}

.step-preview {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.step-number {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: 600;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.step-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

/* Best Practices */
.best-practices {
  margin-bottom: var(--spacing-lg);
}

.practices-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.practice-item {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-background);
  overflow: hidden;
}

.practice-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.practice-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.practice-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.example-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 768px) {
  .example-comparison {
    grid-template-columns: 1fr;
  }
}

.example-section {
  padding: var(--spacing-md);
}

.example-section.good {
  border-right: 1px solid var(--color-border);
  background: var(--color-success-25);
}

.example-section.bad {
  background: var(--color-red-25);
}

@media (max-width: 768px) {
  .example-section.good {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}

.example-label {
  font-size: var(--text-md);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.example-section.good .example-label {
  color: var(--color-success-700);
}

.example-section.bad .example-label {
  color: var(--color-red-700);
}

/* Code Blocks */
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

.copy-btn, .copy-btn-small {
  position: absolute;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all var(--transition-base);
}

.copy-btn {
  top: var(--spacing-sm);
  right: var(--spacing-sm);
}

.copy-btn-small {
  top: 2px;
  right: 2px;
  padding: 2px 4px;
}

.copy-btn:hover, .copy-btn-small:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-300);
}

/* Command Line */
.command-line {
  position: relative;
  background: var(--color-background-dark);
  color: var(--color-text-light);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  margin: var(--spacing-sm) 0;
}

/* Modal Styles */
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
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-2xl);
}

.large-modal {
  max-width: 1200px;
}

.modal-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-soft);
  position: relative;
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.modal-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.close-btn {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  background: none;
  border: none;
  font-size: var(--text-2xl);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-base);
}

.close-btn:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-md);
}

.modal-footer {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

/* Project Modal Specific */
.project-modal-header {
  padding-right: var(--spacing-3xl);
}

.project-modal-meta {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.project-features-full {
  margin-bottom: var(--spacing-md);
}

.project-features-full h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.features-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.feature-tag-full {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
}

/* Tabs */
.comparison-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.tab-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-base);
}

.tab-btn:hover {
  color: var(--color-text-primary);
}

.tab-btn.active {
  color: var(--color-primary-600);
  border-bottom-color: var(--color-primary-500);
}

.code-section h5 {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

/* Setup Steps */
.setup-steps {
  margin-bottom: var(--spacing-md);
}

.setup-steps h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

.setup-step {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.setup-step .step-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.setup-step .step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary-500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.setup-step .step-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.step-commands {
  margin: var(--spacing-md) 0;
}

.step-code {
  margin: var(--spacing-md) 0;
}

.step-notes {
  background: var(--color-background-soft);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-primary-400);
  margin-top: var(--spacing-md);
}

.step-notes h6 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.step-notes ul {
  margin: 0;
  padding-left: var(--spacing-lg);
}

.step-notes li {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-xs);
}

/* Guide Modal */
.guide-modal-header {
  text-align: center;
  padding-right: var(--spacing-3xl);
}

.guide-icon-large {
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-lg);
  display: block;
}

.guide-steps-full {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.guide-step {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
}

.guide-step .step-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.guide-step .step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: 600;
}

.guide-step .step-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.step-command {
  margin: var(--spacing-lg) 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero__title {
    font-size: var(--text-3xl);
  }
  
  .hero__description {
    font-size: var(--text-lg);
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .guides-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }
  
  .modal {
    margin: var(--spacing-sm);
    max-height: calc(100vh - 2 * var(--spacing-sm));
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: var(--spacing-md);
  }
}
</style>