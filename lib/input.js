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
  mouseDown = false;
  #mousePosition = new Vec(0,0,1);
  #screen;
  #canvas;
  constructor() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }
  //detect when screen is being interacted with by the mouse or touch screen
  addScreen(screen){
    if(!screen instanceof Screen) return;
    this.#screen = screen;
    this.#canvas = screen.getCanvas();
    this.#canvas.addEventListener('mousemove', this.update.bind(this));
    this.#canvas.addEventListener('mousedown', this.setMouseDown.bind(this));
    this.#canvas.addEventListener('mouseup', this.setMouseUp.bind(this));
  }
  getMousePositon(){return this.#mousePosition;}
  update(e) {
    var rect = this.#canvas.getBoundingClientRect()
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
    var pixelPoint = new Vec(x, y, 1);
    this.#mousePosition = this.#screen.getScreenPosition(pixelPoint);
  }
  setMouseDown() {this.mouseDown = true;}
  setMouseUp() {  this.mouseDown = false; }
  onKeyDown(e) {
    if (this.keys[e.key] != undefined) this.keys[e.key] = true;
  }
  onKeyUp(e) {
    if (this.keys[e.key] != undefined) this.keys[e.key] = false;
  }
}
