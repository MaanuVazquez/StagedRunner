import { getStagedFilesDirectory } from './git'
import { getPackageInfo, execPackageManagerScript, PackageJSON } from './utils'
import { getConfig } from './config'
import ora from 'ora'
import { logSuccess, logWarning } from './logger'
import locale from './locale'

const handleScriptRun = async (
  scriptRunFunction: () => Promise<string>,
  script: string,
  packageJSON: PackageJSON
): Promise<void> => {
  const spinner = ora()
  const packageName = packageJSON?.name || 'Unknown'

  if (!packageJSON?.scripts || !packageJSON.scripts[script]) {
    logWarning(locale.warning.scriptNotFound(script, packageName))
    spinner.clear()
    return
  }

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

export const runCommands = async (): Promise<void> => {
  const configuration = getConfig()
  const stagedFiles = await getStagedFilesDirectory()
  const packagesInfo = getPackageInfo(configuration.packagesDirectory, stagedFiles)

  for (const pkg of Object.values(packagesInfo)) {
    for (const script of configuration.scripts) {
      const runPackageScript = (): Promise<string> => {
        return execPackageManagerScript(configuration.packageManager, script, pkg.directory)
      }

      await handleScriptRun(runPackageScript, script, pkg.json)
    }
  }
}
