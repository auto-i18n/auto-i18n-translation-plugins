<template>
  <section class="features">
    <div class="container">
      <div class="features__header">
        <h2 class="features__title">核心功能</h2>
        <p class="features__description">
          探索使自动国际化成为完美选择的强大功能，满足您的国际化需求。
        </p>
      </div>
      
      <div class="features__grid">
        <div 
          v-for="(feature, index) in coreFeatures" 
          :key="feature.id"
          class="feature-card"
          :class="{ 'feature-card--highlighted': highlightedFeature === index }"
          @mouseenter="highlightedFeature = index"
          @mouseleave="highlightedFeature = null"
        >
          <div class="feature-card__header">
            <div class="feature-card__icon">{{ feature.icon }}</div>
            <h3 class="feature-card__title">{{ feature.title }}</h3>
          </div>
          
          <p class="feature-card__description">{{ feature.description }}</p>
          
          <ul class="feature-card__highlights">
            <li 
              v-for="highlight in feature.highlights" 
              :key="highlight"
              class="feature-card__highlight"
            >
              <span class="feature-card__highlight-icon">✓</span>
              {{ highlight }}
            </li>
          </ul>
          
          <div class="feature-card__technical" v-if="feature.technicalDetails">
            <div class="feature-card__tech-section" v-if="feature.technicalDetails.visitors">
              <span class="feature-card__tech-label">AST访问器:</span>
              <div class="feature-card__tech-tags">
                <span 
                  v-for="visitor in feature.technicalDetails.visitors" 
                  :key="visitor"
                  class="feature-card__tech-tag"
                >{{ visitor }}</span>
              </div>
            </div>
            
            <div class="feature-card__tech-section" v-if="feature.technicalDetails.supported">
              <span class="feature-card__tech-label">支持:</span>
              <div class="feature-card__tech-tags">
                <span 
                  v-for="item in feature.technicalDetails.supported" 
                  :key="item"
                  class="feature-card__tech-tag feature-card__tech-tag--success"
                >{{ item }}</span>
              </div>
            </div>
            
            <div class="feature-card__tech-section" v-if="feature.technicalDetails.modes">
              <span class="feature-card__tech-label">模式:</span>
              <div class="feature-card__tech-tags">
                <span 
                  v-for="mode in feature.technicalDetails.modes" 
                  :key="mode"
                  class="feature-card__tech-tag feature-card__tech-tag--info"
                >{{ mode }}</span>
              </div>
            </div>
          </div>
          
          <div class="feature-card__footer">
            <button class="feature-card__learn-more" @click="openFeatureModal(feature)">
              了解更多
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7,7 17,7 17,17"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { coreFeatures } from '@/data/featureData.js'

export default {
  name: 'FeaturesGrid',
  data() {
    return {
      coreFeatures,
      highlightedFeature: null
    }
  },
  methods: {
    openFeatureModal(feature) {
      console.log('正在打开功能详情:', feature.title)
    }
  }
}
</script>

<style scoped>
.features {
  padding: var(--spacing-5xl) 0;
  background-color: var(--color-bg-secondary);
}

.features__header {
  text-align: center;
  margin-bottom: var(--spacing-5xl);
}

.features__title {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.features__description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
}

.features__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
}

@media (min-width: 768px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.feature-card:hover,
.feature-card--highlighted {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
}

.feature-card:hover::before,
.feature-card--highlighted::before {
  opacity: 1;
}

.feature-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.feature-card__icon {
  font-size: var(--text-2xl);
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-light);
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.feature-card__title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.feature-card__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.feature-card__highlights {
  list-style: none;
  margin-bottom: var(--spacing-lg);
}

.feature-card__highlight {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.feature-card__highlight-icon {
  color: var(--color-success);
  font-weight: 600;
  font-size: var(--text-xs);
  margin-top: 2px;
  flex-shrink: 0;
}

.feature-card__technical {
  margin-bottom: var(--spacing-lg);
}

.feature-card__tech-section {
  margin-bottom: var(--spacing-md);
}

.feature-card__tech-section:last-child {
  margin-bottom: 0;
}

.feature-card__tech-label {
  display: block;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-xs);
}

.feature-card__tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.feature-card__tech-tag {
  display: inline-block;
  padding: 2px var(--spacing-xs);
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-size: 10px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-light);
}

.feature-card__tech-tag--success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
  border-color: var(--color-success);
}

.feature-card__tech-tag--info {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--color-info);
  border-color: var(--color-info);
}

.feature-card__footer {
  margin-top: auto;
}

.feature-card__learn-more {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  background: none;
  border: none;
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color var(--transition-fast);
}

.feature-card__learn-more:hover {
  color: var(--color-primary-hover);
}

.feature-card__learn-more svg {
  transition: transform var(--transition-fast);
}

.feature-card__learn-more:hover svg {
  transform: translate(2px, -2px);
}
</style>