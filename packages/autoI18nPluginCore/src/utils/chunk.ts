/*
 * @Date: 2025-02-17 17:11:26
 * @LastEditors: xiaoshan
 * @LastEditTime: 2025-02-17 18:00:37
 * @FilePath: /i18n_translation_vite/packages/autoI18nPluginCore/src/utils/chunk.ts
 */
import { SEPARATOR } from './translate'

/**
 * 智能文本分块处理器
 * @param values 待分块的原始文本数组
 * @param maxChunkSize 最大分块长度
 * @param withSeparator 是否使用分隔符合并文本
 * - true: 返回使用分隔符合并的字符串数组 ['text1<sep>text2', 'text3<sep>text4']
 * - false: 返回二维字符串数组 [['text1', 'text2'], ['text3', 'text4']]
 * @returns 根据withSeparator返回不同格式的分块结果
 *
 * 功能特性：
 * 1. 自动合并小文本为最大可能块
 * 2. 处理超长文本并给出警告
 * 3. 保证块长度不超过限制
 * 4. 保留原始顺序和分隔符语义
 * 5. 支持两种输出格式:
 *    - 使用分隔符的合并字符串
 *    - 不使用分隔符的字符串数组
 */
export function createTextSplitter(values: string[], maxChunkSize: number, withSeparator = true) {
    // 分隔符定义（用于合并/拆分时保持语义）
    const SEP_LENGTH = SEPARATOR.length

    const result: (string | string[])[] = []
    let buffer: string[] = [] // 当前累积块缓冲区
    let currentSize = 0 // 当前缓冲区字符数

    /**
     * 提交缓冲区内容到结果集
     * - 将缓冲区内容用分隔符连接或作为数组
     * - 重置缓冲区和计数器
     */
    const commitBuffer = () => {
        if (buffer.length > 0) {
            if (withSeparator) {
                const joinedText = buffer.join(SEPARATOR)
                if (joinedText.length > maxChunkSize) {
                    console.warn(`缓冲区提交异常：生成块长度 ${joinedText.length} 超过限制`)
                }
                ;(result as string[]).push(joinedText)
            } else {
                ;(result as string[][]).push([...buffer])
            }
            buffer = []
            currentSize = 0
        }
    }

    // 主处理循环：遍历所有原始文本项
    for (const value of values) {
        // 计算需要新增的空间：文本长度 + 可选的分隔符长度
        const neededSpace = value.length + (withSeparator && buffer.length > 0 ? SEP_LENGTH : 0)

        // ─── 超长文本处理策略 ───
        if (value.length > maxChunkSize) {
            // 优先提交现有缓冲区内容
            if (buffer.length > 0) commitBuffer()

            if (value.length > maxChunkSize * 1.5) {
                console.warn(
                    `超长文本告警：检测到长度 ${value.length} 字符的文本项，可能影响翻译质量`
                )
            }
            // 结果直接新增一个超长文本
            if (withSeparator) {
                ;(result as string[]).push(value)
            } else {
                ;(result as string[][]).push([value])
            }
            continue
        }

        // ─── 正常分块逻辑 ───
        // 空间不足时提交当前缓冲区
        if (currentSize + neededSpace > maxChunkSize) {
            commitBuffer()
        }

        // 更新缓冲区状态
        currentSize += neededSpace
        buffer.push(value)
    }

    // 提交最终未完成的缓冲区内容
    commitBuffer()

    // 返回分块结果
    return result
}
