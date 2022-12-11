/// HELPER FUNCTION TO RESCALE POINTS 
/// @param screen refers to a Screen
// @param pen ScreenObj optional if want to scale points to pen location 
function getScaledPointList(points,screen,pen=null) {
    if(!screen instanceof Screen) return;
    var range = screen.getIncrements();
    for(let i = 0; i < points.length;i++){
        if(pen == null){
            points[i] =  p = vMath(points[i],'*',range);
            points[i].z = 1;
        }else{
            points[i] =  vMath(points[i],'*',pen.getWidth()*(range/30));
            points[i].z = 1;
            var trans = pen.getWorldMatrix();
            points[i] = vMath(trans,'*',points[i]);
        }
    }
    return points;
}
/// ALL FUNCTIONS RETURN POINTS IN RANGE FROM -1 to 1 
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
            points.push(new Vec(x,y)); 
        }
    }
    return points;
}
function getTriangle(n) {
    if (n <= 0) n = 1;
    var l = 1;
    var step = l / n;
    var yStart = l / 2 - (l / 2) / n;
    var points = [];
    for (let i = 0; i < n; i++) {
        var y = yStart - step * i;
        var xStart = (-step * i) / 2
        for (let j = 0; j <= i; j++) {
            var x = xStart + step * j;
            points.push(new Vec(x,y));
        }
    }
    return points;
}
function getRings(n) {
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
            points.push(new Vec(x,y));
            deg1 += 1;
        }
        r1 += step;
    }
    return points;

}
function getSunflower(n) {
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

        points.push(new Vec(x,y));

    }
    return points;
}
function getTurnFraction(n) {
    //var turnFraction = ( (1 + Math.sqrt(5)) / 2 ) ;
    var turnFraction = n/1000;
    var p = 1000;
    var points = [];
    for (let i = 0; i < p; i++) {
        var dst = Math.sqrt(i / (p - 1.0));
        var angle = 2 * Math.PI * turnFraction * i;

        var x = dst * Math.cos(angle);
        var y = dst * Math.sin(angle);

        points.push(new Vec(x,y));

    }
    return points;
}
function getExp(n) {
    var step = .1 / n;
    if (step == 0) step = .1;
    if (step < 0) step *= -1;
    var points = [];

    for (let i = -1; i < 1; i += step) {
        var x = i;
        var y = Math.pow(x, n);
        points.push(new Vec(x,y));
    }


    return points;

}
function getCos(n) {
    var step = .1 / n;
    if (step == 0) step = .1;
    if (step < 0) step *= -1;
    var points = [];

    for (let i = -1; i < 1; i += step) {
        var x = i;
        var y = (1 / (2)) * Math.cos(n * x);
        points.push(new Vec(x,y));
    }
    return points;

}
function getFlower(n) {
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
function getProjectile(n) {
    var points = [];

    var x_vel = (n / 2) * Math.cos(Math.PI / 4);
    var y_vel = (n / 2) * Math.sin(Math.PI / 4);
    var x_i = -1;
    var y_i = -1;
    for (let i = 0; i < 2; i += .01) {
        var x = x_i + (x_vel * i);
        var y = y_i + (y_vel * i) + (.5 * -9.81 * i * i);
        points.push(new Vec(x,y));
    }
    return points;
}
