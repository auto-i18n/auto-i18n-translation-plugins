import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import rsbuildPluginsAutoI18n, { EmptyTranslator } from 'rsbuild-auto-i18n-plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    rsbuildPluginsAutoI18n({
      targetLangList: ['en'],
      translator: new EmptyTranslator({}),
    })
  ],
});
