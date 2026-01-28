<template>
    <header class="header" :class="{ 'header--scrolled': isScrolled }">
        <div class="container">
            <nav class="nav" role="navigation">
                <div class="nav__brand">
                    <router-link to="/" class="nav__logo">
                        <span class="nav__logo-icon">🌐</span>
                        <span class="nav__logo-text">自动国际化</span>
                    </router-link>
                </div>

                <ul class="nav__list">
                    <li v-for="item in navigationItems" :key="item.name" class="nav__item">
                        <router-link
                            :to="item.path"
                            class="nav__link"
                            :class="{ 'nav__link--active': $route.path === item.path }"
                        >
                            {{ item.name }}
                        </router-link>
                    </li>
                </ul>

                <div class="nav__actions">
                        <a-dropdown :trigger="['click']" placement="bottomRight">
                            <a-button type="text" class="nav__lang-btn">
                                <span class="nav__lang-icon">🌐</span>
                                <span class="nav__lang-text">{{ currentLangLabel }}</span>
                                <span class="nav__lang-arrow">▼</span>
                            </a-button>
                            <template #overlay>
                                <a-menu @click="handleLangChange" class="nav__lang-menu">
                                    <a-menu-item v-for="lang in languages" :key="lang.code">
                                        <span :class="{ 'active-lang': currentLang === lang.code }">
                                            {{ currentLang === lang.code ? '✓ ' : '' }}{{ lang.label }}
                                        </span>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>

                        <a
                            href="https://github.com/auto-i18n/auto-i18n-translation-plugins"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn btn-secondary btn-sm nav__github"
                            aria-label="在GitHub上查看"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                            GitHub
                        </a>

                    <button
                        class="nav__toggle"
                        @click="toggleMobileMenu"
                        :aria-expanded="isMobileMenuOpen"
                        aria-label="切换导航菜单"
                    >
                        <span class="nav__toggle-line"></span>
                        <span class="nav__toggle-line"></span>
                        <span class="nav__toggle-line"></span>
                    </button>
                </div>
            </nav>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            isScrolled: false,
            isMobileMenuOpen: false,
            currentLang: localStorage.getItem('lang') || 'zh-cn',
            languages: [
                { code: 'zh-cn', label: '简体中文' },
                { code: 'zh-tw', label: '繁體中文' },
                { code: 'en', label: 'English' },
                { code: 'ja', label: '日本語' },
                { code: 'ko', label: '한국어' },
                { code: 'ru', label: 'Русский' },
                { code: 'fr', label: 'Français' }
            ],
            navigationItems: [
                { name: '首页', path: '/' },
                { name: '工作原理', path: '/principle' },
                { name: '配置指南', path: '/configuration' },
                { name: '翻译器对比', path: '/translators' },
                { name: '示例演示', path: '/examples' },
                { name: '常见问题', path: '/faq' },
                { name: '更新日志', path: '/changelog' }
            ]
        }
    },
    computed: {
        currentLangLabel() {
            const lang = this.languages.find(l => l.code === this.currentLang)
            return lang ? lang.label : '简体中文'
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll)
        window.addEventListener('resize', this.handleResize)
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
        window.removeEventListener('resize', this.handleResize)
    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 20
        },
        handleResize() {
            if (window.innerWidth >= 768) {
                this.isMobileMenuOpen = false
            }
        },
        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen
        },
        closeMobileMenu() {
            this.isMobileMenuOpen = false
        },
        handleLangChange({ key }) {
            this.currentLang = key
            localStorage.setItem('lang', key)
            if (window.$changeLang) {
                window.$changeLang(key)
            }
            window.location.reload()
        }
    }
}
</script>

<style scoped>
.header {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: var(--color-bg-primary);
    border-bottom: 1px solid var(--color-border-light);
    transition: all var(--transition-fast);
}

.header--scrolled {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    box-shadow: var(--shadow-sm);
}

.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    position: relative;
}

.nav__brand {
    flex-shrink: 0;
    z-index: 2;
}

.nav__logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    text-decoration: none;
    color: var(--color-text-primary);
    font-weight: 600;
    font-size: var(--text-lg);
    transition: color var(--transition-fast);
}

.nav__logo:hover {
    color: var(--color-primary);
}

.nav__logo-icon {
    font-size: var(--text-xl);
}

.nav__list {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav__link {
    position: relative;
    padding: var(--spacing-sm) 0;
    text-decoration: none;
    color: var(--color-text-secondary);
    font-weight: 500;
    font-size: var(--text-sm);
    transition: color var(--transition-fast);
    white-space: nowrap;
}

.nav__link:hover,
.nav__link--active {
    color: var(--color-primary);
}

.nav__link--active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--color-primary);
}

.nav__actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    z-index: 2;
}

.nav__lang-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px !important;
    height: auto !important;
    color: var(--color-text-secondary) !important;
    border: 1px solid var(--color-border-light) !important;
    border-radius: 6px !important;
    transition: all 0.2s !important;
}

.nav__lang-btn:hover {
    color: var(--color-primary) !important;
    border-color: var(--color-primary) !important;
    background: rgba(79, 70, 229, 0.05) !important;
}

.nav__lang-icon {
    font-size: 16px;
}

.nav__lang-text {
    font-size: 14px;
    font-weight: 500;
}

.nav__lang-arrow {
    font-size: 10px;
    opacity: 0.6;
}

.nav__lang-menu {
    min-width: 160px;
}

.nav__github {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.active-lang {
    color: var(--color-primary);
    font-weight: 600;
}

.nav__toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    gap: 4px;
}

.nav__toggle-line {
    width: 18px;
    height: 2px;
    background-color: var(--color-text-primary);
    transition: all var(--transition-fast);
    transform-origin: center;
}

@media (max-width: 767px) {
    .nav__menu {
        position: fixed;
        top: 4rem;
        left: 0;
        right: 0;
        background-color: var(--color-bg-primary);
        border-bottom: 1px solid var(--color-border-light);
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        padding: var(--spacing-lg);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-normal);
    }

    .nav__menu--open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }

    .nav__list {
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        margin-bottom: var(--spacing-lg);
    }

    .nav__item {
        border-bottom: 1px solid var(--color-border-light);
    }

    .nav__item:last-child {
        border-bottom: none;
    }

    .nav__link {
        display: block;
        padding: var(--spacing-md) 0;
        font-size: var(--text-base);
    }

    .nav__link--active::after {
        display: none;
    }

    .nav__actions {
        justify-content: center;
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--color-border-light);
    }

    .nav__toggle {
        display: flex;
    }

    .nav__menu--open .nav__toggle-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .nav__menu--open .nav__toggle-line:nth-child(2) {
        opacity: 0;
    }

    .nav__menu--open .nav__toggle-line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
}

@media (prefers-color-scheme: dark) {
    .header--scrolled {
        background-color: rgba(17, 24, 39, 0.95);
    }
}
</style>
