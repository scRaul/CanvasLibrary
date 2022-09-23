class Vec{
    x=0;y=0;z=0;
    constructor(x,y,z){ this.x = x;this.y = y;this.z = z; }
}
class Mat{
    x1=0; y1=0; z1=0;
    x2=0; y2=0; z2=0;
    x3=0; y3=0; z3=0;
    constructor(x1,y1,z1,x2,y2,z2,x3,y3,z3){
        this.x1 = x1; this.y1 = y1; this.z1 = z1;
        this.x2 = x2; this.y2 = y2; this.z2 = z2;
        this.x3 = x3; this.y3 = y3; this.z3 = z3;
    }
}
function GetABtype(a,b){
    var aType = (a instanceof Vec) ? "Vec" : "Nill";
   aType = (a instanceof Mat) ? "Mat" : aType; 
   if(aType == "Nill"){
        aType = Object.prototype.toString.call(a).match(/^\[object (.*)\]$/)[1];
        aType = (aType == 'Number') ? "Num" : "Nill"
   }

   var bType = (b instanceof Vec) ? "Vec" : "Nill";
   bType = (b instanceof Mat) ? "Mat" : bType; 
   if(bType == "Nill"){
        bType = Object.prototype.toString.call(b).match(/^\[object (.*)\]$/)[1];
        bType = (bType == 'Number') ? "Num" : "Nill";
   }
   result =  {a:aType,b:bType};
   return result;
}

function vMath(a,o,b){
    switch(o){
        case '+': break;
        case '-': break;
        case '*': break;
        default: return "invalid operation";
    }
    var abType = GetABtype(a,b);
    if(abType.a == "Nill" || abType.b == "Nill") return "invalid type(s)";

    //vector o vector 
    if(abType.a == "Vec" && abType.b == "Vec")
        return vectorMath(a,o,b);
    //number * vector || vector * number 
    if(abType.a == "Vec" && abType.b == "Num" && o == '*')
        return new Vec(a.x*b,a.y*b,a.z*b);
    if(abType.a == "Num" && abType.b == "Vec" && o == '*')
        return new Vec(b.x*a,b.y*a,b.z*a);

    //Matrix * vector 
    if(abType.a == "Mat" && abType.b == "Vec"  && o == '*')
        return mMultV(a,b);

    //Matrix * Matrix
    if(abType.a == "Mat" && abType.b == "Mat"  && o == '*')
        return mMultm(a,b);
    if(abType.a == "Num" && abType.b == "Mat"  && o == '*')
        return new Mat( b.x1 * a, b.y1*a, b.z1 * a,
                        b.x2 * a, b.y2*a, b.z2 * a,   
                        b.x3 * a, b.y3*a, b.z3 * a);
    if(abType.a == "Mat" && abType.b == "Num"  && o == '*')
        return new Mat( a.x1 * b, a.y1*b, a.z1 * b,
                        a.x2 * b, a.y2*b, a.z2 * b,   
                        a.x3 * b, a.y3*b, a.z3 * b);
    

    return "sorry can't do that";
}

function vectorMath(a,o,b){
    switch(o){
        case '+': return vAdd(a,b);
        case '-': return vAdd(a,new Vec(-b.x,-b.y,-b.z));
        default:  return "invalid operation";
    }
}
function vAdd(a,b){  return new Vec(a.x+b.x,a.y+b.y,a.z+b.z); }

function mMultV(m,b){
    var x = (m.x1 * b.x) + (m.y1 * b.y) + (m.z1 * b.z);
    var y = (m.x2 * b.x) + (m.y2 * b.y) + (m.z2 * b.z);
    var z = (m.x3 * b.x) + (m.y3 * b.y) + (m.z3 * b.z);
     
    return new Vec(x,y,z);
}
function mMultm(m1,m2){
    var b = new Vec(m2.x1,m2.y1,m2.z1);
    var c1 = mMultV(m1,b);
    b.x = m2.x2;b.y= m2.y2;b.z= m2.z2;
    var c2 = mMultV(m1,b);
    b.x = m2.x3;b.y= m2.y3;b.z= m2.z3;
    var c3 =  mMultV(m1,b);

    return new Mat(
        c1.x,c2.x,c3.x,
        c1.y,c2.y,c3.y,
        c1.z,c2.z,c3.z
    );

}
