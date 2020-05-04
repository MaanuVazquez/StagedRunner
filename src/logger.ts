import chalk from 'chalk'
import ora from 'ora'

import locale from './locale'

export const logError = (message: string): void => {
  console.error(chalk.bgRed(message))
}

export const logWarning = (message: string): void => {
  console.warn(chalk.bgYellow(message))
}

export const logSuccess = (message: string): void => {
  console.log(chalk.green(message))
}

export const handleScriptRunLog = async (
  scriptRunFunction: () => Promise<string>,
  script: string,
  packageName: string
): Promise<void> => {
  const spinner = ora()
  try {
    spinner.start(locale.info.runningScript(script, packageName))

    const scriptOutput = await scriptRunFunction()

    console.log(scriptOutput)
    spinner.succeed(locale.success.scriptRun(script, packageName))

    logSuccess(locale.success.scriptRun(script, packageName))
  } catch (error) {
    console.error(error.message)
    spinner.fail(locale.errors.scriptFailed(script, packageName))
    process.exit(1)
  }
}
