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
testImg.setSize(increments,increments);
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
    drawPointGrid(5,screen,pen);
 }
}
var firstDown = true;
function drawInput(){
    if(input.mouseDown == true){
       fps = fpsMovement;
       pen.teleport(input.getMousePositon());
       drawPointGrid(5,screen,pen);
    //    screen.drawScreenObject(pen);
       var v = input.getMousePositon();
       v.z =1; v.w = 1;
       pointList.push(v);
       pointListB.push(v);
       if( firstDown ){
        pointList.push(v);
        pointListB.push(v);
        pointList.push(v);
        pointListB.push(v);
        pointList.push(v);
        pointListB.push(v);
        firstDown = false;
       }
       if(pointList.length >11){
            screen.drawBSpline(pointList,pen.getColor(),pen);
            v = pointList[[pointList.length-1]];
            pointList = [];
            pointList.push(v);
            pointList.push(v);
            pointList.push(v);
       }
       if(pointListB.length >99){
            screen.drawBSpline(pointListB,pen.getColor(),pen);
            v = pointList[[pointList.length-1]];
            pointListB = [];
            pointListB.push(v);
            pointListB.push(v);
            pointListB.push(v);
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
        if(firstDown == true ){
            pointListB.push(v);
            pointListB.push(v);
            pointListB.push(v);
        }
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
    firstDown = false;
    pointListB.push(pointListB[pointListB.length-1]);
    pointListB.push(pointListB[pointListB.length-1]);
    pointListB.push(pointListB[pointListB.length-1]);
    if(pointListB.length > 0){
        screen.drawBSpline(pointListB,pen.getColor(),pen);
        pointListB = [];
   }
}