import { random, times } from 'lodash'
import { Event, Pointer } from './input'
import { Vec2 } from './vec2'

interface Thing {
  p: Vec2
  v: Vec2
  targetTheta: number | null
  target: Vec2 | null
  nextBulletTimestamp: number | null
}

interface Bullet {
  p: Vec2
  v: Vec2
}

export interface State {
  things: Thing[]
  bullets: Bullet[]
  pointer: Pointer | null
  lastAngularVelocityChange: null | {
    angularVelocity: number
    baseTargetTheta: number
    timestamp: number
  }
}

function randomVelocity(): Vec2 {
  const theta = random(true) * Math.PI * 2
  const x = Math.cos(theta)
  const y = Math.sin(theta)
  return new Vec2(x, y)
}

export function init(
  viewport: { w: number; h: number },
  thingCount = 10,
  timestamp: number,
): State {
  const { w, h } = viewport
  const things: Thing[] = times(thingCount, (i) => {
    return {
      p: new Vec2(random(w), random(h)),
      v: randomVelocity().scale(8),
      targetTheta: null,
      target: null,
      nextBulletTimestamp: i === 0 ? timestamp : null,
    }
  })

  return {
    things,
    bullets: [],
    pointer: null,
    lastAngularVelocityChange: null,
  }
}

const POINTER_UP_ANGULAR_VELOCITY = 0.4
const POINTER_DOWN_ANGULAR_VELOCITY = 0.2
const NO_POINTER_ANGULAR_VELOCITY = 0.1

const POINTER_UP_RADIUS_SCALE = 0.16
const POINTER_DOWN_RADIUS_SCALE = 0.08
const NO_POINTER_RADIUS_SCALE = 0.24

const SPEED_SCALE = 100

const BULLET_V_SCALE = 1000

export function tick(
  state: State,
  pointer: Pointer | null,
  dt: number,
  viewport: { w: number; h: number },
  events: Event[],
  timestamp: number,
): State {
  let { bullets } = state

  for (const event of events) {
    switch (event) {
      case Event.Shoot: {
        if (!pointer) {
          // shouldn't happen?
          break
        }
        const firstThing = state.things.shift()
        if (!firstThing) {
          break
        }
        const bullet: Bullet = {
          p: firstThing.p,
          v: firstThing.p.subtract(pointer.p).normalize().scale(BULLET_V_SCALE),
        }
        bullets.push(bullet)
        if (state.things.length) {
          state.things[0].nextBulletTimestamp = timestamp
        }
        break
      }
    }
  }

  let angularVelocity = Math.PI * 2
  if (!pointer) {
    angularVelocity *= NO_POINTER_ANGULAR_VELOCITY
  } else if (pointer.down) {
    angularVelocity *= POINTER_DOWN_ANGULAR_VELOCITY
  } else {
    angularVelocity *= POINTER_UP_ANGULAR_VELOCITY
  }

  let lastAngularVelocityChange: State['lastAngularVelocityChange']
  if (angularVelocity !== state.lastAngularVelocityChange?.angularVelocity) {
    let baseTargetTheta = 0
    if (state.lastAngularVelocityChange !== null) {
      baseTargetTheta =
        state.lastAngularVelocityChange.baseTargetTheta +
        state.lastAngularVelocityChange.angularVelocity *
          ((timestamp - state.lastAngularVelocityChange.timestamp) / 1000)
    }
    baseTargetTheta %= Math.PI * 2
    lastAngularVelocityChange = {
      timestamp,
      baseTargetTheta,
      angularVelocity,
    }
  } else {
    lastAngularVelocityChange = state.lastAngularVelocityChange!
  }

  let baseTargetTheta =
    (state.lastAngularVelocityChange?.baseTargetTheta ?? 0) +
    angularVelocity * ((timestamp - lastAngularVelocityChange.timestamp) / 1000)
  baseTargetTheta %= Math.PI * 2

  const { w, h } = viewport
  const size = Math.min(w, h)
  const things = state.things.map((thing, i) => {
    let target = thing.target

    let center = pointer?.p ?? new Vec2(w / 2, h / 2)
    let radius = size * POINTER_UP_RADIUS_SCALE

    if (!pointer) {
      radius = size * NO_POINTER_RADIUS_SCALE
    } else if (pointer.down) {
      radius = size * POINTER_DOWN_RADIUS_SCALE
    }

    let targetTheta = thing.targetTheta

    targetTheta =
      (Math.PI * 2 * (i / state.things.length) + baseTargetTheta) %
      (Math.PI * 2)

    const targetX = Math.cos(targetTheta)
    const targetY = Math.sin(targetTheta)
    target = center.add(new Vec2(targetX, targetY).multiply(radius))

    const dist = target.subtract(thing.p).dist()
    let speed = Math.sqrt(dist) * SPEED_SCALE

    const v = target.subtract(thing.p).normalize().multiply(speed)
    const dp = v.multiply(dt / 1000)
    let nextP: Vec2
    if (dp.dist() > dist) {
      nextP = target
    } else {
      nextP = thing.p.add(dp)
    }

    return {
      ...thing,
      p: nextP,
      v,
      targetTheta,
      target,
    }
  })

  bullets = bullets.map((bullet) => {
    return {
      ...bullet,
      p: bullet.p.add(bullet.v.scale(dt / 1000)),
    }
  })

  return {
    ...state,
    pointer,
    things,
    bullets,
    lastAngularVelocityChange,
  }
}
