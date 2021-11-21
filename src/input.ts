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

export function getPointer(): Pointer | null {
  return pointer
}
