<template>
  <div class="changelog-page">
    <!-- Hero Section -->
    <div class="hero">
      <div class="container">
        <h1 class="hero__title">📋 更新日志</h1>
        <p class="hero__description">版本历史与更新记录</p>
      </div>
    </div>

    <div class="container">
      <!-- Changelog List -->
      <div class="changelog-list">
        <div 
          v-for="release in versionHistory" 
          :key="release.version"
          class="version-item"
        >
          <div class="version-header">
            <h2 class="version-number">{{ release.version }}</h2>
            <span class="version-date">{{ release.date }}</span>
          </div>
          
          <div v-if="release.title" class="version-title">
            {{ release.title }}
          </div>

          <ul class="changes-list">
            <li 
              v-for="(change, index) in release.changes" 
              :key="index"
              :class="['change-item', `change--${change.type}`]"
            >
              <span class="change-icon">{{ getChangeIcon(change.type) }}</span>
              <span class="change-text">{{ change.description }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import changelogData from '@/data/changelogData'

export default {
  name: 'Changelog',
  data() {
    return {
      changelogData
    }
  },
  computed: {
    versionHistory() {
      return this.changelogData?.versionHistory || []
    }
  },
  methods: {
    getChangeIcon(type) {
      const icons = {
        'feature': '✨',
        'improvement': '🔧',
        'fix': '🐛',
        'breaking': '⚠️',
        'docs': '📝',
        'performance': '⚡',
        'security': '🔒'
      }
      return icons[type] || '•'
    }
  }
}
</script>

<style scoped>
/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-600) 100%);
  color: white;
  padding: var(--spacing-2xl) 0;
  margin-bottom: var(--spacing-xl);
}

.hero__title {
  font-size: var(--text-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.hero__description {
  font-size: var(--text-lg);
  opacity: 0.9;
}

/* Changelog List */
.changelog-list {
  max-width: 900px;
  margin: 0 auto;
}

.version-item {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  transition: box-shadow var(--transition-fast);
}

.version-item:hover {
  box-shadow: var(--shadow-md);
}

.version-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--color-primary-100);
}

.version-number {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-primary);
}

.version-date {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.version-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.changes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.change-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.change-icon {
  font-size: var(--text-lg);
  flex-shrink: 0;
  margin-top: 2px;
}

.change-text {
  flex: 1;
}

/* Change Type Colors */
.change--feature .change-icon {
  color: var(--color-primary);
}

.change--improvement .change-icon {
  color: var(--color-accent);
}

.change--fix .change-icon {
  color: var(--color-warning);
}

.change--breaking .change-icon {
  color: var(--color-error);
}

/* Responsive */
@media (max-width: 768px) {
  .hero__title {
    font-size: var(--text-3xl);
  }

  .version-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .version-item {
    padding: var(--spacing-md);
  }
}
</style>
