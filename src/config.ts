export interface Config {
  debug: boolean
}

let config: Config = {
  debug: false,
}

export function getConfig(): Config {
  return config
}
