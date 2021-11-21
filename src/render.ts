export function render(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
) {
  const w = canvas.width
  const h = canvas.height
  context.clearRect(0, 0, w, h)
  context.fillStyle = '#333'
  context.fillRect(0, 0, w, h)
}
