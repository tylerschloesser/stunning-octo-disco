import { isEqual, random, times } from 'lodash'
import { Vec2 } from './vec2'

interface Thing {
  p: Vec2
  v: Vec2
  target: Vec2 | null
}

export interface State {
  things: Thing[]
  pointer: Vec2 | null
}

function randomVelocity(scale: number = 1): Vec2 {
  const theta = random(true) * Math.PI * 2
  const x = Math.cos(theta)
  const y = Math.sin(theta)
  return new Vec2(x, y).multiply(scale)
}

export function init(canvas: HTMLCanvasElement, scale: number): State {
  const w = canvas.width / scale
  const h = canvas.height / scale
  const things: Thing[] = times(10, () => {
    return {
      p: new Vec2(random(w), random(h)),
      v: randomVelocity(8),
      target: null,
    }
  })

  return { things, pointer: null }
}

export function tick(state: State, pointer: Vec2 | null, dt: number): State {
  const updateTarget = !isEqual(state.pointer, pointer)
  const things = state.things.map((thing) => {
    let v = thing.v
    let target = thing.target
    if (updateTarget) {
      if (pointer) {
        target = new Vec2(pointer.x, pointer.y)
        v = pointer.subtract(thing.p).normalize().multiply(16)
      } else {
        target = null
        v = randomVelocity(8)
      }
    }
    return {
      ...thing,
      p: thing.p.add(v.multiply(dt / 1000)),
      v,
      target,
    }
  })
  return {
    ...state,
    pointer,
    things,
  }
}
