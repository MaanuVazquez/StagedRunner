import chalk from 'chalk'

export const logError = (message: string): void => {
  console.error(chalk.bgRed(message))
}

export const logWarning = (message: string): void => {
  console.warn(chalk.bgYellow(message))
}

export const logSuccess = (message: string): void => {
  console.log(chalk.green(message))
}
