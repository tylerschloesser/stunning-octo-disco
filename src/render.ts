import { getConfig } from './config'
import { State } from './state'

export function render(
  context: CanvasRenderingContext2D,
  state: State,
  viewport: { w: number; h: number },
) {
  const config = getConfig()
  const { w, h } = viewport
  const size = Math.min(w, h)
  context.clearRect(0, 0, w, h)
  context.fillStyle = '#333'
  context.fillRect(0, 0, w, h)

  state.things.forEach((thing, i) => {
    const { p } = thing

    context.strokeStyle = i === 0 ? 'magenta' : 'cyan'
    context.beginPath()
    context.arc(p.x, p.y, size * 0.02, 0, Math.PI * 2)
    context.closePath()
    context.stroke()

    if (config.debug && thing.target) {
      context.beginPath()
      context.moveTo(p.x, p.y)
      context.lineTo(thing.target.x, thing.target.y)
      context.stroke()
    }

    if (config.debug) {
      context.strokeStyle = 'red'
      const to = p.add(thing.v.normalize().multiply(size * 0.02))
      context.beginPath()
      context.moveTo(p.x, p.y)
      context.lineTo(to.x, to.y)
      context.stroke()
    }
  })

  const { pointer } = state
  if (config.debug && pointer) {
    context.strokeStyle = 'white'
    context.beginPath()
    context.arc(pointer.p.x, pointer.p.y, size * 0.16, 0, Math.PI * 2)
    context.closePath()
    context.stroke()
  }
}
