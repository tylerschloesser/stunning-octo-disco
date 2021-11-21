import { State } from './state'
import { Vec2 } from './vec2'

export function render(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: State,
) {
  const w = canvas.width
  const h = canvas.height
  context.clearRect(0, 0, w, h)
  context.fillStyle = '#333'
  context.fillRect(0, 0, w, h)

  state.things.forEach((thing) => {
    const p = new Vec2(thing.p.x * (w / 100), thing.p.y * (h / 100))

    context.strokeStyle = 'cyan'
    context.beginPath()
    context.arc(p.x, p.y, 4, 0, Math.PI * 2)
    context.closePath()
    context.stroke()

    if (thing.target) {
      context.beginPath()
      context.moveTo(p.x, p.y)
      context.lineTo(thing.target.x, thing.target.y)
      context.stroke()
    }
  })

  const { pointer } = state
  if (pointer) {
    context.strokeStyle = 'white'
    context.beginPath()
    context.arc(pointer.x, pointer.y, 40, 0, Math.PI * 2)
    context.closePath()
    context.stroke()
  }
}
