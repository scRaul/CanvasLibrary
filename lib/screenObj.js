//Screem Object creates a box object with 5 Vec
// v used to define the box and 1 the position
const _ImageLookUp = new Map();
class ScreenObj {
  #pos = new Vec(0, 0, 1); // center position
  #v1 = new Vec(-.5, -.5, 1); //lower left
  #v2 = new Vec(-.5, .5, 1); //upper left
  #v3 = new Vec(.5, .5, 1); // upper right
  #v4 = new Vec(.5, -.5, 1); // lower right
  #color;
  #imgSrc = null;
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
    this.#imgSrc = other.getSprite();
  }
  //return array of this objects verticies
  getVerts(){
    return [this.#pos.copy(), this.#v1.copy(), this.#v2.copy(), this.#v3.copy(), this.#v4.copy()];
  }
  getWidth(){
    return vMath(this.#v3,'-',this.#v4).magnitude();
  }
  getHeight(){
    return vMath(this.#v4,'-',this.#v1).magnitude();
  }
  getWorldMatrix(){
    return new Mat(this.getWidth(),0,this.#pos.x,
                   0,this.getHeight(),this.#pos.y,
                   0,0,1);
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
    return _ImageLookUp.get(this.#imgSrc);
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
  }
  //Resize an object
  setSize(w, h) {
    this.#pos = new Vec(0, 0, 1);
    this.#v1 = new Vec(-.5, -.5, 1); //lower left
    this.#v2 = new Vec(-.5, .5, 1); //upper left
    this.#v3 = new Vec(.5, .5, 1); // upper right
    this.#v4 = new Vec(.5, -.5,1); // lower right
    this.scale(w, h);
  }
  rotate(deg){
    var rad =  (deg*Math.PI/ 180);
    var rot = new Mat(
      Math.cos(rad),-1 * Math.sin(rad),0,
      Math.sin(rad),Math.cos(rad),0,
       0,0,1);
    this.#matrixMult(rot);
  }
  //Add an image to the Screen Object, will render within verticies 
  setImageSrc(src) {
    this.#imgSrc = src;
    createImage(src);
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
  //returnd true if collided with other object
  collided(other){
    var verts = other.getVerts();
    for(let i = 0; i < verts.length;i++){
      if(this.containsPoint(verts[i])) return true; 
    }
    verts = this.getVerts();
    for(let i = 0; i < verts.length;i++){
      if(other.containsPoint(verts[i])) return true; 
    }
    return false; 
  }
  //param: point must be of type Vec
  //if point is within this objects verticies return true
  containsPoint(point) {
    if(!point instanceof Vec) return;
    return  ( pointInTriangle(point,this.#v1,this.#v2,this.#v4) || pointInTriangle(point,this.#v3,this.#v2,this.#v4) );
  }
}
function createImage(src){
  if(typeof src !='string' ) return;
  if(_ImageLookUp.get(src) != undefined) return;
  var img = new Image();
  img.src = src;
  _ImageLookUp.set(src,img);
}