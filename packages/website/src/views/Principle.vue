<template>
  <div class="principle-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="principle__header">
        <h1 class="principle__title">工作原理</h1>
        <p class="principle__subtitle">深入了解自动国际化插件的核心机制与实现细节</p>
      </div>

      <!-- 架构概览 -->
      <section class="principle__section">
        <h2 class="principle__section-title">架构概览</h2>
        <div class="architecture-flow">
          <div class="flow-step" v-for="(step, index) in architectureFlow" :key="index">
            <div class="flow-step__icon">{{ step.icon }}</div>
            <div class="flow-step__content">
              <h3 class="flow-step__title">{{ step.title }}</h3>
              <p class="flow-step__description">{{ step.description }}</p>
            </div>
            <div v-if="index < architectureFlow.length - 1" class="flow-arrow">→</div>
          </div>
        </div>
      </section>

      <!-- AST 处理机制 -->
      <section class="principle__section">
        <h2 class="principle__section-title">AST 处理机制</h2>
        <div class="ast-mechanism">
          <div class="ast-explanation">
            <p class="ast-description">
              插件基于 <strong>Babel 抽象语法树 (AST)</strong> 实现智能文本识别与转换。
              通过遍历代码的语法树结构，精确定位需要国际化的文本内容。
            </p>
            
            <div class="visitor-patterns">
              <h3>核心 Visitor 模式</h3>
              <div class="visitor-grid">
                <div v-for="visitor in astVisitors" :key="visitor.type" class="visitor-card">
                  <div class="visitor-card__header">
                    <span class="visitor-card__icon">{{ visitor.icon }}</span>
                    <h4 class="visitor-card__title">{{ visitor.type }}</h4>
                  </div>
                  <p class="visitor-card__description">{{ visitor.description }}</p>
                  <div class="visitor-card__example">
                    <span class="visitor-card__example-label">示例:</span>
                    <code>{{ visitor.example }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 双模式支持 -->
      <section class="principle__section">
        <h2 class="principle__section-title">双模式支持</h2>
        <div class="dual-modes">
          <div class="mode-comparison">
            <div v-for="mode in workingModes" :key="mode.type" class="mode-card">
              <div class="mode-card__header">
                <span class="mode-card__badge" :class="mode.badgeClass">{{ mode.type }}</span>
                <h3 class="mode-card__title">{{ mode.title }}</h3>
              </div>
              <p class="mode-card__description">{{ mode.description }}</p>
              
              <div class="mode-card__features">
                <h4>特点:</h4>
                <ul>
                  <li v-for="feature in mode.features" :key="feature">{{ feature }}</li>
                </ul>
              </div>
              
              <div class="mode-card__usage">
                <h4>适用场景:</h4>
                <p>{{ mode.useCase }}</p>
              </div>
              
              <div class="mode-card__example">
                <h4>配置示例:</h4>
                <pre><code>{{ mode.configExample }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 翻译流水线 -->
      <section class="principle__section">
        <h2 class="principle__section-title">翻译流水线</h2>
        <div class="translation-pipeline">
          <div class="pipeline-steps">
            <div v-for="(step, index) in pipelineSteps" :key="index" class="pipeline-step">
              <div class="pipeline-step__number">{{ index + 1 }}</div>
              <div class="pipeline-step__content">
                <h3 class="pipeline-step__title">{{ step.title }}</h3>
                <p class="pipeline-step__description">{{ step.description }}</p>
                <div class="pipeline-step__details">
                  <ul>
                    <li v-for="detail in step.details" :key="detail">{{ detail }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hash 机制 -->
      <section class="principle__section">
        <h2 class="principle__section-title">Hash 机制</h2>
        <div class="hash-mechanism">
          <div class="hash-explanation">
            <p class="hash-description">
              插件使用基于内容的哈希算法生成唯一标识符，确保翻译的一致性和去重效果。
            </p>
            
            <div class="hash-benefits">
              <div class="hash-benefit-card" v-for="benefit in hashBenefits" :key="benefit.title">
                <div class="hash-benefit-card__icon">{{ benefit.icon }}</div>
                <h4 class="hash-benefit-card__title">{{ benefit.title }}</h4>
                <p class="hash-benefit-card__description">{{ benefit.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 智能分块算法 -->
      <section class="principle__section">
        <h2 class="principle__section-title">智能分块算法</h2>
        <div class="chunking-algorithm">
          <div class="chunking-explanation">
            <p class="chunking-description">
              为了提高翻译效率和质量，插件实现了智能分块算法，将大量文本按照4500字符进行分割，
              同时使用特殊分隔符 <code>┇┇┇</code> 确保翻译结果的完整性。
            </p>
            
            <div class="chunking-demo">
              <h3>分块示例</h3>
              <div class="chunking-demo__content">
                <div class="chunking-demo__before">
                  <h4>分块前:</h4>
                  <div class="chunking-demo__text">
                    {{ chunkingDemo.before }}
                  </div>
                </div>
                <div class="chunking-demo__arrow">↓</div>
                <div class="chunking-demo__after">
                  <h4>分块后:</h4>
                  <div class="chunking-demo__chunks">
                    <div v-for="(chunk, index) in chunkingDemo.after" :key="index" class="chunk">
                      <span class="chunk__label">块 {{ index + 1 }}:</span>
                      <code class="chunk__content">{{ chunk }}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 性能优化 -->
      <section class="principle__section">
        <h2 class="principle__section-title">性能优化策略</h2>
        <div class="performance-strategies">
          <div class="strategy-grid">
            <div v-for="strategy in performanceStrategies" :key="strategy.title" class="strategy-card">
              <div class="strategy-card__icon">{{ strategy.icon }}</div>
              <h3 class="strategy-card__title">{{ strategy.title }}</h3>
              <p class="strategy-card__description">{{ strategy.description }}</p>
              <div class="strategy-card__metrics">
                <span class="strategy-card__metric">{{ strategy.improvement }}</span>
                <span class="strategy-card__metric-label">性能提升</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Principle',
  data() {
    return {
      architectureFlow: [
        {
          icon: '📁',
          title: '文件扫描',
          description: '扫描项目文件，识别需要处理的源代码'
        },
        {
          icon: '🔍',
          title: 'AST解析',
          description: '使用Babel解析源代码，生成抽象语法树'
        },
        {
          icon: '🎯',
          title: '文本提取',
          description: '通过Visitor模式提取需要翻译的文本'
        },
        {
          icon: '🔄',
          title: '翻译处理',
          description: '调用翻译API，获取多语言文本'
        },
        {
          icon: '💾',
          title: '结果输出',
          description: '生成语言包文件和转换后的代码'
        }
      ],
      astVisitors: [
        {
          type: 'StringLiteral',
          icon: '📝',
          description: '处理字符串字面量',
          example: '"用户登录"'
        },
        {
          type: 'JSXText',
          icon: '🏷️',
          description: '处理JSX中的文本内容',
          example: '<p>欢迎使用</p>'
        },
        {
          type: 'TemplateLiteral',
          icon: '🔤',
          description: '处理模板字符串',
          example: '`你好，${name}`'
        },
        {
          type: 'CallExpression',
          icon: '📞',
          description: '处理函数调用表达式',
          example: 'alert("提示信息")'
        }
      ],
      workingModes: [
        {
          type: '全自动模式',
          title: 'Full-Auto Mode',
          description: '自动识别中文、日文、韩文、俄文等特定语言文本，零配置开箱即用',
          badgeClass: 'mode-badge--auto',
          features: [
            '无需手动标记文本',
            '支持中日韩俄四种语言自动识别',
            '智能过滤系统变量和函数名',
            '自动生成国际化键值'
          ],
          useCase: '适用于主要使用中文的项目，需要快速实现国际化',
          configExample: `{
  mode: 'full-auto',
  sourceLanguage: 'zh-cn',
  targetLanguages: ['en', 'ja', 'ko']
}`
        },
        {
          type: '半自动模式',
          title: 'Semi-Auto Mode',
          description: '通过手动标记需要翻译的文本，支持任意源语言的精确控制',
          badgeClass: 'mode-badge--semi',
          features: [
            '手动标记需要翻译的文本',
            '支持任意源语言',
            '精确控制翻译范围',
            '自定义国际化键值'
          ],
          useCase: '适用于多语言项目或需要精确控制翻译内容的场景',
          configExample: `{
  mode: 'semi-auto',
  sourceLanguage: 'en',
  markFunction: '$t',
  targetLanguages: ['zh-cn', 'fr', 'de']
}`
        }
      ],
      pipelineSteps: [
        {
          title: '文本收集',
          description: '扫描源代码，收集所有需要翻译的文本到langObj对象中',
          details: [
            '遍历AST节点，识别文本内容',
            '应用过滤规则，排除不需要翻译的内容',
            '生成唯一的Hash标识符'
          ]
        },
        {
          title: '去重对比',
          description: '与现有语言包进行对比，只翻译新增的文本内容',
          details: [
            '读取现有的JSON语言文件',
            '对比Hash值，识别新增文本',
            '保持已翻译内容的稳定性'
          ]
        },
        {
          title: '智能分块',
          description: '将大量文本按4500字符分割，使用分隔符连接',
          details: [
            '按字符数量进行智能分割',
            '使用"┇┇┇"作为分隔符',
            '保持翻译上下文的完整性'
          ]
        },
        {
          title: '并行翻译',
          description: '使用Promise.all并行调用翻译API，显示翻译进度',
          details: [
            '多个翻译请求同时进行',
            '实时显示翻译进度条',
            '错误处理和重试机制'
          ]
        },
        {
          title: '结果合并',
          description: '分割翻译结果并写入对应的语言包文件',
          details: [
            '按分隔符重新分割翻译结果',
            '写入到对应语言的JSON文件',
            '验证翻译结果的完整性'
          ]
        }
      ],
      hashBenefits: [
        {
          icon: '🎯',
          title: '避免重复翻译',
          description: '相同内容只翻译一次，大幅提高效率'
        },
        {
          icon: '📊',
          title: '增量更新',
          description: '只翻译新增和修改的文本内容'
        },
        {
          icon: '🔒',
          title: '内容一致性',
          description: '确保相同文本在不同位置的翻译一致'
        },
        {
          icon: '⚡',
          title: '快速查找',
          description: '基于Hash的快速索引和查找机制'
        }
      ],
      chunkingDemo: {
        before: '用户登录成功┇┇┇欢迎回来┇┇┇请选择您的操作┇┇┇查看个人资料┇┇┇修改密码┇┇┇退出登录',
        after: [
          '用户登录成功',
          '欢迎回来', 
          '请选择您的操作',
          '查看个人资料┇┇┇修改密码┇┇┇退出登录'
        ]
      },
      performanceStrategies: [
        {
          icon: '🚀',
          title: '并行处理',
          description: '多线程并行处理文件，充分利用系统资源',
          improvement: '60%+'
        },
        {
          icon: '💾',
          title: '智能缓存',
          description: '缓存翻译结果和AST解析结果，避免重复计算',
          improvement: '40%+'
        },
        {
          icon: '🎯',
          title: '增量更新',
          description: '只处理变更的文件和内容，跳过未修改部分',
          improvement: '80%+'
        },
        {
          icon: '📦',
          title: '内存优化',
          description: '流式处理大文件，控制内存使用峰值',
          improvement: '50%+'
        }
      ]
    }
  }
}
</script>

<style scoped>
.principle-page {
  padding: var(--spacing-md) 0;
  background-color: var(--color-bg-primary);
  min-height: 100vh;
}

.principle__header {
  text-align: center;
  margin-bottom: var(--spacing-5xl);
}

.principle__title {
  font-size: var(--text-5xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.principle__subtitle {
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  max-width: 800px;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
}

.principle__section {
  margin-bottom: var(--spacing-5xl);
}

.principle__section-title {
  font-size: var(--text-3xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

/* 架构流程 */
.architecture-flow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-xl);
  overflow-x: auto;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 160px;
  padding: var(--spacing-md);
}

.flow-step__icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--spacing-md);
}

.flow-step__title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.flow-step__description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.flow-arrow {
  font-size: var(--text-2xl);
  color: var(--color-primary);
  margin: 0 var(--spacing-md);
}

/* Visitor 模式 */
.ast-explanation {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-xl);
}

.ast-description {
  font-size: var(--text-lg);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.visitor-patterns h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.visitor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.visitor-card {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  transition: all var(--transition-fast);
}

.visitor-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.visitor-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.visitor-card__icon {
  font-size: var(--text-xl);
}

.visitor-card__title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.visitor-card__description {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: var(--line-height-relaxed);
}

.visitor-card__example {
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.visitor-card__example-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
}

.visitor-card__example code {
  font-family: var(--font-mono);
  color: var(--color-primary);
  margin-left: var(--spacing-sm);
}

/* 双模式对比 */
.mode-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-xl);
}

.mode-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  transition: all var(--transition-fast);
}

.mode-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.mode-card__header {
  margin-bottom: var(--spacing-lg);
}

.mode-card__badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-xl);
  font-size: var(--text-sm);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
}

.mode-badge--auto {
  background-color: var(--color-success);
  color: white;
}

.mode-badge--semi {
  background-color: var(--color-info);
  color: white;
}

.mode-card__title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.mode-card__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.mode-card__features h4,
.mode-card__usage h4,
.mode-card__example h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.mode-card__features ul {
  list-style: none;
  margin-bottom: var(--spacing-lg);
}

.mode-card__features li {
  position: relative;
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
}

.mode-card__features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: 600;
}

.mode-card__usage {
  margin-bottom: var(--spacing-lg);
}

.mode-card__usage p {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.mode-card__example pre {
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

/* 翻译流水线 */
.pipeline-steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.pipeline-step {
  display: flex;
  gap: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-xl);
  border-left: 4px solid var(--color-primary);
}

.pipeline-step__number {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  font-size: var(--text-lg);
  font-weight: 600;
}

.pipeline-step__title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.pipeline-step__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
}

.pipeline-step__details ul {
  list-style: none;
}

.pipeline-step__details li {
  position: relative;
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.pipeline-step__details li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

/* Hash 机制 */
.hash-explanation {
  text-align: center;
}

.hash-description {
  font-size: var(--text-lg);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.hash-benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.hash-benefit-card {
  text-align: center;
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.hash-benefit-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.hash-benefit-card__icon {
  font-size: var(--text-3xl);
  margin-bottom: var(--spacing-md);
}

.hash-benefit-card__title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.hash-benefit-card__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

/* 分块演示 */
.chunking-explanation {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-xl);
}

.chunking-description {
  font-size: var(--text-lg);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.chunking-demo h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.chunking-demo__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.chunking-demo__before,
.chunking-demo__after {
  width: 100%;
  max-width: 600px;
}

.chunking-demo__before h4,
.chunking-demo__after h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  text-align: center;
}

.chunking-demo__text {
  background-color: var(--color-bg-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--line-height-relaxed);
}

.chunking-demo__arrow {
  font-size: var(--text-2xl);
  color: var(--color-primary);
}

.chunking-demo__chunks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.chunk {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: var(--color-bg-primary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.chunk__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.chunk__content {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  flex: 1;
}

/* 性能策略 */
.strategy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.strategy-card {
  text-align: center;
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  transition: all var(--transition-fast);
}

.strategy-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.strategy-card__icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--spacing-md);
}

.strategy-card__title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.strategy-card__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.strategy-card__metrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.strategy-card__metric {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-success);
}

.strategy-card__metric-label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .architecture-flow {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .flow-arrow {
    transform: rotate(90deg);
    margin: var(--spacing-md) 0;
  }
  
  .mode-comparison {
    grid-template-columns: 1fr;
  }
  
  .pipeline-step {
    flex-direction: column;
    text-align: center;
  }
  
  .chunking-demo__content {
    gap: var(--spacing-md);
  }
}
</style>