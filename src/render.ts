import { Pointer } from './input'
import { State } from './state'

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
    context.strokeStyle = 'cyan'
    context.beginPath()
    context.arc(thing.p.x * (w / 100), thing.p.y * (h / 100), 4, 0, Math.PI * 2)
    context.closePath()
    context.stroke()
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
