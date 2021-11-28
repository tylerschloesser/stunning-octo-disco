export interface Config {
  debug: boolean
}

let config: Config = {
  debug: false,
}

export function getConfig(): Config {
  return config
}

export function toggleDebug() {
  config = {
    ...config,
    debug: !config.debug,
  }
}
