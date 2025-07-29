/*
 * @Author: xiaoshanwen
 * @Date: 2023-10-12 18:18:51
 * @LastEditTime: 2025-03-31 02:28:53
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/filter/visitor/StringLiteral.ts
 */
import { baseUtils, splitUtils } from 'src/utils'
import { TranslateTypeEnum } from 'src/enums'
import { PluginObj } from '@babel/core'
import { InsertOption } from '../type'
import * as types from '@babel/types'
import { option } from 'src/option'

export default function (insertOption?: InsertOption): PluginObj['visitor']['StringLiteral'] {
    return function (path) {
        // 半自动不走节点编辑逻辑
        if (option.translateType === TranslateTypeEnum.SEMI_AUTO) {
            return
        }
        let { node, parent } = path
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
            // import 'string'
            if (types.isImportDeclaration(parent)) return
            // a.b.c('string') || a('string')
            // ! 不兼容 a.b['c']('string') || a.b[`c`]('string')
            if (types.isCallExpression(parent)) {
                // 获取真实调用函数 a.b.c
                const extractFnName = baseUtils.extractFunctionName(parent)
                const pass = option.excludedCall.some(call => {
                    return extractFnName === call || extractFnName.endsWith('.' + call)
                })
                if (pass) return
            }

            let replaceNode
            if (option.deepScan && splitUtils.checkNeedSplit(value)) {
                replaceNode = splitUtils.convertToTemplateLiteral(
                    splitUtils.splitByRegex(value, baseUtils.getOriginRegex()),
                    insertOption
                )
            } else if (types.isJSXAttribute(parent)) {
                let expression = baseUtils.createI18nTranslator({
                    insertOption,
                    value,
                    returnExpression: true
                })
                replaceNode = types.jSXExpressionContainer(expression)
            } else {
                replaceNode = baseUtils.createI18nTranslator({
                    insertOption,
                    value,
                    returnExpression: true
                })
            }
            path.replaceWith(replaceNode)
        }
    }
}
