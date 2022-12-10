//MVP drawing app to test out canvas libray

document.getElementById('clearButton').addEventListener('click',clearScreen);
var pxSizeInput = document.getElementById('pxSize');
var penColorInput = document.getElementById('penColor');
var traceMode = document.getElementById('traceMode');
var userImage = document.getElementById('userImage');
var gridMode = document.getElementById('gridMode');
var funcMode = document.getElementById('functionMode');
var bottmCntrls = document.getElementById('bottomCntrls');

pxSizeInput.addEventListener('change',setPenSize);
penColorInput.addEventListener('change',setPenColor);
traceMode.addEventListener('change',toggleMode);
gridMode.addEventListener('change',toggleMode);
userImage.addEventListener('change',setImage);
funcMode.addEventListener('change',toggleMode);


var increments = 500;
var traceScreen = new Screen(500,500,increments,'canvas3');
var gridScreen = new Screen(500,500,increments,'canvas2');
var screen = new Screen(500,500,increments,'canvas');
gridScreen.clearColor();
gridScreen.drawLineGrid(25,new Color(255,255,255,80));
gridScreen.render();
gridScreen.hide();
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
toggleMode();
async function updateAndRender(){
    var delay = 1000/fps;
    var startTime = Date.now();
    drawInput();
    screen.render();
    traceScreen.render();
    if(traceMode.checked){
        traceScreen.draw([traceImg],DRAW_MODE.SCREENOBJ);
    }
    await new Promise(r => setTimeout(r,(startTime+delay)-Date.now() ));
    updateAndRender();
}
function drawInput(){
    if(input.mouseDown == true){
        fps = fpsMovement;
        var v = input.getMousePositon();
        v.z =1; v.w = 1;
        pen.teleport(v);
        pointList.push(v);
        pointListB.push(v);
        if(funcMode.checked)
            checkInput();
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
function checkInput(){
    var e = document.getElementsByName('Shape');
    var n = document.getElementById('nInput').value;
    var size =  document.getElementById('areaInput').value;
    var drawType = document.getElementsByName('dtype');
    var vertices = [];
    if(e[0].checked)
        vertices = getTriangle(n);
    else if(e[1].checked)
        vertices = getGrid(n);
    else if( e[2].checked)
        vertices = getRings(n);
    else if(e[3].checked)
        vertices = getSunflower(n);
    else if(e[4].checked)
        vertices = getTurnFraction(n);
    else if(e[5].checked)
        vertices = getExp(n);  
    else if(e[6].checked)
        vertices = getCos(n);
    else if(e[7].checked)
        vertices = getFlower(n);
    else if(e[8].checked)
        vertices = getProjectile(n);
    if(vertices != []){
        pointList = [];
        pointListB = [];
    } else{ 
        return;
    }
    var tempPen = new ScreenObj(size,size);
    tempPen.teleport(pen.getPos());
    vertices  = getScaledPointList(vertices,screen,tempPen);
    var mode = DRAW_MODE.POINT;
    if(drawType[1].checked) mode = DRAW_MODE.LINE;
    if(drawType[2].checked) mode = DRAW_MODE.TRIANGE;
    screen.draw(vertices,mode,pen.getWidth(),pen.getColor());
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
    if(gridMode.checked){
       gridScreen.show();
    }else{
        gridScreen.hide();
    }
    if(funcMode.checked){
        bottmCntrls.style.display ='block';
    }else{
        bottmCntrls.style.display ='none';
    }
}
function setImage(){
    const curFiles = userImage.files;
    if (curFiles.length === 0) { 
        console.log("none found");
        return;
    }
    for (const file of curFiles) { 
        traceImg.addImageSrc(URL.createObjectURL(file));
    }
}