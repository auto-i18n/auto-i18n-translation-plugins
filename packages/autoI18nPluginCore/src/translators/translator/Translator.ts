import { IntervalQueue } from './IntervalQueue'

export interface TranslatorOption {
    /** Translator版本，用于做后续的功能迭代 */
    version?: number
    /**
     * 实际的请求方法
     * @param text 被翻译的文本
     * @param fromKey 源语言
     * @param toKey 目标语言
     * @param separator 分隔符
     * @returns 翻译后的文本
     */
    fetchMethod: (
        text: string | string[],
        fromKey: string,
        toKey: string,
        separator: string
    ) => Promise<string | undefined | string[]>
    name: string
    /** 单次最大翻译文本长度 */
    maxChunkSize?: number
    /** 执行间隔（默认不开启） */
    interval?: number
    /**
     * 错误处理函数，主要是打印提示
     * @param err 抛出的异常
     * @param defaultErrorHandler 默认的错误处理函数
     * @returns 如果在这里抛出异常会中断翻译
     */
    onError?: (err: unknown, defaultErrorHandler: (error: unknown) => void) => void
}

export class Translator {
    public option: Required<TranslatorOption>

    public withSeparator: boolean

    constructor(option: TranslatorOption, withSeparator: boolean = true) {
        this.option = this.getResultOption(option)
        this.withSeparator = withSeparator
    }

    private defaultErrorHandler = (error: unknown) => {
        const name = this.option.name
        console.error(`翻译api${name ? `【${name}】` : ''}请求异常：${this.getErrorMessage(error)}`)
    }

    private getResultOption(option: TranslatorOption) {
        const resultOption: Required<TranslatorOption> = {
            version: 1,
            maxChunkSize: 4500, // 目前默认是4500
            interval: 0,
            onError: this.defaultErrorHandler,
            ...option
        }
        if (resultOption.interval) {
            const getIntervalFn = <T extends unknown[], U extends unknown>(
                fn: (...args: T) => U,
                delay: number
            ) => {
                const queue = new IntervalQueue(fn.bind(null), delay)
                return (...args: T) => {
                    return queue.execute(...args)
                }
            }
            resultOption.fetchMethod = getIntervalFn(
                resultOption.fetchMethod,
                resultOption.interval
            )
        }
        return resultOption
    }

    protected getErrorMessage(error: unknown) {
        if (error instanceof Error) {
            return error.message
        } else {
            return String(error)
        }
    }

    async translate(text: string | string[], fromKey: string, toKey: string, separator: string) {
        let result = '' as string | string[] | undefined
        try {
            result = await this.option.fetchMethod(text, fromKey, toKey, separator)
        } catch (error) {
            this.option.onError(error, this.defaultErrorHandler)
        }
        return result
    }
}
