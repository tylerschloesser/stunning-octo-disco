import { Pointer } from './input'

export function render(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  pointer: Pointer | null,
) {
  const w = canvas.width
  const h = canvas.height
  context.clearRect(0, 0, w, h)
  context.fillStyle = '#333'
  context.fillRect(0, 0, w, h)

  if (pointer) {
    context.strokeStyle = 'white'
    context.beginPath()
    context.arc(pointer.x, pointer.y, 40, 0, Math.PI * 2)
    context.closePath()
    context.stroke()
  }
}
