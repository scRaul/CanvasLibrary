
/* Color Class for defining and RGBA color,used to color a pixel  */

class Color {
  r; g; b; a; // from 
  constructor(r, g=0, b=0, a = 255) { this.r = r%256; this.g = g%256; this.b = b%256; this.a = a%256; }
}
const _clearColor = new Color(0,0,0,75);
const _defaultColor = new Color(255,255,255, 255);

// used to pass into screen.draw(,mode,..) in order to tell it how to draw a list of points
const DRAW_MODE = {
  POINT:0,
  LINE:1,
  TRIANGE:2,
  CURVE:3,
  SCREENOBJ:4,
};
/* 
Screen is the object used to render onto a canvas element


getCanvas() returns the canvas element 
getIncrements() returns increments 
adjustScreen(width,height) // allows you to resize the canvas element
render(buffx,buffy) renders the imageData onto the canvas starting at the buff param
clearColor(color) sets the canvas to the passed in color
getWorldPosition(pixelX,pixelY) returns Vec world positon of a pixel 
drawLineGrid(n,color) draws a nxn line grid of a passed in color 
draw(list,mode,size,color) draws a list of Vec points, the mode defines how to draw them , size is the 
unit size relative to the increments

worldShift(x,y) ; translate the world x and y units 
cameraShift(x,y) ; translate the world -x and -y units 

 */
class Screen {
  #scale = 1;
  #increments; // defines how many coordinate points across the x axis on the canvas 
  #canvas;// holds DOM of a <canvas>
  #ctx;// holds the cavnas context 
  #imageData; // holds canvas pixel data 
  // used for transforming object from world space to screen space 
  #screenBasis = new Mat(1 * this.#scale, 0, 0,
    0, -1 * this.#scale, 0,
    0, 0, 1);
    // used for transforming objects from screen space to world space 
  #inverseBasis = new Mat(1, 0, 0,
    0, 1, 0,
    0, 0, 1);
    // ScreenObject to allow us to shift everything // behave as a camera 
   #world; 
    //param width and height define the canvas width and height
    // pass in id of canvas element if you want to 
  constructor(width=250, height=250, increments=10,id=null) {
    this.#increments = increments;
    if(id!= null)
      this.#canvas = document.getElementById(id);
    else{
      this.#canvas = document.createElement('canvas');
      document.body.appendChild(this.#canvas);
    }
    this.adjustScreen(width, height);
  }
  getCanvas(){return this.#canvas;}
  
  getIncrements(){return this.#increments;}
  adjustScreen(width, height) {
    this.#canvas.width = width;
    this.#canvas.height = height;
    this.#scale = width / this.#increments;
    //tranfrom povar to pixel 
    this.#screenBasis.x1 = this.#scale;
    this.#screenBasis.y2 = -this.#scale;
    this.#screenBasis.z1 = (width / 2);
    this.#screenBasis.z2 = (height / 2);
    // transform pixel to povar 
    this.#inverseBasis.x1 = (this.#increments / width);
    this.#inverseBasis.z1 = (-this.#increments / 2);
    this.#inverseBasis.y2 = -(this.#increments / width);
    this.#inverseBasis.z2 = (this.#increments * height) / (2 * width);
    //adjust #canvas size 
    var space = (window.innerWidth/2) -(width/2);
    this.#canvas.style.cssText = `height:${height}px; width:${width}px; left:${space}px;`;
    this.#ctx = this.#canvas.getContext("2d");
    this.#imageData = this.#ctx.getImageData(0, 0, this.#canvas.width, this.#canvas.height);
    this.#world = new ScreenObj(this.#increments,this.#increments);
  }
  render(buffX = 0, buffY = 0) {
    this.#ctx.putImageData(this.#imageData, buffX, buffY);
  }
  clearColor(color=_clearColor) {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    for (let j = 0; j < this.#canvas.height; j++)
      for (let i = 0; i < this.#canvas.width; i++)
        this.#setPixelColor(i, j, color);
  }
  //returns screen positon of a Vector 
  getWorldPosition(pixelX,pixelY) {
    var position = vMath(this.#inverseBasis, '*', new Vec(pixelX,pixelY,1));
    position.x = position.x;
    position.y = position.y;
    return position;
  }
  show(){
    this.#canvas.style.display = "block";
  }
  hide(){
    this.#canvas.style.display = "none";
  }
  drawLineGrid(n=1,color=_defaultColor){
     var range =  this.#increments/2;
    if(n < 1){
        n = range;
    }
    var step =range / n;
    for(let i = -range; i < range; i+=step){
        var top = new Vec(i,range);
        var bottom = new Vec(i,-range);
        var left = new Vec(-range,i);
        var right = new Vec(range,i)
        this.#drawLine(top,bottom,1,color);
        this.#drawLine(left,right,1,color);
    }

  }
  draw(list,mode=DRAW_MODE.POINT,size=1,color=_defaultColor ){
    if(mode == DRAW_MODE.POINT){
      list.forEach(pos =>{
         if(pos instanceof Vec)
          this.#drawPoint(pos,size,color);
      })
    }else if(mode == DRAW_MODE.LINE){
      for(let i = 0; i < list.length-1;i++){
        if(list[i] instanceof Vec && list[i+i] instanceof Vec)
          this.#drawLine(list[i],list[i+1],size,color);
      }
    }else if(mode == DRAW_MODE.TRIANGE){
      this.#drawTriangle(list,size,color);
    }else if(mode == DRAW_MODE.CURVE){
      this.#drawBSpline(list,size,color);
    }else if(mode == DRAW_MODE.SCREENOBJ){
      list.forEach(obj =>{
        this.#drawScreenObject(obj);
      });
    }
    if(mode != DRAW_MODE.SCREENOBJ){
        //filter out objects 
      for(let i = 0; i<list.length;i++){
        if(list[i] instanceof ScreenObj){
          var verts = list[i].getVerts();
          this.draw([verts[2],verts[3],verts[1],verts[4]],mode,size,color);
          this.draw([verts[2]],mode,size,new Color(0,0,255));
          this.draw([verts[0]],mode,size,new Color(0,0,255));
        }
    }
    }
  }
  #drawScreenObject(screenObj) {
    if(!screenObj instanceof ScreenObj) return;
    var verts = screenObj.getVerts();
    var p0 = vMath(this.#screenBasis,'*',verts[0]);
    var color = screenObj.getColor();
    if(screenObj.getSprite() != null){  
      var w= screenObj.getWidth();
      var h = screenObj.getHeight();
      var x = Math.floor(p0.x - (w/2));
      var y = Math.floor(p0.y - (h/2));
      this.#ctx.drawImage(screenObj.getSprite(),x,y, w, h);
    }
    var minX = verts[0].x;
    var maxX = verts[0].x;
    var minY = verts[0].y;
    var maxY = verts[0].y;
    for(let i= 1; i < verts.length;i++){
      minX = (verts[i].x < minX) ? verts[i].x : minX;
      maxX = (verts[i].x > maxX) ? verts[i].x : maxX;
      minY = (verts[i].y < minY) ? verts[i].y : minY;
      maxY = (verts[i].y > maxY) ? verts[i].y : maxY;
    }
    for(let y = minY; y <= maxY; y++){
      for(let x = minX; x <= maxX; x++){
        var p = new Vec(x,y,1);
        if( screenObj.containsPoint(p)){
           if(x < (-this.#increments/2) || x > (this.#increments/2) ) continue;
            p = vMath(this.#screenBasis,'*',p);
            this.#setPixelColor(p.x,p.y,color);
        }
      }
    }
  }
   #setPixelColor(x, y, color) {
    var index = ((parseInt(y) * (this.#canvas.width)) + parseInt(x)) * 4;// 4 bytes per pixel
    this.#imageData.data[index + 0] = Math.floor(color.r); // red channel
    this.#imageData.data[index + 1] = Math.floor(color.g); // green channel
    this.#imageData.data[index + 2] = Math.floor(color.b); // blue channel
    this.#imageData.data[index + 3] = Math.floor(color.a);//alpha channel    
  }
  #drawPoint(pos,size=1,color=_defaultColor) {
    if(!pos instanceof Vec ) return;
    var pen = new ScreenObj(size,size,color);
    pen.teleport(pos);
    this.#drawScreenObject(pen);
  }
  #drawLine(from,to,size=1,color=_defaultColor){
    var r0 = from;
    var d =  vMath(to,'-',from).normalized();
    var diff = vMath(to,'-',from).magnitude();
    for(let t=0;diff > 1 ; t+=0.1){
      var add = vMath(t,'*',d);
      add.z = 0;
      from = vMath(r0,'+',add);
      this.#drawPoint(from,size,color);
      diff = vMath(to,'-',from).magnitude();
    }
  }
  #drawTriangle(list,size,color){
    var levels = Math.floor(Math.sqrt(2*(list.length)));
    var maxParent = ((levels-1)*(levels)) / 2;
    if(maxParent== 0){
      this.#drawPoint(list[0],size,color);
      return;
    }
    var max = ((levels)* (levels+1))/2;
    //points exactly make a triangle 
    if(max == list.length){
      for(let parent = 0;parent < maxParent;parent++){
        var level = Math.round(Math.sqrt(2*parent+1));
        var leftChild = parent + level;
        var rightChild = parent + (level +1);
        this.#drawLine(list[parent],list[leftChild],size,color);
        this.#drawLine(list[parent],list[rightChild],size,color);
        this.#drawLine(list[leftChild],list[rightChild],size,color);
      }
    }
     var n = Math.sqrt(list.length)
     if( n == Math.floor(Math.sqrt(list.length))){
      for(let i = 0;i < list.length-n;i++){
        if( (i+1) % n == 0) continue;
        var leftChild = i + 1;
        var rightChild = i + n;
        this.#drawLine(list[i],list[leftChild],size,color);
        this.#drawLine(list[i],list[rightChild],size,color);
        this.#drawLine(list[leftChild],list[rightChild],size,color);
      }
      this.#drawLine(list[n-1],list[list.length-1],size,color);
      this.#drawLine(list[list.length-n],list[list.length-1],size,color);
    }else{
      vquickSort(list,0,list.length-1);
      for(let i = 0; i < list.length-3;i+=3 ){
        this.#drawLine(list[i],list[i+1],size,color);
        this.#drawLine(list[i],list[i+2],size,color);
        this.#drawLine(list[i+1],list[i+2],size,color);
      }
    }
  }
  #drawBSpline(points,size=1,color=_defaultColor ){
    var basis = getMat4(1,-3,3,-1,
      4,0,-6,3,
      1,3,3,-3,
      0,0,0,1);
    basis = vMath( (1/6.0), '*', basis );
    var list = [];
    for(let i = 0; i < (points.length-3); i++){
      var  cntrlP = getMat4C(points[i],points[i+1],points[i+2],points[i+3]);
      for(let t = 0.0; t < 1.0; t += .01 ){
          var nomial = new Vec(1,t,(t*t), (t*t*t) );
          var p = vMath(cntrlP,'*',(vMath(basis,'*',nomial)))
          list.push(p);
      }
    }
    this.draw(list,DRAW_MODE.LINE,size,color);
  }
  //set a pixel line 
  #setLine(from,to,color){
    var x =  from.x;
    var y =  from.y;
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    var sx = ( dx < 0 ) ? -1 : 1;
    var sy = ( dy < 0 ) ? -1 : 1;
    sx = parseInt(sx);
    sy= parseInt(sy);
    dx *= sx;
    dy *= sy;
    if( dx >= dy ){
      var X = to.x;
      var p = 2*dy  - dx;
      while( Math.floor(X) != Math.floor(x)   ){
          this.#setPixelColor(x,y,color);
          x += sx;
          if( p < 0){
              p += 2*dy;
          }else{
              p += 2*dy - 2*dx;
              y +=sy;
          }
      }
    }else{
      var Y = to.y;
      var p = 2*dx  - dy;
      while( Math.floor(Y) != Math.floor(y)  ){
          this.#setPixelColor(x,y,color);
          y += sy;
          if( p < 0){
            p += 2*dx;
          }else{
            p += 2*dx - 2*dy;
            x += sx;
          }
        }
      }
    }
}
