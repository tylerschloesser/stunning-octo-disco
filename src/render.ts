import { getConfig } from './config'
import { State } from './state'
import Color from 'color'
import { Vec2 } from './vec2'

export function render(
  context: CanvasRenderingContext2D,
  state: State,
  viewport: { w: number; h: number },
  timestamp: number,
) {
  const config = getConfig()
  const { w, h } = viewport
  const size = Math.min(w, h)
  context.clearRect(0, 0, w, h)
  context.fillStyle = '#333'
  context.fillRect(0, 0, w, h)

  state.targets.forEach((target) => {
    context.fillStyle = new Color('white').fade(0.8).toString()
    const { p } = target
    context.beginPath()
    context.arc(p.x, p.y, size * 0.1, 0, Math.PI * 2)
    context.closePath()
    context.fill()
  })

  if (config.debug && state.center) {
    context.strokeStyle = 'green'
    context.beginPath()
    context.arc(state.center.x, state.center.y, size * 0.02, 0, Math.PI * 2)
    context.closePath()
    context.stroke()
  }

  state.things.forEach((thing) => {
    const { p } = thing

    context.strokeStyle = 'cyan'
    if (thing.nextBulletTimestamp) {
      const DUR = 250
      const dt = Math.min(timestamp - thing.nextBulletTimestamp, DUR)
      const color = Color('cyan').mix(Color('magenta'), dt / DUR)
      context.strokeStyle = color.toString()
    }
    context.beginPath()
    context.arc(p.x, p.y, size * 0.02, 0, Math.PI * 2)
    context.closePath()
    context.stroke()

    if (config.debug && thing.destination) {
      context.beginPath()
      context.moveTo(p.x, p.y)
      context.lineTo(thing.destination.x, thing.destination.y)
      context.stroke()
    }

    if (config.debug) {
      context.strokeStyle = 'red'
      const to = p.add(thing.v.normalize().multiply(size * 0.02))
      context.beginPath()
      context.moveTo(p.x, p.y)
      context.lineTo(to.x, to.y)
      context.stroke()
    }
  })

  state.bullets.forEach((bullet) => {
    context.strokeStyle = 'magenta'
    const { p } = bullet
    context.beginPath()
    context.arc(p.x, p.y, size * 0.02, 0, Math.PI * 2)
    context.closePath()
    context.stroke()
  })

  const { pointer } = state
  if (config.debug && pointer) {
    context.strokeStyle = 'white'
    context.beginPath()
    context.arc(pointer.p.x, pointer.p.y, size * 0.16, 0, Math.PI * 2)
    context.closePath()
    context.stroke()
  }
}
