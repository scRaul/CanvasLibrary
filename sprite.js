var blank = new Color(0, 0, 0, 0);
class Sprite {
  pos = new Vec(0, 0, 1);
  v1 = new Vec(-1, 0, 1); //lower left
  v2 = new Vec(-1, 1, 1); //upper left
  v3 = new Vec(1, 1, 1); // upper right
  v4 = new Vec(1, 0, 1); // lower right
  w = 1;
  h = 1;
  color;
  sprite;
  selected = false;
  constructor() { }
  init(src, callback, color = blank) {
    this.color = color;
    this.setSprite(src, callback);
  }
  translate(x, y) {
    var translate = new Mat(
      1, 0, x,
      0, 1, y,
      0, 0, 1
    );
    this.matrixMult(translate);
  }
  teleport(pos) {
    this.translate(-this.pos.x, -this.pos.y);
    this.translate(pos.x, pos.y);
  }
  scale(w, h) {
    this.w = w; this.h = h;
    var tx = this.pos.x;
    var ty = this.pos.y;
    this.translate(-tx, -ty);
    var scale = new Mat(
      w, 0, 0,
      0, h, 0,
      0, 0, 1);
    this.matrixMult(scale);
    this.translate(tx, ty);
  }
  getVerts() {
    return [this.pos, this.v1, this.v2, this.v3, this.v4];
  }
  setSprite(src, callback) {
    this.sprite = new Image();
    this.sprite.onload = callback;
    this.sprite.src = src;
  }
  matrixMult(transform) {
    this.pos = vMath(transform, '*', this.pos);
    this.v1 = vMath(transform, '*', this.v1);
    this.v2 = vMath(transform, '*', this.v2);
    this.v3 = vMath(transform, '*', this.v3);
    this.v4 = vMath(transform, '*', this.v4);
  }
  collided(point) {
    if (point.x < this.v1.x || point.x > this.v4.x) return false;
    if (point.y < this.v1.y || point.y > this.v3.y) return false;
    else return true;
  }
}