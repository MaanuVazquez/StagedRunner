import fs from 'fs'

export interface StagedRunnerConfiguration {
  packageManager: string
  packagesDirectory: string
  scripts: string[]
}

const CONFIGURATION_PATH = './.stagedrunnerrc'

const DEFAULT_CONFIGURATION: StagedRunnerConfiguration = {
  packageManager: 'npm',
  packagesDirectory: 'packages',
  scripts: []
}

let currentConfiguration: StagedRunnerConfiguration

export const getConfig = (): StagedRunnerConfiguration => {
  if (currentConfiguration) return currentConfiguration

  const file = fs.readFileSync(CONFIGURATION_PATH, { encoding: 'utf-8' })
  const parsedFile = JSON.parse(file)

  if (!parsedFile.scripts || !parsedFile.scripts.length) throw Error('No scripts specified')

  const generatedConfiguration = {
    ...DEFAULT_CONFIGURATION,
    ...parsedFile
  }

  currentConfiguration = generatedConfiguration

  return generatedConfiguration
}

export const createConfig = (): void => {
  fs.writeFileSync(CONFIGURATION_PATH, JSON.stringify(DEFAULT_CONFIGURATION, null, 2), {
    encoding: 'utf-8'
  })
}
