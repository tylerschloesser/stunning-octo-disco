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
    return this.add(v.multiply(-1))
  }

  normalize() {
    const dist = this.length()
    return this.multiply(1 / dist)
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
}
