import { random, times } from 'lodash'
import { Event, Pointer } from './input'
import { Vec2 } from './vec2'

interface Thing {
  p: Vec2
  v: Vec2
  destinationTheta: number | null
  destination: Vec2 | null
  nextBulletTimestamp: number | null
}

interface Bullet {
  p: Vec2
  v: Vec2
}

interface Target {
  p: Vec2
}

export interface State {
  things: Thing[]
  bullets: Bullet[]
  pointer: Pointer | null
  lastAngularVelocityChange: null | {
    angularVelocity: number
    baseDestinationTheta: number
    timestamp: number
  }
  targets: Target[]
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
      destinationTheta: null,
      destination: null,
      nextBulletTimestamp: i === 0 ? timestamp : null,
    }
  })

  const targets = [{ p: new Vec2(random(w), random(h)) }]

  return {
    things,
    bullets: [],
    pointer: null,
    lastAngularVelocityChange: null,
    targets,
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
          v: firstThing.v
            .normalize()
            .rotate(-Math.PI / 2)
            .scale(BULLET_V_SCALE),
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
    let baseDestinationTheta = 0
    if (state.lastAngularVelocityChange !== null) {
      baseDestinationTheta =
        state.lastAngularVelocityChange.baseDestinationTheta +
        state.lastAngularVelocityChange.angularVelocity *
          ((timestamp - state.lastAngularVelocityChange.timestamp) / 1000)
    }
    baseDestinationTheta %= Math.PI * 2
    lastAngularVelocityChange = {
      timestamp,
      baseDestinationTheta,
      angularVelocity,
    }
  } else {
    lastAngularVelocityChange = state.lastAngularVelocityChange!
  }

  let baseDestinationTheta =
    (state.lastAngularVelocityChange?.baseDestinationTheta ?? 0) +
    angularVelocity * ((timestamp - lastAngularVelocityChange.timestamp) / 1000)
  baseDestinationTheta %= Math.PI * 2

  const { w, h } = viewport
  const size = Math.min(w, h)
  const things = state.things.map((thing, i) => {
    let destination = thing.destination

    let center = pointer?.p ?? new Vec2(w / 2, h / 2)
    let radius = size * POINTER_UP_RADIUS_SCALE

    if (!pointer) {
      radius = size * NO_POINTER_RADIUS_SCALE
    } else if (pointer.down) {
      radius = size * POINTER_DOWN_RADIUS_SCALE
    }

    let destinationTheta = thing.destinationTheta

    destinationTheta =
      (Math.PI * 2 * (i / state.things.length) + baseDestinationTheta) %
      (Math.PI * 2)

    const destinationX = Math.cos(destinationTheta)
    const destinationY = Math.sin(destinationTheta)
    destination = center.add(
      new Vec2(destinationX, destinationY).multiply(radius),
    )

    const dist = destination.subtract(thing.p).dist()
    let speed = Math.sqrt(dist) * SPEED_SCALE

    const v = destination.subtract(thing.p).normalize().multiply(speed)
    const dp = v.multiply(dt / 1000)
    let nextP: Vec2
    if (dp.dist() > dist) {
      nextP = destination
    } else {
      nextP = thing.p.add(dp)
    }

    return {
      ...thing,
      p: nextP,
      v,
      destinationTheta,
      destination,
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
