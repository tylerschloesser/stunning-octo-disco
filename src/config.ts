export interface Config {
  debug: boolean
}

export function getConfig(): Config {
  return { debug: false }
}
