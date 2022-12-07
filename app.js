document.getElementById('clearButton').addEventListener('click',clearScreen);
var pxSizeInput = document.getElementById('pxSize');
var penColorInput = document.getElementById('penColor');
var olMode = document.getElementById('olMode');
var traceMode = document.getElementById('traceMode');
var olButton = document.getElementById('olButton');
olButton.style.display = 'none';
pxSizeInput.addEventListener('change',setPenSize);
penColorInput.addEventListener('change',setPenColor);
olMode.addEventListener('change',toggleMode);
olButton.addEventListener('click',generateOutline);

var increments = 500;
var traceScreen = new Screen(500,500,increments);
var screen = new Screen(500,500,increments);

var testImg = new ScreenObj();
testImg.setSize(increments/2,increments/2);
testImg.setColor(new Color(0,0,0,0));
testImg.addImageSrc("test.png");

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
async function updateAndRender(){
    var delay = 1000/fps;
    var startTime = Date.now();
    handleInput();
    if(!olMode.checked)
        drawInput();
    else
        olInput();
    screen.render();
    if(traceMode.checked){
        traceScreen.show();
        traceScreen.render();
        traceScreen.drawScreenObject(testImg);
    }else{
        traceScreen.hide();
    }
    await new Promise(r => setTimeout(r,(startTime+delay)-Date.now() ));
    updateAndRender();
}
function handleInput(){
 if(input.keys.d == true){
    input.keys.d = false;
    makeTriangle(2,screen);
 }
}

function drawInput(){
    if(input.mouseDown == true){
       fps = fpsMovement;
       pen.teleport(input.getMousePositon());
       screen.drawScreenObject(pen);
       var v = input.getMousePositon();
       v.z =1; v.w = 1;
       pointList.push(v);
       pointListB.push(v);
       if(pointList.length >  10){
            screen.drawBSpline(pointList,pen.getColor(),pen);
            pointList = [];
       }
       if(pointListB.length > 100){
            screen.drawBSpline(pointListB,pen.getColor(),pen);
            pointListB = [];
       }
    }else{
        firstDown = true;
        fps = fpsDefault;
        pointList = [];
        pointListB = [];
    }
}
function olInput(){
    if(input.mouseDown == true){
        input.mouseDown = false;
        pen.teleport(input.getMousePositon());
        screen.drawScreenObject(pen);
        var v = input.getMousePositon();
        v.z =1; v.w = 1;
        pointListB.push(v);
    }
}
function clearScreen(){
    screen.clearColor();
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
    if(olMode.checked){
        olButton.style.display = 'inline-block';
    }
    else{
        olButton.style.display = 'none';
    }
}
function generateOutline(){
    if(pointListB.length > 0){
        screen.drawBSpline(pointListB,pen.getColor(),pen);
        pointListB = [];
   }
}