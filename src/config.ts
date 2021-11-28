export interface Config {
  debug: boolean
}

let config: Config = {
  debug: false,
}

try {
  const configJson = localStorage.getItem('config')
  if (configJson) {
    config = JSON.parse(configJson)
  }
} catch (e) {
  console.log('failed to read config', e)
}

export function getConfig(): Config {
  return config
}

function setConfig(next: Config) {
  try {
    localStorage.setItem('config', JSON.stringify(next))
  } catch (e) {
    console.log('failed to save config', e)
  }
  config = next
}

export function toggleDebug() {
  setConfig({
    ...config,
    debug: !config.debug,
  })
}
