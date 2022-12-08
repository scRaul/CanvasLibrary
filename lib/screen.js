class Color {
  r; g; b; a; // from 
  constructor(r, g=0, b=0, a = 255) { this.r = r%256; this.g = g%256; this.b = b%256; this.a = a%256; }
}
const _clearColor = new Color(0,0,0,75);
class Screen {
  #scale = 1;
  #increments;
  #canvas;
  #ctx;
  #imageData;
  #screenBasis = new Mat(1 * this.#scale, 0, 0,
    0, -1 * this.#scale, 0,
    0, 0, 1);
  #inverseBasis = new Mat(1, 0, 0,
    0, 1, 0,
    0, 0, 1);
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
  }
  #setPixelColor(x, y, color) {
    var index = ((parseInt(y) * (this.#canvas.width)) + parseInt(x)) * 4;// 4 bytes per pixel
    this.#imageData.data[index + 0] = color.r; // red channel
    this.#imageData.data[index + 1] = color.g; // green channel
    this.#imageData.data[index + 2] = color.b // blue channel
    this.#imageData.data[index + 3] = color.a;//alpha channel    
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
  drawPoint(point, color) {
    if(!point instanceof Vec ) return;
    var p = vMath(this.#screenBasis, '*', point);
    this.#setPixelColor(p.x, p.y, color);
  }
  drawBSpline(points,color,pen=null){
    var basis = getMat4(1,-3,3,-1,
      4,0,-6,3,
      1,3,3,-3,
      0,0,0,1);
    basis = vMath( (1/6.0), '*', basis );
    for(let i = 0; i < (points.length-3); i++){
      var  cntrlP = getMat4C(points[i],points[i+1],points[i+2],points[i+3]);
      for(let t = 0.0; t < 1.0; t += .001 ){
          var nomial = new Vec(1,t,(t*t), (t*t*t) );
          var p = vMath(cntrlP,'*',(vMath(basis,'*',nomial)));
          if(pen == null)
            this.drawPoint(p,color);
          else{
            pen.teleport(p);
            this.drawScreenObject(pen);
          }
      }
    }

  }
  drawLine(from,to,color){
    var x = from.x;
    var y = from.y;
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
          var tp = new Vec(x,y,0,0);
          this.drawPoint(tp, color);
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
          var tp = new Vec(x,y,0,0);
          this.drawPoint(tp, color);
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

  drawScreenObject(screenObj) {
    if(!screenObj instanceof ScreenObj) return;
    var verts = screenObj.getVerts();
    var p1 = vMath(this.#screenBasis, '*', verts[1]); 
    var p2 = vMath(this.#screenBasis, '*', verts[2]);
    var p3 = vMath(this.#screenBasis, '*', verts[3]);
    var p4 = vMath(this.#screenBasis, '*', verts[4]);
    var color = screenObj.getColor();
    if(screenObj.getSprite() != null){  
      var x= parseInt(p2.x);
      var y = parseInt(p2.y);
      var w= screenObj.getWidth();
      var h = screenObj.getHeight();
      this.#ctx.drawImage(screenObj.getSprite(),x,y, w, h);
    }
    for(let y = p2.y; y < p1.y;y++){
      for(let x = p1.x; x < p3.x;x++){
        this.#setPixelColor(x,y,color);
      }
    }
  }
  //returns screen positon of a Vector 
  getScreenPosition(pixel) {
    if(! pixel instanceof Vec) return;
    var position = vMath(this.#inverseBasis, '*', pixel);
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
}
