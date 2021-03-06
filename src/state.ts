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

const INPUT_ANGULAR_VELOCITY = 0.2
const NO_INPUT_ANGULAR_VELOCITY = 0.1
const POINTER_UP_RADIUS_SCALE = 0.16
const POINTER_DOWN_RADIUS_SCALE = 0.08
const NO_POINTER_RADIUS_SCALE = 0.24

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

    let angularVelocity = Math.PI * 2 * INPUT_ANGULAR_VELOCITY
    if (!pointer) {
      angularVelocity = Math.PI * 2 * NO_INPUT_ANGULAR_VELOCITY
    }

    let center = pointer?.p ?? new Vec2(w / 2, h / 2)
    let radius = size * POINTER_UP_RADIUS_SCALE

    if (!pointer) {
      radius = size * NO_POINTER_RADIUS_SCALE
    } else if (pointer.down) {
      radius = size * POINTER_DOWN_RADIUS_SCALE
    }

    if (targetTheta === null) {
      targetTheta = Math.PI * 2 * (i / state.things.length)
    } else {
      targetTheta =
        (targetTheta + angularVelocity * (dt / 1000)) % (Math.PI * 2)
    }

    const targetX = Math.cos(targetTheta)
    const targetY = Math.sin(targetTheta)
    target = center.add(new Vec2(targetX, targetY).multiply(radius))

    let speed =
      angularVelocity * radius * Math.sqrt(target.subtract(thing.p).length())

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
