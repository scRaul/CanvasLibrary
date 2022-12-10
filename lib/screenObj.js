//Screem Object creates a box object with 5 Vec
// v used to define the box and 1 the position


class ScreenObj {
  #pos = new Vec(0, 0, 1); // center position
  #v1 = new Vec(-.5, -.5, 1); //lower left
  #v2 = new Vec(-.5, .5, 1); //upper left
  #v3 = new Vec(.5, .5, 1); // upper right
  #v4 = new Vec(.5, -.5, 1); // lower right
  #w = 1;
  #h = 1;
  #color;
  #sprite = null;
  isSelected = false;
  constructor(w=1,h=1,color = _defaultColor) { 
    this.scale(w,h);
    this.#color = color;
  }
  //copy another screenObj
  copyData(other){
    if(!other  instanceof ScreenObj) return;
    this.#color = other.getColor();
    var v = other.getVerts(); 
    this.#pos = v[0];
    this.#v1 = v[1];
    this.#v2 = v[2];
    this.#v3 = v[3];
    this.#v4 = v[4];
    this.#w = other.getWidth();
    this.#h = other.getHeight();
    this.#sprite = other.getSprite();
  }
  //return array of this objects verticies
  getVerts() {
    return [this.#pos, this.#v1, this.#v2, this.#v3, this.#v4];
  }
  getWidth(){
    return this.#w;
  }
  getWorldMatrix(){
    var pos = this.#pos;
    return new Mat(1,0,pos.x,
                   0,1,pos.y,
                   0,0,1);
  }
  getHeight(){
    return this.#h;
  }
  getColor(){
    return this.#color;
  }
  setColor(color ){
    if(!color instanceof Color) return;
    this.#color = color;
  }
  getPos(){ return this.#pos; }
  getSprite(){
    return this.#sprite;
  }
  translate(x, y) {
    var translate = new Mat(
      1, 0, x,
      0, 1, y,
      0, 0, 1
    );
    this.#matrixMult(translate);
  }
  //set current position to new positon 
  teleport(pos) {
    if(!pos instanceof Vec) return;
    this.translate(-this.#pos.x, -this.#pos.y);
    this.translate(pos.x,pos.y);
  }
  //scale from curren size 
  scale(w, h) {
    var tx = this.#pos.x;
    var ty = this.#pos.y;
    this.translate(-tx, -ty);
    var scale = new Mat(
      w, 0, 0,
      0, h, 0,
      0, 0, 1);
    this.#matrixMult(scale);
    this.translate(tx, ty);
    this.#w = this.#v4.x - this.#v1.x;
    this.#h = this.#v3.y - this.#v1.y;
  }
  //Resize an object
  setSize(w, h) {
    this.#pos = new Vec(0, 0, 1);
    this.#v1 = new Vec(-.5, -.5, 1); //lower left
    this.#v2 = new Vec(-.5, .5, 1); //upper left
    this.#v3 = new Vec(.5, .5, 1); // upper right
    this.#v4 = new Vec(.5, -.5, 1); // lower right
    this.#w = 1;
    this.#h = 1;
    this.scale(w, h);
  }
  //Add an image to the Screen Object, will render within verticies 
  addImageSrc(src, callback=null) {
    if(typeof src !='string' ) return;
    if(this.#sprite == null )
      this.#sprite = new Image();
    this.#sprite.onload = callback;
    this.#sprite.src = src;
  }
  //used to multipy transformations on Screen Object
  #matrixMult(transform) {
    if(!transform instanceof Mat ) return;
    this.#pos = vMath(transform,'*', this.#pos);
    this.#v1 = vMath(transform, '*', this.#v1);
    this.#v2 = vMath(transform, '*', this.#v2);
    this.#v3 = vMath(transform, '*', this.#v3);
    this.#v4 = vMath(transform, '*', this.#v4);
  }
  //param: point must be of type Vec
  //if point is within this objects verticies return true
  collided(point) {
    if(!point instanceof Vec) return;
    if (point.x < this.#v1.x || point.x > this.#v4.x) return false;
    if (point.y < this.#v1.y || point.y > this.#v3.y) return false;
    else return true;
  }
  //param: other must be of type ScreenObj
  //if any vertex intersects the other obj, return true
  //else false
  intersected(other) {
    if(!other instanceof ScreenObj) return;
    if(other.collided);
  }
}