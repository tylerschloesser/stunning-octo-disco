import WebFont from 'webfontloader'
import { render } from './render'

const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!

const scale = window.devicePixelRatio ?? 1
context.scale(scale, scale)

const rect = canvas.getBoundingClientRect()
canvas.height = rect.height * scale
canvas.width = rect.width * scale

window.onresize = () => {
  const rect = canvas.getBoundingClientRect()
  canvas.height = rect.height
  canvas.width = rect.width
}

let lastTick: null | number = null

function onFrame(timestamp: number) {
  if (lastTick === null) {
    lastTick = timestamp
  }

  render(context, canvas)

  window.requestAnimationFrame(onFrame)
}

WebFont.load({
  google: {
    families: ['Space Mono'],
  },
  active: () => {
    window.requestAnimationFrame(onFrame)
  },
  inactive: () => {
    alert('Failed to load fonts')
  },
})
