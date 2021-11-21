import WebFont from 'webfontloader'
import { render } from './render'
import { getPointer } from './input'
import { init, tick } from './state'

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

let viewport = { w: rect.width, h: rect.height }
let state = init(viewport)

function onFrame(timestamp: number) {
  const w = canvas.width
  const h = canvas.height
  let dt = 0
  if (lastTick !== null) {
    dt = Math.max(timestamp - lastTick, 1000 / 60)
  }
  lastTick = timestamp
  const pointer = getPointer()
  state = tick(state, pointer, dt, viewport)
  render(context, state, viewport)
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
