import { isEqual, random, times } from 'lodash'
import { Pointer } from './input'

class Vec2 {
  readonly x: number
  readonly y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  multiply(scalar: number) {
    return new Vec2(this.x * scalar, this.y * scalar)
  }

  add(v: Vec2) {
    return new Vec2(this.x + v.x, this.y + v.y)
  }
}

interface Thing {
  p: Vec2
  v: Vec2
  target: Vec2 | null
}

export interface State {
  things: Thing[]
  pointer: Pointer | null
}

export function init(): State {
  const things: Thing[] = times(10, () => {
    return {
      p: new Vec2(random(100), random(100)),
      v: new Vec2(random(1), random(1)),
      target: null,
    }
  })

  return { things, pointer: null }
}

export function tick(state: State, pointer: Pointer | null, dt: number): State {
  const updateTarget = !isEqual(state.pointer, pointer)
  const things = state.things.map((thing) => {
    let v = thing.v
    let target = thing.target
    if (updateTarget) {
      if (pointer) {
        target = new Vec2(pointer.x, pointer.y)
      } else {
        target = null
      }
    }
    return {
      ...thing,
      p: thing.p.add(v.multiply(dt / 1000)),
      target,
    }
  })
  return {
    ...state,
    pointer,
    things,
  }
}
