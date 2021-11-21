export interface Pointer {
  x: number
  y: number
}

let pointer: Pointer | null = null

window.addEventListener('pointermove', (e) => {
  pointer = {
    x: e.x,
    y: e.y,
  }
})

window.addEventListener('pointerout', () => {
  pointer = null
})

export function getPointer(): Pointer | null {
  return pointer
}
