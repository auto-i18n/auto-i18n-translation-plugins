/*
 * @Author: xiaoshanwen
 * @Date: 2023-10-12 18:18:51
 * @LastEditTime: 2025-03-16 15:17:30
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/filter/visitor/CallExpression.ts
 */
import { baseUtils, translateUtils } from 'src/utils'
import { TranslateTypeEnum } from 'src/enums'
import { PluginObj } from '@babel/core'
import * as types from '@babel/types'
import { option } from 'src/option'

// 收集翻译对象
export default function (insertOption: any): PluginObj['visitor']['CallExpression'] {
    return function (path) {
        let { node } = path
        // 提取公共部分，减少重复访问 node.callee 属性
        const callee = node.callee

        if (
            (types.isIdentifier(callee) && callee.name === option.translateKey) ||
            (types.isMemberExpression(callee) &&
                types.isIdentifier(callee.property) &&
                callee.property.name === option.translateKey) // 拓展 半自动模式下的 如 a.b.c() 调用
        ) {
            if (option.translateType === TranslateTypeEnum.SEMI_AUTO) {
                // 获取当前翻译函数的参数
                let arg = node.arguments || []
                // 如果参数数量不为 1，则直接返回
                if (arg.length === 1) {
                    const value = 'value' in arg[0] ? String(arg[0].value) : ''
                    // 生成真实调用函数
                    const replaceNode = baseUtils.createI18nTranslator({
                        insertOption,
                        value,
                        returnExpression: true
                    })
                    path.replaceWith(replaceNode)
                    translateSetLang(replaceNode)
                }
            } else if (option.translateType === TranslateTypeEnum.FULL_AUTO) {
                // 全自动模式下还是只收集 单独 $t 调用
                translateSetLang(node)
            }
        }
    }
}

/**
 * @description: 处理翻译并设置语言对象属性
 * @param node - 调用表达式节点
 * @return
 */
function translateSetLang(node: types.CallExpression) {
    // 获取调用表达式的参数
    let arg = node.arguments || []
    // 提取参数作为值
    // 检查参数是否为字符串字面量
    const id = types.isStringLiteral(arg[0]) ? arg[0].value : ''
    const value = types.isStringLiteral(arg[1]) ? arg[1].value : ''
    // 检查 ID 和值是否存在
    if (id && value) {
        // 调用翻译工具的 setLangObj 方法设置语言对象属性
        translateUtils.setLangObj(id, value)
    }
}
