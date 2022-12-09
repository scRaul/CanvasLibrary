const _func_color = new Color(0,255,255);
//move drawing to screen class
function getGrid(n){
    if (n <= 0) n = 1;
    var l = 1;
    var step = l / n;
    var xStart = l / -2 + (l / 2) / n;
    var yStart = xStart * -1;
    var points = [];
    for (let i = 0; i < n; i++) {
        var y = yStart - (step * i);
        for (let j = 0; j < n; j++) {
            var x = xStart + (step * j);
            points.push(new Vec(x,y)); // keep at 0 then update to 1 after scaling
        }
    }
    return points;
}
function drawPointGrid(n=-1,screen=null,pen=null) {
    if(!screen instanceof Screen) return;
    var range = screen.getIncrements();
    var points = flower(n); 
    points.forEach(p =>{
        var pos = vMath(p,'*',range);
        pos.z = 1;//scale z back down to 1 
        if(pen instanceof ScreenObj){
            pos = vMath(p,'*',pen.getWidth()*(range/30));
            pos.z = 1; //scale z back down to 1 
            var trans = pen.getWorldMatrix();
            console.log(pos);
            pos = vMath(trans,'*',pos);
            console.log(pos);
            var temp = new ScreenObj();
            temp.copyData(pen);
            temp.teleport(pos);
            screen.drawScreenObject(temp);
        }else{
            screen.drawPoint(pos,_func_color);
        }
    });
    screen.render();
}
function drawLineGrid(n=-1,screen=null,pen=null) {
    if(!screen instanceof Screen) return;
    var range = screen.getIncrements();
    if(n < 1){
        n = range;
    }
    var step =range / n;
    for(let i = -range; i < range; i+=step){
        var top = new Vec(i,range);
        var bottom = new Vec(i,-range);
        var left = new Vec(-range,i);
        var right = new Vec(range,i);
        screen.drawLine(top,bottom,_func_color);
        screen.drawLine(left,right,_func_color);
    }
    screen.render();
}
function makeTriangle(n,screen) {
    if(!screen instanceof Screen) return;
    if (n <= 0) n = 1;
    n++;
    var l = 2;
    var step = l / n;
    var yStart = l / 2 - (l / 2) / n;

    var range = screen.getIncrements();

    var points = [];
    for (let i = 0; i < n; i++) {
        var y = yStart - step * i;
        var xStart = (-step * i) / 2
        for (let j = 0; j <= i; j++) {
            var x = xStart + step * j;
            points.push(new Vec(x*range,y*range));
            console.log(points[points.length-1]);
        }

    }
    if(points.length < 3) return;
    for(let i = 0; i < points.length;i+=3){
        screen.drawLine(points[i],points[i+1],_func_color);
        screen.drawLine(points[i],points[i+2],_func_color);
        screen.drawLine(points[i+1],points[i+2],_func_color);
    }
}
function makeRings(n) {
    if (n <= 0) n = 1;
    var radius = 1;
    var step = radius / n;
    var points = [];
    var r1 = 0;
    while (r1 < radius) {
        var deg1 = 0;
        while (deg1 < 360) {
            var x = r1 * Math.cos(deg1 * (Math.PI / 180));
            var y = r1 * Math.sin(deg1 * (Math.PI / 180));
            points.push(x); points.push(y);
            deg1 += 1;
        }
        r1 += step;
    }
    return points;

}
function sunflower(n) {
    if (n <= 0) n = 1;
    var turnFraction = ((1 + Math.sqrt(5)) / 2);
    //var turnFraction = n;
    //var n = 1000;
    var points = [];
    for (let i = 0; i < n; i++) {
        var dst = Math.sqrt(i / (n - 1.0));
        var angle = 2 * Math.PI * turnFraction * i;

        var x = dst * Math.cos(angle);
        var y = dst * Math.sin(angle);

        points.push(x); points.push(y);

    }
    return points;
}
function turnFraction(n) {
    //var turnFraction = ( (1 + Math.sqrt(5)) / 2 ) ;
    var turnFraction = n/1000;
    console.log(turnFraction);
    var p = 1000;
    var points = [];
    for (let i = 0; i < p; i++) {
        var dst = Math.sqrt(i / (p - 1.0));
        var angle = 2 * Math.PI * turnFraction * i;

        var x = dst * Math.cos(angle);
        var y = dst * Math.sin(angle);

        points.push(x); points.push(y);

    }
    return points;
}
function makeExp(n) {
    var step = .1 / n;
    if (step == 0) step = .1;
    if (step < 0) step *= -1;
    var points = [];

    for (let i = -1; i < 1; i += step) {
        var x = i;
        var y = Math.pow(x, n);
        points.push(x); points.push(y);
    }


    return points;

}
function makeCos(n) {
    var step = .1 / n;
    if (step == 0) step = .1;
    if (step < 0) step *= -1;
    var points = [];

    for (let i = -1; i < 1; i += step) {
        var x = i;
        var y = (1 / (2)) * Math.cos(n * x);
        points.push(x); points.push(y);
    }
    return points;

}
function flower(n) {
    var a = 1;
    var points = [];
    var step = Math.PI / 180;
    for (let i = 0; i < 2 * Math.PI; i += step) {
        var x = a * Math.cos(n * i) * Math.cos(i);
        var y = a * Math.cos(n * i) * Math.sin(i);
        points.push(new Vec(x,y));
    }
    return points;
}
function projectile(n) {
    var points = [];

    var x_vel = (n / 2) * Math.cos(Math.PI / 4);
    var y_vel = (n / 2) * Math.sin(Math.PI / 4);
    var x_i = -1;
    var y_i = -1;
    for (let i = 0; i < 2; i += .01) {
        var x = x_i + (x_vel * i);
        var y = y_i + (y_vel * i) + (.5 * -9.81 * i * i);

        points.push(x); points.push(y);
    }
    return points;
}