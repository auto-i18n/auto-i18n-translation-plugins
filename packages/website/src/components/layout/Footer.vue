<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__content">
        <div class="footer__brand">
          <div class="footer__logo">
            <span class="footer__logo-icon">🌐</span>
            <span class="footer__logo-text">自动国际化翻译插件</span>
          </div>
          <p class="footer__description">
            基于Babel的强大自动国际化解决方案，支持Vue、React等多种框架。
          </p>
        </div>

        <div class="footer__links">
          <div class="footer__column">
            <h3 class="footer__heading">产品</h3>
            <ul class="footer__list">
              <li><router-link to="/principle" class="footer__link">工作原理</router-link></li>
              <li><router-link to="/configuration" class="footer__link">配置指南</router-link></li>
              <li><router-link to="/translators" class="footer__link">翻译器对比</router-link></li>
              <li><router-link to="/examples" class="footer__link">示例演示</router-link></li>
            </ul>
          </div>

          <div class="footer__column">
            <h3 class="footer__heading">资源</h3>
            <ul class="footer__list">
              <li><router-link to="/faq" class="footer__link">常见问题</router-link></li>
              <li><router-link to="/changelog" class="footer__link">更新日志</router-link></li>
              <li><a href="https://www.npmjs.com/package/auto-i18n-translation-plugins" target="_blank" rel="noopener noreferrer" class="footer__link">npm包</a></li>
              <li><a href="https://juejin.cn/post/7352890363377811463" target="_blank" rel="noopener noreferrer" class="footer__link">技术博客</a></li>
            </ul>
          </div>

          <div class="footer__column">
            <h3 class="footer__heading">社区</h3>
            <ul class="footer__list">
              <li><a href="https://github.com/xiaoshan5733/auto-i18n-translation-plugins" target="_blank" rel="noopener noreferrer" class="footer__link">GitHub</a></li>
              <li><a href="https://github.com/xiaoshan5733/auto-i18n-translation-plugins/issues" target="_blank" rel="noopener noreferrer" class="footer__link">问题反馈</a></li>
              <li><a href="https://github.com/xiaoshan5733/auto-i18n-translation-plugins/discussions" target="_blank" rel="noopener noreferrer" class="footer__link">讨论区</a></li>
              <li><a href="https://github.com/xiaoshan5733/auto-i18n-translation-plugins/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" class="footer__link">贡献指南</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <div class="footer__bottom-content">
          <p class="footer__copyright">
            © {{ currentYear }} 自动国际化翻译插件。由 
            <a href="https://github.com/xiaoshan5733" target="_blank" rel="noopener noreferrer" class="footer__author-link">
              xiaoshan5733
            </a>
            创建
          </p>
          
          <div class="footer__social">
            <a 
              href="https://github.com/xiaoshan5733/auto-i18n-translation-plugins" 
              target="_blank" 
              rel="noopener noreferrer"
              class="footer__social-link"
              aria-label="GitHub 仓库"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            
            <a 
              href="https://www.npmjs.com/package/auto-i18n-translation-plugins" 
              target="_blank" 
              rel="noopener noreferrer"
              class="footer__social-link"
              aria-label="npm 包"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border-light);
  margin-top: auto;
  padding: var(--spacing-5xl) 0 var(--spacing-xl);
}

.footer__content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-3xl);
}

@media (min-width: 768px) {
  .footer__content {
    grid-template-columns: 2fr 3fr;
    gap: var(--spacing-5xl);
  }
}

.footer__brand {
  max-width: 320px;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.footer__logo-icon {
  font-size: var(--text-2xl);
}

.footer__logo-text {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.footer__description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.footer__links {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
}

@media (min-width: 640px) {
  .footer__links {
    grid-template-columns: repeat(3, 1fr);
  }
}

.footer__column {
  min-width: 0;
}

.footer__heading {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-md);
}

.footer__list {
  list-style: none;
}

.footer__list li {
  margin-bottom: var(--spacing-sm);
}

.footer__link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
}

.footer__link:hover {
  color: var(--color-primary);
}

.footer__bottom {
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}

.footer__bottom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  text-align: center;
}

@media (min-width: 640px) {
  .footer__bottom-content {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.footer__copyright {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.footer__author-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.footer__author-link:hover {
  color: var(--color-primary-hover);
}

.footer__social {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.footer__social-link:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}
</style>