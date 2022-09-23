class Input {
  //keys 
  keys = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    a: false,
    w: false,
    s: false,
    d: false
  };
  //mouse stuff 
  mouseDown = false;
  mousePosition = new Vec(0,0,1);
  screen;
  canvas;

  itemSelected = null;

  constructor(screen) {
    this.screen = screen;
    this.canvas = screen.canvas;

    this.canvas.addEventListener('mousemove', this.update.bind(this));
    this.canvas.addEventListener('mousedown', this.setMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.setMouseUp.bind(this));

    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }
  update(e) {
    var rect = canvas.getBoundingClientRect()
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
    var pixelPoint = new Vec(x, y, 1);
    var point = this.screen.getMousePosition(pixelPoint);
    this.mousePosition.x = Math.round(point.x);
    this.mousePosition.y = Math.round(point.y);

    if(this.itemSelected != null ){
      this.itemSelected.sprite.teleport(this.mousePosition);
    }
    
  }
  setMouseDown() { this.mouseDown = true; }
  setMouseUp() {
     this.mouseDown = false; 
     if(  this.itemSelected != null){
      this.itemSelected.checkTarget();
      this.itemSelected = null;
     }
  }
  onKeyDown(e) {
    if (this.keys[e.key] != undefined) this.keys[e.key] = true;
  }
  onKeyUp(e) {
    if (this.keys[e.key] != undefined) this.keys[e.key] = false;
  }
  setItem(item){
    this.itemSelected = item;
  }
}
