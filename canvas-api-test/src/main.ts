window.onload = () => {

    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");


    var stage = new DisplayObjectContainer();

    setInterval(() => {
        
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2D);

    }, 100)


    //文字
    var text = new TextField();
    text.x = 70;
    text.y = 70;
    text.text = "Jasper";
    text.color = "#000000";
    text.size = 100;
    text.alpha = 0.1;

    var text2 = new TextField();
    text2.x = 70;
    text2.y = 200;
    text2.text = "Jack";
    text2.color = "#000000";
    text2.size = 100;
    text2.alpha = 0.1;

    var text3 = new TextField();
    text3.x = 70;
    text3.y = 300;
    text3.text = "John";
    text3.color = "#000000";
    text3.size = 100;
    text3.alpha = 0.1;



    var shape = new Shape();
    shape.graphics.beginFill("#000000");

    shape.graphics.moveTo(200,200);
    shape.graphics.lineTo(100,100);
    shape.graphics.lineTo(0,200);

    shape.graphics.drawCircle(30,30,30);
    shape.graphics.drawRect(50,50,100,50);

    shape.graphics.moveTo(0,0);
    shape.graphics.lineTo(100,100);
    shape.graphics.lineTo(200,0);

    shape.graphics.endFill();
    shape.scaleX = 0.5;


    
    
    //图片
    var image = document.createElement("img");
    image.src = "avater.jpg";

    image.onload = () => {

        var avater = new Bitmap();
        avater.image = image;
        avater.x = 0;
        avater.width = 300;
        avater.height = 300;
        avater.alpha = 0.5;

        var stage2 = new DisplayObjectContainer();
        stage2.x = 300;
        stage2.addChild(avater);
        stage.x = 100;
        stage.alpha = 1;
        stage.addChild(text);
        stage.addChild(stage2);
        stage.addChild(text2);
        stage.addChild(text3);
        
        stage.removeChild(text2);
        shape.y = 100;
        
        stage.addChild(shape);

    }

}

interface Drawable {
    
    draw(context2D:CanvasRenderingContext2D);
    remove();

}

class DisplayObject implements Drawable {

    x:number = 0;
    y:number = 0;
    scaleX:number = 1;
    scaleY:number = 1;
    rotation:number = 0;
    parent:DisplayObjectContainer = null;
    matrix:math.Matrix = null;
    alpha:number = 1;
    globalAlpha = 1;
    

    constructor() {
        this.matrix = new math.Matrix();
    }

    remove() {
        this.parent = null;
    }

    checkState() {
        this.matrix.updateFromDisplayObject(this.x,this.y,this.scaleX,this.scaleY,this.rotation);
        if(this.parent) {
            this.matrix = math.matrixAppendMatrix(this.matrix,this.parent.matrix);
            this.globalAlpha = this.parent.globalAlpha * this.alpha; 
        }else {
            this.globalAlpha = this.alpha;
        }
        
    }

    draw(context2D:CanvasRenderingContext2D) {
        this.checkState();
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.matrix.a,this.matrix.b,this.matrix.c,this.matrix.d,this.matrix.tx,this.matrix.ty);

        this.render(context2D);

    }

    render(context2D:CanvasRenderingContext2D) {

    }



}

class DisplayObjectContainer implements Drawable {
    
    x:number = 0;
    y:number = 0;
    scaleX:number = 1;
    scaleY:number = 1;
    rotation:number = 0;

    matrix:math.Matrix = null;

    alpha:number = 1;
    globalAlpha:number = 1;
    
    parent:DisplayObjectContainer = null;

    array:Drawable[] = [];

    constructor() {
        this.matrix = new math.Matrix();
    }

    remove() {
        this.parent = null;
    }

    checkState() {
        this.matrix.updateFromDisplayObject(this.x,this.y,this.scaleX,this.scaleY,this.rotation);
        if(this.parent) {
            this.matrix = math.matrixAppendMatrix(this.matrix,this.parent.matrix);
            this.globalAlpha = this.parent.globalAlpha * this.alpha; 
        }else {
            this.globalAlpha = this.alpha;
        }
        
    }

    draw(context2D:CanvasRenderingContext2D) {
        this.checkState();
        for (let drawable of this.array) {
            drawable.draw(context2D);
        }
    }

    render() {

    }

    addChild(displayObject:DisplayObject){

        this.removeChild(displayObject);
        this.array.push(displayObject);
        displayObject.parent = this;
        
    }

    removeChild(child:Drawable) {
        var tempArr = this.array.concat();

        for(let each of tempArr){
            if(each == child){
                var index = this.array.indexOf(child);
                tempArr.splice(index,1);
                this.array = tempArr;
                child.remove();
                break;
            }
        }
    
    }


}

class Bitmap extends DisplayObject {
    
    image:HTMLImageElement = null;
    width:number;
    height:number;
    src:string;

    constructor() {
        super();
    }


    render(context2D:CanvasRenderingContext2D) {
        //context2D.globalAlpha = this.alpha;
        //context2D.drawImage(this.image,this.x,this.y,this.width,this.height);
        context2D.drawImage(this.image,0,0,this.width,this.height);
        //context2D.drawImage(this.image,this.matrix.tx,this.matrix.ty,this.width*this.matrix.b,this.height*this.matrix.c);
        
    }
}

class TextField extends DisplayObject {
    
    text:string = "";
    color:string = "";
    size:number = 40;
    font:string = "Arial";

    render(context2D:CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.font = this.size +"px" + " " + this.font;
        context2D.fillText(this.text,0,0);
        //console.log("alpha:" + this.alpha);
        //console.log("globalAlpha:" + this.globalAlpha);
        //字体颜色越来越深？
    }

}


class Shape extends DisplayObject {

    graphics = new Graphics();
    
    public constructor() {
        super();
    }

    render(context2D:CanvasRenderingContext2D) {
        
        for(let info of this.graphics.shapeInfo){
            context2D.fillStyle = this.graphics.color;
            context2D.globalAlpha = info.alpha;

            switch(info.type) {

                case ShapeType.LINE:
                    context2D.moveTo(info.x,info.y);
                    context2D.lineTo(info.endx,info.endy);
                    context2D.stroke();
                    break;

                case ShapeType.RECT:
                    context2D.fillRect(info.x,info.y,info.width,info.height);
                    break;
                
                case ShapeType.CIRCLE:
                    context2D.beginPath();
                    context2D.arc(info.x,info.y,info.radius,0,Math.PI*2,true);
                    context2D.closePath();
                    context2D.fill();
                    break;

            }
        }
        
        
    }

    

}

var ShapeType = {

    LINE:0,
    RECT:1,
    CIRCLE:2
 
}

class Graphics {

    _x:number;
    _y:number;

    color:string = "";
    shapeInfo:ShapeInfo[] = [];

    public beginFill(color:string) {
        this.color = color;
    }

    public endFill() {

    }

    public drawCircle(x:number,y:number,radius:number) {

        this.shapeInfo.push(new CircleInfo(x,y,radius));
    }

    public drawRect(x:number,y:number,width:number,height:number) {

        this.shapeInfo.push(new RectInfo(x,y,width,height));
    }

    public lineTo(x:number,y:number) {
        this.shapeInfo.push(new LineInfo(this._x,this._y,x,y));
        this._x = x;
        this._y = y;
    }

    public moveTo(x:number,y:number) {
        this._x = x;
        this._y = y;
    }


}

class ShapeInfo {
    type:number;
    x:number;
    y:number;
    alpha:number = 1;
    
    radius:number;
    width:number;
    height:number;
       
    endx:number;
    endy:number;
}

class CircleInfo extends ShapeInfo {
    type = ShapeType.CIRCLE;

    public constructor(x:number,y:number,radius:number) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

}

class RectInfo extends ShapeInfo {
    type = ShapeType.RECT;

    public constructor(x:number,y:number,width:number,height:number) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


}

class LineInfo extends ShapeInfo {
    type = ShapeType.LINE;

    public constructor(_x:number,_y:number,x:number,y:number) {
        super();
        this.x = _x;
        this.y = _y;
        this.endx = x;
        this.endy = y;
      
    }
 
}


module math {


    export class Point {
        x: number;
        y: number;
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    export function pointAppendMatrix(point: Point, m: Matrix): Point {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);

    }

    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    export function invertMatrix(m: Matrix): Matrix {


        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;

        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }

        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;

    }

    export function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix {

        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }

    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD: number = Math.PI / 180;


    export class Matrix {

        constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        public a: number;

        public b: number;

        public c: number;

        public d: number;

        public tx: number;

        public ty: number;

        public toString(): string {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        }

        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;

            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;

        }
    }
}








