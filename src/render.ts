import { State } from './state'
import { Vec2 } from './vec2'

export function render(
  context: CanvasRenderingContext2D,
  state: State,
  viewport: { w: number; h: number },
) {
  const { w, h } = viewport
  const size = Math.min(w, h)
  context.clearRect(0, 0, w, h)
  context.fillStyle = '#333'
  context.fillRect(0, 0, w, h)

  state.things.forEach((thing) => {
    const { p } = thing

    context.strokeStyle = 'cyan'
    context.beginPath()
    context.arc(p.x, p.y, size * 0.02, 0, Math.PI * 2)
    context.closePath()
    context.stroke()

    if (thing.target) {
      context.beginPath()
      context.moveTo(p.x, p.y)
      context.lineTo(thing.target.x, thing.target.y)
      context.stroke()
    }

    {
      context.strokeStyle = 'red'
      const to = p.add(thing.v.normalize().multiply(size * 0.02))
      context.beginPath()
      context.moveTo(p.x, p.y)
      context.lineTo(to.x, to.y)
      context.stroke()
    }
  })

  const { pointer } = state
  if (pointer) {
    context.strokeStyle = 'white'
    context.beginPath()
    context.arc(pointer.x, pointer.y, size * 0.16, 0, Math.PI * 2)
    context.closePath()
    context.stroke()
  }
}
