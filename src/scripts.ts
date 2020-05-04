import { getStagedFilesDirectory } from './git'
import { getPackageInfo, execPackageManagerScript } from './utils'
import { getConfig } from './config'
import { handleScriptRunLog } from './logger'

export const runCommands = async (): Promise<void> => {
  const configuration = getConfig()
  const stagedFiles = await getStagedFilesDirectory()
  const packagesInfo = getPackageInfo(configuration.packagesDirectory, stagedFiles)

  for (const pkg of Object.values(packagesInfo)) {
    for (const script of configuration.scripts) {
      const runPackageScript = (): Promise<string> =>
        execPackageManagerScript(configuration.packageManager, script, pkg.directory)

      await handleScriptRunLog(runPackageScript, script, pkg.json.name)
    }
  }
}
