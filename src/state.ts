import { isEqual, random, times } from 'lodash'
import { Vec2 } from './vec2'

interface Thing {
  p: Vec2
  v: Vec2
  targetTheta: number | null
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

export function init(viewport: { w: number; h: number }): State {
  const { w, h } = viewport
  const things: Thing[] = times(10, () => {
    return {
      p: new Vec2(random(w), random(h)),
      v: randomVelocity(8),
      targetTheta: null,
      target: null,
    }
  })

  return { things, pointer: null }
}

export function tick(
  state: State,
  pointer: Vec2 | null,
  dt: number,
  viewport: { w: number; h: number },
): State {
  const { w, h } = viewport
  const size = Math.min(w, h)
  const things = state.things.map((thing, i) => {
    let v = thing.v
    let targetTheta = thing.targetTheta
    let target = thing.target

    const angularVelocity = Math.PI * 2 * 0.1

    if (!pointer) {
      pointer = new Vec2(w / 2, h / 2)
    }

    if (pointer) {
      if (targetTheta === null) {
        targetTheta = Math.PI * 2 * (i / state.things.length)
      } else {
        targetTheta += angularVelocity * (dt / 1000)
      }

      const targetX = Math.cos(targetTheta)
      const targetY = Math.sin(targetTheta)
      target = pointer.add(new Vec2(targetX, targetY).multiply(size * 0.16))

      let speed = angularVelocity * size * 0.16
      speed *= Math.sqrt(target.subtract(thing.p).length())

      v = target.subtract(thing.p).normalize().multiply(speed)
    } else if (state.pointer) {
      targetTheta = null
      target = null
      v = v.normalize().multiply(size * 0.01)
    }

    return {
      ...thing,
      p: thing.p.add(v.multiply(dt / 1000)),
      v,
      targetTheta,
      target,
    }
  })
  return {
    ...state,
    pointer,
    things,
  }
}
