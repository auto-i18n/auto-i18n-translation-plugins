<template>
  <section class="usecases">
    <div class="container">
      <div class="usecases__header">
        <h2 class="usecases__title">适用于任何项目</h2>
        <p class="usecases__description">
          从小型应用程序到企业解决方案，自动国际化能够根据您的需求进行扩展
        </p>
      </div>
      
      <div class="usecases__grid">
        <div 
          v-for="(usecase, index) in useCases" 
          :key="index"
          class="usecase__card"
        >
          <div class="usecase__icon">{{ usecase.icon }}</div>
          <h3 class="usecase__title">{{ usecase.title }}</h3>
          <p class="usecase__description">{{ usecase.description }}</p>
          
          <div class="usecase__features">
            <span 
              v-for="feature in usecase.features" 
              :key="feature"
              class="usecase__feature"
            >{{ feature }}</span>
          </div>
          
          <div class="usecase__frameworks" v-if="usecase.frameworks">
            <div class="usecase__frameworks-label">Popular with:</div>
            <div class="usecase__frameworks-list">
              <span 
                v-for="framework in usecase.frameworks" 
                :key="framework"
                class="usecase__framework"
              >{{ framework }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useCases } from '@/data/featureData.js'

export default {
  name: 'UseCases',
  data() {
    return {
      useCases
    }
  }
}
</script>

<style scoped>
.usecases {
  padding: var(--spacing-5xl) 0;
  background-color: var(--color-bg-secondary);
}

.usecases__header {
  text-align: center;
  margin-bottom: var(--spacing-4xl);
}

.usecases__title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.usecases__description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
}

.usecases__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
}

@media (min-width: 768px) {
  .usecases__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .usecases__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.usecase__card {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  transition: all var(--transition-normal);
}

.usecase__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.usecase__icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--spacing-lg);
}

.usecase__title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.usecase__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.usecase__features {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
}

.usecase__feature {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-sm);
}

.usecase__frameworks {
  border-top: 1px solid var(--color-border-light);
  padding-top: var(--spacing-md);
}

.usecase__frameworks-label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-xs);
}

.usecase__frameworks-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.usecase__framework {
  padding: 2px var(--spacing-xs);
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-size: 10px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-light);
}
</style>