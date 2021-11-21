import { isEqual, random, times } from 'lodash'
import { Pointer } from './input'
import { Vec2 } from './vec2'

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
