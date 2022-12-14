//MVP drawing app to test out canvas libray

// get references to html elements 
document.getElementById('clearButton').addEventListener('click',clearScreen);
var pxSizeInput = document.getElementById('pxSize');
var penColorInput = document.getElementById('penColor');
var traceMode = document.getElementById('traceMode');
var userImage = document.getElementById('userImage');
var instruc = document.getElementById("imageInst");
var gridMode = document.getElementById('gridMode');
var funcMode = document.getElementById('functionMode');
var bottmCntrls = document.getElementById('bottomCntrls');
// set up event listeners 
pxSizeInput.addEventListener('change',setPenSize);
penColorInput.addEventListener('change',setPenColor);
traceMode.addEventListener('change',toggleMode);
gridMode.addEventListener('change',toggleMode);
userImage.addEventListener('change',setImage);
funcMode.addEventListener('change',toggleMode);
// set up 3 screens, one main for drawing, 1 for displaying a background image, as a grid
var increments = 500;
var traceScreen = new Screen(500,500,increments,'canvas3');
var gridScreen = new Screen(500,500,increments,'canvas2');
var screen = new Screen(500,500,increments,'canvas');

// //clear screen to default color 
// gridScreen.clearColor();
// // draw a 25 x 25 grid 
// gridScreen.drawLineGrid(25,new Color(255,255,255,80));
// // render the grid
// gridScreen.render();
// // hidden util checkbox clicked 
// gridScreen.hide();
var traceImg = new ScreenObj();
// scale image to size of grid 
traceImg.setSize(increments/4,increments/4);
// make object tranparent 
traceImg.setColor(new Color(0,0,0,0));
// add and image to the object
traceImg.setImageSrc("test.png");
// pen will be used to store the color and line width 
var pen = new ScreenObj();

// create an input object listening to mouse
var input = new Input();
input.setScreen(screen);//detect when mouse interact with screen 

// will keep track of points where the use touched
var pointList = [];
var pointListB = [];//back up list 
var pointListC = [];

const fpsDefault = 10; // used to slow down the update the upadate and render loop
const fpsMovement = 120; // used to speed up the update for loop
var fps = fpsDefault;
screen.clearColor(); // set default clear color 
traceMode.checked = true;

setPenColor(); // check color 
toggleMode(); // check checkBoxes
updateAndRender(); // begin 
async function updateAndRender(){
    var delay = 1000/fps;
    var startTime = Date.now();
    handleKeyInput();
    drawInput();
    screen.render();
    traceScreen.render();
    if(traceMode.checked){
        //show vertices around the image 
         traceScreen.draw([traceImg],DRAW_MODE.POINT,10,new Color(255));
         //show the image itslef 
         traceScreen.draw([traceImg],DRAW_MODE.SCREENOBJ);
    }
    await new Promise(r => setTimeout(r,(startTime+delay)-Date.now() ));
    updateAndRender();
}
function drawInput(){
    if(input.mouseDown == true){
        fps = fpsMovement;
        var v = input.getMousePositon(); 
        pen.teleport(v);
        if(funcMode.checked) {
         checkInput();
         return;
        }
        pointList.push(v); 
        pointListB.push(v);
        pointListC.push(v);
        // draw a single point 
       screen.draw([v],DRAW_MODE.POINT,pen.getWidth(),pen.getColor());
       if(pointList.length > 9){
        //draw a list of points as a line
            screen.draw(pointList,DRAW_MODE.LINE,pen.getWidth(),pen.getColor());
            pointList = [];
       }
       if(pointListB.length > 1000){
            screen.draw(pointListB,DRAW_MODE.LINE,pen.getWidth(),pen.getColor());
            pointListB = [];
       }
    }
    else{
        screen.draw(pointList,DRAW_MODE.LINE,pen.getWidth(),pen.getColor());
        screen.draw(pointListB,DRAW_MODE.LINE,pen.getWidth(),pen.getColor());
        screen.draw(pointListC,DRAW_MODE.LINE,pen.getWidth(),pen.getColor());
        pointListC = [];
        fps = fpsDefault;
    }
}
var x = traceImg.getVerts()[0].x;
var y = traceImg.getVerts()[0].y;
function handleKeyInput(){
    if(input.keyDown == false){
        traceScreen.clearColor(new Color(0,0,0,0));
        fps = fpsDefault;
        return;
    }
    fps = fpsMovement;
    //move around the trace image
    if(input.keys.a){
        traceScreen.clearColor();
        x-=10;
    }
    else if(input.keys.d){
        traceScreen.clearColor();
        x+=10;
    }
    else if(input.keys.w){
        traceScreen.clearColor();
        y+=10;
    }
    else if(input.keys.s){
        traceScreen.clearColor();
        y-=10;
    }
    traceImg.teleport(new Vec(x,y));
}
function checkInput(){
    var e = document.getElementsByName('Shape');
    var n = document.getElementById('nInput').value;
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
    vertices  = getScaledPointList(vertices,screen,pen);
    var mode = DRAW_MODE.POINT;
    if(drawType[1].checked) mode = DRAW_MODE.LINE;
    if(drawType[2].checked) mode = DRAW_MODE.TRIANGE;
    screen.draw(vertices,mode,1,pen.getColor());
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
        instruc.style.display = 'block';
    }
    else{
        userImage.style.display = 'none';
        instruc.style.display = 'none';
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
        traceImg.setImageSrc(URL.createObjectURL(file));
    }
}