<template>
    <section class="performance">
        <div class="container">
            <div class="performance__header">
                <h2 class="performance__title">性能指标</h2>
                <p class="performance__description">了解自动国际化在真实场景中的性能表现</p>
            </div>

            <div class="performance__grid">
                <div
                    v-for="(stat, index) in performanceMetrics"
                    :key="index"
                    class="performance__card"
                >
                    <div class="performance__icon">{{ stat.icon }}</div>
                    <div class="performance__value">{{ stat.value }}</div>
                    <div class="performance__label">{{ stat.label }}</div>
                    <div class="performance__description">{{ stat.description }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { performanceStats } from '@/data/featureData.js'

export default {
    name: 'PerformanceStats',
    computed: {
        performanceMetrics() {
            return [
                {
                    icon: '⚡',
                    value:
                        performanceStats.performance?.fileProcessingSpeed?.value +
                        performanceStats.performance?.fileProcessingSpeed?.unit,
                    label: '文件/秒',
                    description: '大型代码库的平均处理速度'
                },
                {
                    icon: '🎯',
                    value:
                        performanceStats.performance.accuracyRate.value +
                        performanceStats.performance.accuracyRate.unit,
                    label: '准确率',
                    description: '文本识别和转换的精确度'
                },
                {
                    icon: '📦',
                    value:
                        performanceStats.performance.memoryUsage.value +
                        performanceStats.performance.memoryUsage.unit,
                    label: '内存使用',
                    description: '处理过程中的峰值内存消耗'
                },
                {
                    icon: '🔄',
                    value:
                        performanceStats.performance.translationSpeed.value +
                        performanceStats.performance.translationSpeed.unit,
                    label: '翻译速度',
                    description: '翻译API的平均响应时间'
                }
            ]
        }
    }
}
</script>

<style scoped>
.performance {
    padding: var(--spacing-5xl) 0;
    background-color: var(--color-bg-primary);
}

.performance__header {
    text-align: center;
    margin-bottom: var(--spacing-4xl);
}

.performance__title {
    font-size: var(--text-3xl);
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
}

.performance__description {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
}

.performance__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
}

.performance__card {
    text-align: center;
    padding: var(--spacing-xl);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-lg);
    transition: all var(--transition-fast);
}

.performance__card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
}

.performance__icon {
    font-size: var(--text-3xl);
    margin-bottom: var(--spacing-md);
}

.performance__value {
    font-size: var(--text-3xl);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
}

.performance__label {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
}

.performance__description {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
}
</style>
