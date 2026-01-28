export const TypeEnum = {
    CORE: 'core',
    PLUGIN: 'plugin',
    WEBSITE: 'website'
}

export const PluginTypeEnum = {
    WEBPACK: 'webpack',
    VITE: 'vite',
    RSBUILD: 'rsbuild'
}

export const TypeDirNameMap = {
    [TypeEnum.CORE]: 'autoI18nPluginCore',
    [PluginTypeEnum.WEBPACK]: 'webpackPluginsAutoI18n',
    [PluginTypeEnum.VITE]: 'vitePluginsAutoI18n',
    [PluginTypeEnum.RSBUILD]: 'rsbuildPluginsAutoI18n',
    [TypeEnum.WEBSITE]: 'website'
}
