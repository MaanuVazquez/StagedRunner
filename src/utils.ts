import path from 'path'
import { exec } from 'child_process'
import { logWarning } from './logger'

import locales from './locale'

export interface PackageJSON {
  name?: string
  author?: string
  version?: string
  description?: string
  license?: string
  scripts?: {
    [scriptName: string]: string
  }
}

export interface Package {
  directory: string
  files: string[]
  json: PackageJSON
}

export interface PackageInfo {
  [packageName: string]: Package
}

export const getPackageInfo = (packagesDirectory: string, stagedFiles: string[]): PackageInfo => {
  const notProperPackages: string[] = []

  return stagedFiles.reduce((accum: PackageInfo, file: string) => {
    if (!file.includes(packagesDirectory)) return accum

    const fileWithoutPackageDirectory = file.replace(`${packagesDirectory}/`, '')
    const packageName = fileWithoutPackageDirectory.slice(0, fileWithoutPackageDirectory.indexOf('/'))
    const packageFullDirectory = path.join(process.cwd(), `${packagesDirectory}/${packageName}`)
    // eslint-disable-next-line
    const packageJson = require(`${packageFullDirectory}/package.json`)

    if (!packageJson) {
      if (notProperPackages.includes(packageName)) return accum

      logWarning(locales.warning.cannotLoadPackageJson(packageName))
      notProperPackages.push(packageName)
    }

    return {
      ...accum,
      [packageName]: {
        directory: accum[packageName]?.directory || packageFullDirectory,
        files: (accum[packageName]?.files || []).concat(file),
        json: accum[packageName]?.json || packageJson
      }
    }
  }, {})
}

export const execPackageManagerScript = (
  packageManager: string,
  scriptName: string,
  packageDirectory: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    return exec(`${packageManager} run ${scriptName}`, { cwd: packageDirectory }, (error, stdout, stderr) => {
      if (error) return reject(error)

      return resolve(stdout || stderr)
    })
  })
}
