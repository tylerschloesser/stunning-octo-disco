import { toggleDebug } from './config'
import { Vec2 } from './vec2'

export enum Event {
  Shoot = 'shoot',
}

export interface Pointer {
  p: Vec2
  down: boolean
}

let pointer: Pointer | null = null

window.addEventListener('pointermove', (e) => {
  pointer = {
    down: pointer?.down ?? false,
    p: new Vec2(e.x, e.y),
  }
})

window.addEventListener('pointerdown', (e) => {
  pointer = {
    p: new Vec2(e.x, e.y),
    down: true,
  }
})

window.addEventListener('pointerup', (e) => {
  pointer = {
    p: new Vec2(e.x, e.y),
    down: false,
  }
})

window.addEventListener('pointerout', () => {
  pointer = null
})

export function getPointer(): Pointer | null {
  return pointer
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'd') {
    toggleDebug()
  }
})
