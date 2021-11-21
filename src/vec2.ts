export class Vec2 {
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

  subtract(v: Vec2) {
    return new Vec2(this.x - v.y, this.y - v.y)
  }

  normalize() {
    const dist = Math.sqrt(this.x * this.x + this.y * this.y)
    return new Vec2(this.x / dist, this.y / dist)
  }
}
