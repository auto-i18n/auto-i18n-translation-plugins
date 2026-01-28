<template>
    <section class="hero">
        <div class="hero__background">
            <div class="hero__gradient"></div>
        </div>

        <div class="container">
            <div class="hero__content">
                <div class="hero__text">
                    <div class="hero__badge">
                        <span class="hero__badge-icon">✨</span>
                        <span class="hero__badge-text">v1.1.16 新版本发布</span>
                    </div>

                    <h1 class="hero__title">
                        <span class="hero__title-main">自动国际化翻译</span>
                        <span class="hero__title-sub">一键多语言神器</span>
                    </h1>

                    <p class="hero__description">
                        基于Babel AST的智能翻译插件，零侵入式改造，支持Vue、React等主流框架。
                        让您的应用瞬间支持全球化，告别手工翻译的痛苦。
                    </p>

                    <div class="hero__features">
                        <div class="hero__feature">
                            <span class="hero__feature-icon">⚡</span>
                            <span class="hero__feature-text">零侵入式</span>
                        </div>
                        <div class="hero__feature">
                            <span class="hero__feature-icon">🎯</span>
                            <span class="hero__feature-text">智能AST</span>
                        </div>
                        <div class="hero__feature">
                            <span class="hero__feature-icon">🌐</span>
                            <span class="hero__feature-text">多翻译器</span>
                        </div>
                        <div class="hero__feature">
                            <span class="hero__feature-icon">🔧</span>
                            <span class="hero__feature-text">高度可配</span>
                        </div>
                    </div>

                    <div class="hero__actions">
                        <router-link to="/principle" class="btn btn-primary btn-lg">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polygon points="10,8 16,12 10,16 10,8" />
                            </svg>
                            立即开始
                        </router-link>

                        <a
                            href="https://github.com/xiaoshan5733/auto-i18n-translation-plugins"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn btn-secondary btn-lg"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                            GitHub
                        </a>
                    </div>

                    <div class="hero__stats">
                        <div class="hero__stat">
                            <div class="hero__stat-number">128K+</div>
                            <div class="hero__stat-label">npm下载量</div>
                        </div>
                        <div class="hero__stat">
                            <div class="hero__stat-number">256+</div>
                            <div class="hero__stat-label">GitHub星标</div>
                        </div>
                        <div class="hero__stat">
                            <div class="hero__stat-number">12+</div>
                            <div class="hero__stat-label">支持框架</div>
                        </div>
                    </div>
                </div>

                <div class="hero__demo">
                    <div class="hero__demo-container">
                        <div class="hero__demo-header">
                            <div class="hero__demo-controls">
                                <span class="hero__demo-control hero__demo-control--red"></span>
                                <span class="hero__demo-control hero__demo-control--yellow"></span>
                                <span class="hero__demo-control hero__demo-control--green"></span>
                            </div>
                            <div class="hero__demo-title">代码转换演示</div>
                        </div>

                        <div class="hero__demo-content">
                            <div class="hero__demo-step">
                                <div class="hero__demo-label">转换前（原始代码）</div>
                                <pre class="hero__code-block"><code>
                  &lt;template&gt;
  &lt;div class="user-profile"&gt;
    &lt;h2&gt;用户信息&lt;/h2&gt;
    &lt;p&gt;欢迎回来，{{ username }}&lt;/p&gt;
    &lt;button @click="logout"&gt;退出登录&lt;/button&gt;
  &lt;/div&gt;
&lt;/template&gt;
</code></pre>
                            </div>

                            <div class="hero__demo-arrow">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12,5 19,12 12,19"></polyline>
                                </svg>
                            </div>

                            <div class="hero__demo-step">
                                <div class="hero__demo-label">转换后（自动转换结果）</div>
                                <pre class="hero__code-block"><code>&lt;template&gt;
  &lt;div class="user-profile"&gt;
    &lt;h2&gt;{{ $t('用户信息') }}&lt;/h2&gt;
    &lt;p&gt;{{ $t('欢迎回来，{username}', { username }) }}&lt;/p&gt;
    &lt;button @click="logout"&gt;{{ $t('退出登录') }}&lt;/button&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'HeroSection'
}
</script>

<style scoped>
.hero {
    position: relative;
    padding: var(--spacing-5xl) 0;
    min-height: 90vh;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.hero__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
}

.hero__gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        135deg,
        rgba(79, 70, 229, 0.1) 0%,
        rgba(147, 51, 234, 0.05) 25%,
        rgba(236, 72, 153, 0.1) 50%,
        rgba(59, 130, 246, 0.05) 75%,
        rgba(16, 185, 129, 0.1) 100%
    );
}

.hero__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-5xl);
    align-items: center;
}

@media (min-width: 1024px) {
    .hero__content {
        grid-template-columns: 1fr 1fr;
    }
}

.hero__badge {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-lg);
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(236, 72, 153, 0.1));
    border: 1px solid rgba(79, 70, 229, 0.2);
    border-radius: var(--radius-full);
    margin-bottom: var(--spacing-lg);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-primary);
}

.hero__badge-icon {
    font-size: var(--text-base);
}

.hero__title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: var(--spacing-lg);
}

.hero__title-main {
    display: block;
    background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero__title-sub {
    display: block;
    color: var(--color-text-primary);
    margin-top: var(--spacing-sm);
}

.hero__description {
    font-size: var(--text-xl);
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-2xl);
    max-width: 600px;
}

.hero__features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
}

.hero__feature {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-lg);
    transition: all var(--transition-normal);
}

.hero__feature:hover {
    background: rgba(255, 255, 255, 1);
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.15);
}

.hero__feature-icon {
    font-size: var(--text-lg);
    flex-shrink: 0;
}

.hero__feature-text {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-primary);
}

.hero__actions {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    margin-bottom: var(--spacing-2xl);
}

.hero__stats {
    display: flex;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
}

.hero__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-lg);
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-lg);
    min-width: 120px;
    transition: all var(--transition-normal);
}

.hero__stat:hover {
    background: rgba(255, 255, 255, 1);
    border-color: var(--color-primary);
    transform: translateY(-2px);
}

.hero__stat-number {
    font-size: var(--text-2xl);
    font-weight: 700;
    background: linear-gradient(135deg, #4f46e5, #ec4899);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero__stat-label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    font-weight: 500;
}

.hero__demo-container {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-xl);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.hero__demo-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-lg);
    background: rgba(248, 250, 252, 0.8);
    border-bottom: 1px solid var(--color-border-light);
}

.hero__demo-controls {
    display: flex;
    gap: var(--spacing-xs);
}

.hero__demo-control {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.hero__demo-control--red {
    background-color: #ef4444;
}
.hero__demo-control--yellow {
    background-color: #f59e0b;
}
.hero__demo-control--green {
    background-color: #10b981;
}

.hero__demo-title {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-primary);
}

.hero__demo-content {
    padding: var(--spacing-xl);
}

.hero__demo-step {
    margin-bottom: var(--spacing-lg);
}

.hero__demo-step:last-child {
    margin-bottom: 0;
}

.hero__demo-label {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-sm);
}

.hero__code-block {
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: var(--text-sm);
    line-height: 1.6;
    color: #e2e8f0;
    overflow-x: auto;
}

.hero__demo-arrow {
    display: flex;
    justify-content: center;
    margin: var(--spacing-lg) 0;
    color: var(--color-primary);
}

@media (max-width: 1023px) {
    .hero__demo-container {
        max-width: 100%;
    }
}

@media (max-width: 767px) {
    .hero {
        min-height: 80vh;
        padding: var(--spacing-3xl) 0;
    }

    .hero__features {
        grid-template-columns: 1fr;
    }

    .hero__actions {
        flex-direction: column;
        align-items: center;
    }

    .hero__stats {
        justify-content: center;
        gap: var(--spacing-md);
    }

    .hero__stat {
        min-width: 100px;
    }
}
</style>
