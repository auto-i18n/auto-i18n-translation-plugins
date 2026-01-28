import vitePluginsAutoI18n, { EmptyTranslator } from '../../packages/vitePluginsAutoI18n/src/index'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vitePluginsAutoI18n({
            globalPath: './lang',
            namespace: 'website',
            distPath: './dist/assets',
            distKey: 'index',
            originLang: 'zh-cn',
            targetLangList: ['zh-tw', 'en', 'ja', 'ko', 'ru', 'fr'],
            translator: new EmptyTranslator()
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@/components': path.resolve(__dirname, 'src/components'),
            '@/views': path.resolve(__dirname, 'src/views'),
            '@/data': path.resolve(__dirname, 'src/data'),
            '@/utils': path.resolve(__dirname, 'src/utils'),
            '@/assets': path.resolve(__dirname, 'src/assets')
        }
    },
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false
    }
})
