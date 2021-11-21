import { random, times } from 'lodash'
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
    }
  })

  return { things, pointer: null }
}

export function tick(state: State, pointer: Pointer | null, dt: number): State {
  const things = state.things.map((thing) => ({
    ...thing,
    p: thing.p.add(thing.v.multiply(dt / 1000)),
  }))
  return {
    ...state,
    pointer,
    things,
  }
}
