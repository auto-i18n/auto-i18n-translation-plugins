/*
 * @Author: xiaoshanwen
 * @Date: 2023-11-01 16:35:38
 * @LastEditTime: 2025-03-31 02:29:02
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/filter/visitor/TemplateElement.ts
 */
import { baseUtils, translateUtils } from 'src/utils'
import { TranslateTypeEnum } from 'src/enums'
import { PluginObj } from '@babel/core'
import { option } from 'src/option'
import types from '@babel/types'

// 定义一个包含亚洲语言代码的数组
const asianLangs = ['zh-cn', 'ja', 'ko']

export default function (insertOption?: any): PluginObj['visitor']['TemplateLiteral'] {
    return function (path) {
        // 如果是半自动翻译，不做处理
        if (option.translateType === TranslateTypeEnum.SEMI_AUTO) {
            return
        }
        let { node, parent }: { node: types.TemplateLiteral; parent: types.Node } = path

        if (!node.quasis.length) return

        // 获取真实调用函数
        const extractFnName = baseUtils.extractFunctionName(parent)

        // 调用语句判断当前调用语句是否包含需要过滤的调用语句
        if (
            types.isCallExpression(parent) &&
            extractFnName &&
            (option.excludedCall.includes(extractFnName) ||
                (extractFnName?.split('.')?.pop() &&
                    option.excludedCall.includes(extractFnName?.split('.')?.pop() || '')))
        )
            return

        node.quasis.forEach(item => handleTemplateElement(item, insertOption))
    }
}

// 处理模板元素
function handleTemplateElement(node: types.TemplateElement, insertOption: any) {
    let value = node.value.raw || node.value.cooked // 获取模板字符串的值
    if (asianLangs.some(lang => option.originLang.includes(lang) || option.originLang === lang)) {
        try {
            value = baseUtils.unicodeToString(value || '')
        } catch (error) {
            console.log('转换异常')
        }
    }
    // 是否存在来源语言字符，是否在默认字符串中，是否包含过滤字段
    if (
        value &&
        baseUtils.hasOriginSymbols(value) &&
        option.excludedPattern.length &&
        !baseUtils.checkAgainstRegexArray(value, [...option.excludedPattern])
    ) {
        // 生成字符类型翻译节点
        let newNode = baseUtils.createI18nTranslator({
            insertOption,
            value
        })

        // 替换为字符类型翻译节点
        node.value.raw = node.value.cooked = `\${${newNode}}`

        let id = baseUtils.generateId(value)

        if (id && value) {
            translateUtils.setLangObj(id, value)
        }
    }
}
