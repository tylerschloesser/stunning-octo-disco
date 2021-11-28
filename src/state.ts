import { isEqual, random, times } from 'lodash'
import { Pointer } from './input'
import { Vec2 } from './vec2'

interface Thing {
  p: Vec2
  v: Vec2
  targetTheta: number | null
  target: Vec2 | null
}

export interface State {
  things: Thing[]
  pointer: Pointer | null
}

function randomVelocity(): Vec2 {
  const theta = random(true) * Math.PI * 2
  const x = Math.cos(theta)
  const y = Math.sin(theta)
  return new Vec2(x, y)
}

export function init(viewport: { w: number; h: number }): State {
  const { w, h } = viewport
  const things: Thing[] = times(10, () => {
    return {
      p: new Vec2(random(w), random(h)),
      v: randomVelocity().scale(8),
      targetTheta: null,
      target: null,
    }
  })

  return { things, pointer: null }
}

export function tick(
  state: State,
  pointer: Pointer | null,
  dt: number,
  viewport: { w: number; h: number },
): State {
  const { w, h } = viewport
  const size = Math.min(w, h)
  const things = state.things.map((thing, i) => {
    let v = thing.v
    let targetTheta = thing.targetTheta
    let target = thing.target

    let angularVelocity = Math.PI * 2 * 0.1
    if (!pointer) {
      angularVelocity *= 0.5
    }

    let center = pointer?.p ?? new Vec2(w / 2, h / 2)
    let radius = size * 0.16
    // calculate speed before adjusting radius, so that scaled
    // radius doesn't affect speed (should use a separate variable
    // for speed scale?)
    let speed = angularVelocity * radius
    if (!pointer) {
      radius *= 1.5
    } else if (pointer.down) {
      radius *= 0.5
    }

    if (targetTheta === null) {
      targetTheta = Math.PI * 2 * (i / state.things.length)
    } else {
      targetTheta += angularVelocity * (dt / 1000)
    }

    const targetX = Math.cos(targetTheta)
    const targetY = Math.sin(targetTheta)
    target = center.add(new Vec2(targetX, targetY).multiply(radius))

    speed *= Math.sqrt(target.subtract(thing.p).length())

    v = target.subtract(thing.p).normalize().multiply(speed)

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
