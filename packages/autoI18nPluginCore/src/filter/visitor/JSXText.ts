/*
 * @Author: xiaoshanwen
 * @Date: 2023-11-01 16:35:38
 * @LastEditTime: 2025-03-16 18:24:44
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/filter/visitor/JSXText.ts
 */
import { TranslateTypeEnum } from 'src/enums'
import { PluginObj } from '@babel/core'
import { InsertOption } from '../type'
import * as types from '@babel/types'
import { baseUtils } from 'src/utils'
import { option } from 'src/option'

export default function (insertOption?: InsertOption): PluginObj['visitor']['JSXText'] {
    return function (path) {
        if (option.translateType === TranslateTypeEnum.SEMI_AUTO) {
            return
        }

        let { node } = path
        let value = node.value
        // 定义一个包含亚洲语言代码的数组
        const asianLangs = ['zh-cn', 'ja', 'ko']
        if (
            asianLangs.some(lang => option.originLang.includes(lang) || option.originLang === lang)
        ) {
            try {
                value = baseUtils.unicodeToString(value)
            } catch (error) {
                console.log('转换异常')
            }
        }
        if (
            baseUtils.hasOriginSymbols(value) &&
            !baseUtils.checkAgainstRegexArray(value, [...option.excludedPattern])
        ) {
            // 生成翻译节点
            let expression = baseUtils.createI18nTranslator({
                insertOption,
                value,
                returnExpression: true
            })
            // 生成的翻译节点包装在  types.JSXExpressionContainer  中
            let newNode = types.jSXExpressionContainer(expression)
            // 使用  path.replaceWith  方法将原来的节点替换为新的翻译节点
            path.replaceWith(newNode)
        }
    }
}
