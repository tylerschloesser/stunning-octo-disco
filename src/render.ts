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

  context.fillStyle = 'white'
  context.beginPath()
  if (pointer) {
    context.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2)
    context.fill()
  }
}
