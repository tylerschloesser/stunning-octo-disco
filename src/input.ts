import { Vec2 } from './vec2'

export interface Pointer {
  p: Vec2
  down: boolean
}

let pointer: Pointer | null = null

window.addEventListener('pointermove', (e) => {
  pointer = {
    p: new Vec2(e.x, e.y),
    down: true,
  }
})

window.addEventListener('pointerout', () => {
  pointer = null
})

export function getPointer(): Pointer | null {
  return pointer
}
