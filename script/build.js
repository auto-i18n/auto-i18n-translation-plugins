/*
 * @Date: 2024-12-07 16:03:52
 * @LastEditors: xiaoshan
 * @LastEditTime: 2025-02-10 19:18:47
 * @FilePath: /i18n_translation_vite/script/build.js
 */
// @ts-check
import { PluginTypeEnum, TypeDirNameMap, TypeEnum } from './enums.js'
import { select } from '@inquirer/prompts' // 使用 import 引入 select 函数
import { promisify } from 'node:util'
import shell from 'shelljs' // 使用 import 引入 shelljs 模块

const parseArgsToMap = () => {
    const args = new Map()

    process.argv.forEach(arg => {
        const [key, value] = arg.split('=')
        args.set(key, value)
    })
    return args
}

// 解析命令行参数
const argMap = parseArgsToMap()

const run = async () => {
    // 自带指令 d 标识开发模式
    const isDev = argMap.has('d')

    /**
     * 打包指定包
     * @param {string} packageName
     * @returns {Promise<string>}
     */
    const buildPackage = async packageName => {
        const originalDir = process.cwd()
        try {
            shell.cd(`packages/${packageName}`)
            shell.cp('../../readme*', '.')
            const buildCmd = 'pnpm build' + (isDev ? ' -w' : '')
            if (isDev) {
                shell.exec(buildCmd, { async: true })
                return Promise.resolve(`正在启动 ${packageName} 的 watch 模式...`)
            } else {
                const result = await new Promise((resolve, reject) => {
                    shell.exec(buildCmd, { async: false }, (code, stdout, stderr) => {
                        if (code === 0) {
                            resolve(`${packageName} 打包成功`)
                        } else {
                            reject(new Error(stderr))
                        }
                    })
                })
                return result
            }
        } finally {
            shell.cd(originalDir)
        }
    }

    const choices = Object.values(PluginTypeEnum).map(pluginType => {
        return {
            name: pluginType,
            value: TypeDirNameMap[pluginType]
        }
    })
    choices.unshift({ name: 'all', value: 'all' })
    let choicePackage
    // 自带指令 p 标识指定插件类型
    if (argMap.has('p')) {
        choicePackage = choices.find(choice => choice.name === argMap.get('p'))?.value
    }
    if (!choicePackage) {
        choicePackage = await select({
            message: 'please select plugin type ——',
            choices,
            default: choices[0].value
        }).catch(() => {})
        if (!choicePackage) return
    }
    let packageNames = [choicePackage]
    if (choicePackage === 'all') {
        packageNames = Object.values(PluginTypeEnum).map(pluginType => TypeDirNameMap[pluginType])
    }
    packageNames.unshift(TypeDirNameMap[TypeEnum.CORE]) // 需要先打包core，所以放在最前面

    const startTimeStamp = Date.now()

    for (const packageName of packageNames) {
        console.info(`开始${isDev ? '启动' : '打包'} ${packageName} ...`)
        const msg = await buildPackage(packageName)
        console.info(msg)
    }

    if (isDev) {
        // 开发模式下保持进程运行
        process.stdin.resume()
    } else {
        console.info(`打包完成，耗时：${(Date.now() - startTimeStamp) / 1000}秒`)
    }
}

run()
