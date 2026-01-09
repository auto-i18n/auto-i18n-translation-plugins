/** 翻译报错对象，目前和普通Error对象没有什么区别，后续可以迭代 */
export class TranslateError extends Error {
    name = 'TranslateError'
    toString() {
        return `${this.name}: ${this.message}`
    }
}

export class IncompleteResultsError extends TranslateError {
    name = 'IncompleteResultsError'
    constructor(expected: number, actual: number, lang: string) {
        super(`❌ 翻译结果不完整【预期数量: ${expected}，实际数量: ${actual}，目标语言: ${lang}】`)
    }
}

/** 统一的返回类型，供插件侧统一输出 */
export interface AutoTranslateResult {
    hasChanges: boolean
    errors: TranslateError[]
}
