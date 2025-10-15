import rsbuildPluginsAutoI18n, { EmptyTranslator } from 'rsbuild-auto-i18n-plugin'
import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rsbuild/core'

export default defineConfig({
    plugins: [
        pluginReact(),
        rsbuildPluginsAutoI18n({
            targetLangList: ['en'],
            translator: new EmptyTranslator({})
        })
    ]
})
