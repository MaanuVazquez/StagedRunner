import path from 'path'
import fs from 'fs'
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

export const readPackageJSON = (directory: string): PackageJSON | null => {
  try {
    return JSON.parse(fs.readFileSync(directory, { encoding: 'utf-8' }))
  } catch (error) {
    return null
  }
}

export const getPackageInfo = (packagesDirectory: string, stagedFiles: string[]): PackageInfo => {
  const notProperPackages: string[] = []

  return stagedFiles.reduce((accum: PackageInfo, file: string) => {
    if (!file.includes(packagesDirectory)) return accum

    const fileWithoutPackageDirectory = file.replace(`${packagesDirectory}/`, '')
    const packageName = fileWithoutPackageDirectory.slice(0, fileWithoutPackageDirectory.indexOf('/'))

    if (notProperPackages.includes(packageName)) return accum

    const packageFullDirectory = path.join(process.cwd(), `${packagesDirectory}/${packageName}`)
    const packageJson = readPackageJSON(`${packageFullDirectory}/package.json`)

    if (!packageJson) {
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
    return exec(`${packageManager} run ${scriptName}`, { cwd: packageDirectory }, (error, stdout) => {
      if (error) return reject(stdout)

      return resolve(stdout)
    })
  })
}
