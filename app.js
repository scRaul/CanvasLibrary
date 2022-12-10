//MVP drawing app to test out canvas libray

document.getElementById('clearButton').addEventListener('click',clearScreen);
var pxSizeInput = document.getElementById('pxSize');
var penColorInput = document.getElementById('penColor');
var traceMode = document.getElementById('traceMode');
var userImage = document.getElementById('userImage');

pxSizeInput.addEventListener('change',setPenSize);
penColorInput.addEventListener('change',setPenColor);
traceMode.addEventListener('change',toggleMode);
userImage.addEventListener('change',setImage);

toggleMode();

var increments = 500;
var traceScreen = new Screen(500,500,increments);
var screen = new Screen(500,500,increments);

var traceImg = new ScreenObj();
traceImg.setSize(increments,increments);
traceImg.setColor(new Color(0,0,0,0));
traceImg.addImageSrc("test.png");

var input = new Input();
var pen = new ScreenObj();
screen.clearColor();
input.addScreen(screen);

var pointList = [];
var pointListB = [];
const fpsDefault = 10; 
const fpsMovement = 120;
var fps = fpsDefault;

setPenColor();
updateAndRender();
screen.drawLineGrid(10);
async function updateAndRender(){
    var delay = 1000/fps;
    var startTime = Date.now();
    drawInput();
    screen.render();
    if(traceMode.checked){
        traceScreen.show();
        traceScreen.render();
        traceScreen.draw([traceImg],DRAW_MODE.SCREENOBJ);
    }else{
        traceScreen.hide();
    }
    await new Promise(r => setTimeout(r,(startTime+delay)-Date.now() ));
    updateAndRender();
}
function drawInput(){
    if(input.mouseDown == true){
       fps = fpsMovement;
       var v = input.getMousePositon();
       v.z =1; v.w = 1;
       pointList.push(v);
       pointListB.push(v);
       screen.draw([v],DRAW_MODE.POINT,pen.getWidth(),pen.getColor());
       if(pointList.length >11){
            screen.draw(pointList,DRAW_MODE.LINE,pen.getWidth(),pen.getColor());
            pointList = [];
       }
       if(pointListB.length >99){
            screen.draw(pointListB,DRAW_MODE.LINE,pen.getWidth(),pen.getColor());
            pointListB = [];
       }
    }
    else{
        screen.draw(pointListB,DRAW_MODE.LINE,pen.getWidth(),pen.getColor());
        fps = fpsDefault;
        pointList = [];
        pointListB = [];
    }
}
function clearScreen(){
    screen.clearColor();
    pointList = [];
    pointListB = [];
}
function setPenSize(){
    var size = pxSizeInput.value;
    pen.setSize(size,size);
}
function setPenColor(){
    const color = penColorInput.value
    const r = parseInt(color.substr(1,2), 16)
    const g = parseInt(color.substr(3,2), 16)
    const b = parseInt(color.substr(5,2), 16)
    pen.setColor(new Color(r,g,b));
}
function toggleMode(){
    if(traceMode.checked){
        userImage.style.display = 'inline-block';
    }
    else{
        userImage.style.display = 'none';
    }
}
function setImage(){

}