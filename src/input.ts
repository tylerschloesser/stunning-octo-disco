import { Vec2 } from './vec2'

let pointer: Vec2 | null = null

window.addEventListener('pointermove', (e) => {
  pointer = new Vec2(e.x, e.y)
})

window.addEventListener('pointerout', () => {
  pointer = null
})

export function getPointer(): Vec2 | null {
  return pointer
}
