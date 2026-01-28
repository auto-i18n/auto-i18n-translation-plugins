import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Configuration from '@/views/Configuration.vue'
import Translators from '@/views/Translators.vue'
import FAQ from '@/views/FAQ.vue'
import Examples from '@/views/Examples.vue'
import Changelog from '@/views/Changelog.vue'
import Principle from '@/views/Principle.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Auto i18n Translation Plugins - Automatic Internationalization Solution',
      description: 'Powerful Babel-based automatic internationalization plugin for Vue, React, and more. Smart AST transformation, dual-mode support, and multi-translator ecosystem.'
    }
  },
  {
    path: '/principle',
    name: 'Principle',
    component: Principle,
    meta: {
      title: 'How It Works - AST Processing & Translation Pipeline',
      description: 'Deep dive into the AST transformation algorithm, Hash mechanism, smart chunking, and translation pipeline architecture.'
    }
  },
  {
    path: '/configuration',
    name: 'Configuration',
    component: Configuration,
    meta: {
      title: 'Configuration Guide - 30+ Parameters Explained',
      description: 'Complete configuration reference with 30+ parameters, examples, and best practices for fine-tuning your i18n workflow.'
    }
  },
  {
    path: '/translators',
    name: 'Translators',
    component: Translators,
    meta: {
      title: 'Translator Comparison - Choose the Right Service',
      description: 'Compare Youdao, Google, Baidu, Volcengine AI, and custom translators. Setup guides and selection recommendations.'
    }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ,
    meta: {
      title: 'FAQ - Common Issues & Solutions',
      description: 'Answers to frequently asked questions about setup, troubleshooting, and optimization.'
    }
  },
  {
    path: '/examples',
    name: 'Examples',
    component: Examples,
    meta: {
      title: 'Examples & Demos - See It In Action',
      description: 'Live examples, code snippets, and integration guides for Vue, React, and other frameworks.'
    }
  },
  {
    path: '/changelog',
    name: 'Changelog',
    component: Changelog,
    meta: {
      title: 'Changelog & Roadmap - Version History',
      description: 'Complete version history from v1.0.0 to latest, with migration guides and 2025 roadmap.'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Auto i18n Translation Plugins'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', to.meta.description || 'Automatic internationalization solution')
  }
  
  next()
})

export default router