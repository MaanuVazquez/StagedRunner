import meow, { TypedFlags, AnyFlags } from 'meow'

import { createConfig } from './config'
import { runCommands } from './scripts'

import locale from './locale'

const cliExec = (flags: TypedFlags<AnyFlags>): void => {
  if (flags.generateConfig) {
    return createConfig()
  }

  runCommands()
}

export default (): void => {
  const { flags } = meow(locale.cli.help, {
    flags: {
      generateConfig: {
        type: 'boolean',
        alias: 'g'
      }
    }
  })

  cliExec(flags)
}
