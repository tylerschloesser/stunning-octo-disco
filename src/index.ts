import WebFont from 'webfontloader'
import { render } from './render'

const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!

const scale = window.devicePixelRatio ?? 1
context.scale(scale, scale)

const rect = canvas.getBoundingClientRect()
canvas.height = rect.height * scale
canvas.width = rect.width * scale

const resizeObserver = new ResizeObserver((entries) => {
  console.assert(
    entries.length === 1,
    `resize observer callback received ${entries.length} entries`,
  )
  const { contentRect } = entries[0]
  canvas.height = contentRect.height
  canvas.width = contentRect.width
})
resizeObserver.observe(canvas)

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
