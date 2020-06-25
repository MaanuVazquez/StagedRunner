export default {
  cli: {
    help: `
    Usage
      $ stagedrunner <options>
 
    Options
      --generate-config, -g  Generates stagedRunner default config.
 
    Examples
      $ stagedrunner
    `
  },
  errors: {
    noConfigurationFile: 'You must create an .stagedrunnerrc to start using the script.',
    scriptFailed: (scriptName: string, packageName: string): string =>
      `Script ${scriptName} failed on package ${packageName}.`
  },
  info: {
    runningScript: (scriptName: string, packageName: string): string =>
      `Running script ${scriptName} on package ${packageName}.\n`
  },
  success: {
    scriptRun: (scriptName: string, packageName: string): string =>
      `Script ${scriptName} ran successfully on package ${packageName}.`
  },
  warning: {
    cannotLoadPackageJson: (packageName: string): string =>
      `${packageName} doesn't appear to contain a package.json file, ignoring it.\n`,
    scriptNotFound: (scriptName: string, packageName: string): string =>
      `${scriptName} script was not found in ${packageName}, skipping...\n`
  }
}
