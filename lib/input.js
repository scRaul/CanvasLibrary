//Input that listens to the windows input 
//addScreen adds a listener to the sceen object 
// keys are meant to be added by the programmer specific to their app
class Input {
  //keys 
  keys = {
    one: false, // numbers must be handled in onKeyDown
    two: false,
    three: false,
    four: false,
    a: false,
    w: false,
    s: false,
    d: false,
    r:false,
  };
  mouseDown = false;
  #mousePosition = new Vec(0,0,1);
  #screen;
  #canvas;
  keyDown = false;
  constructor() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }
  //detect when screen is being interacted with by the mouse or touch screen
  setScreen(screen){
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
    this.#mousePosition = this.#screen.getWorldPosition(x,y);
  }
  setMouseDown() {this.mouseDown = true;}
  setMouseUp() {  this.mouseDown = false; }
  onKeyDown(e) {
    if(this.keyDown) return;
    this.keyDown = true; 
    switch(e.key){
      case '1': 
        this.keys.one = true; 
        break;
      case '2':
        this.keys.two = true; 
        break;
      case '3':
        this.keys.three = true; 
        break;
      case '4':
        this.keys.four = true; 
        break;
      default:
        if (this.keys[e.key] == undefined) return;
        this.keys[e.key] = true;
    }
  }
  onKeyUp(e) {
    this.keyDown = false;
    switch(e.key){
      case '1': 
        this.keys.one = false; 
        break;
      case '2':
        this.keys.two = false; 
        break;
      case '3':
        this.keys.three = false; 
        break;
      case '4':
        this.keys.four = false; 
        break;
      default:
        if (this.keys[e.key] == undefined) return;
        this.keys[e.key] = false;
    }
  }
}
