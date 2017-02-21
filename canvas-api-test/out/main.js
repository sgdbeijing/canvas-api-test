var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    var stage = new DisplayObjectContainer();
    setInterval(function () {
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2D);
    }, 100);
    //文字
    var text = new TextField();
    text.x = 70;
    text.y = 70;
    text.text = "Evebus";
    text.color = "#000000";
    text.size = 100;
    text.alpha = 0.1;
    var text2 = new TextField();
    text2.x = 70;
    text2.y = 200;
    text2.text = "Jury";
    text2.color = "#000000";
    text2.size = 100;
    text2.alpha = 0.1;
    var text3 = new TextField();
    text3.x = 70;
    text3.y = 300;
    text3.text = "Zose";
    text3.color = "#000000";
    text3.size = 100;
    text3.alpha = 0.1;
    var shape = new Shape();
    shape.graphics.beginFill("#000000");
    shape.graphics.moveTo(200, 200);
    shape.graphics.lineTo(100, 100);
    shape.graphics.lineTo(0, 200);
    shape.graphics.drawCircle(30, 30, 30);
    shape.graphics.drawRect(50, 50, 100, 50);
    shape.graphics.moveTo(0, 0);
    shape.graphics.lineTo(100, 100);
    shape.graphics.lineTo(200, 0);
    shape.graphics.endFill();
    shape.scaleX = 0.5;
    //图片
    var image = document.createElement("img");
    image.src = "avater.jpg";
    image.onload = function () {
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
    };
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.parent = null;
        this.matrix = null;
        this.alpha = 1;
        this.globalAlpha = 1;
        this.matrix = new math.Matrix();
    }
    DisplayObject.prototype.remove = function () {
        this.parent = null;
    };
    DisplayObject.prototype.checkState = function () {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.matrix = math.matrixAppendMatrix(this.matrix, this.parent.matrix);
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
        }
        else {
            this.globalAlpha = this.alpha;
        }
    };
    DisplayObject.prototype.draw = function (context2D) {
        this.checkState();
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.tx, this.matrix.ty);
        this.render(context2D);
    };
    DisplayObject.prototype.render = function (context2D) {
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function () {
    function DisplayObjectContainer() {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.matrix = null;
        this.alpha = 1;
        this.globalAlpha = 1;
        this.parent = null;
        this.array = [];
        this.matrix = new math.Matrix();
    }
    DisplayObjectContainer.prototype.remove = function () {
        this.parent = null;
    };
    DisplayObjectContainer.prototype.checkState = function () {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.matrix = math.matrixAppendMatrix(this.matrix, this.parent.matrix);
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
        }
        else {
            this.globalAlpha = this.alpha;
        }
    };
    DisplayObjectContainer.prototype.draw = function (context2D) {
        this.checkState();
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.render = function () {
    };
    DisplayObjectContainer.prototype.addChild = function (displayObject) {
        this.removeChild(displayObject);
        this.array.push(displayObject);
        displayObject.parent = this;
    };
    DisplayObjectContainer.prototype.removeChild = function (child) {
        var tempArr = this.array.concat();
        for (var _i = 0, tempArr_1 = tempArr; _i < tempArr_1.length; _i++) {
            var each = tempArr_1[_i];
            if (each == child) {
                var index = this.array.indexOf(child);
                tempArr.splice(index, 1);
                this.array = tempArr;
                child.remove();
                break;
            }
        }
    };
    return DisplayObjectContainer;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.call(this);
        this.image = null;
    }
    Bitmap.prototype.render = function (context2D) {
        //context2D.globalAlpha = this.alpha;
        //context2D.drawImage(this.image,this.x,this.y,this.width,this.height);
        context2D.drawImage(this.image, 0, 0, this.width, this.height);
        //context2D.drawImage(this.image,this.matrix.tx,this.matrix.ty,this.width*this.matrix.b,this.height*this.matrix.c);
    };
    return Bitmap;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "";
        this.size = 40;
        this.font = "Arial";
    }
    TextField.prototype.render = function (context2D) {
        context2D.fillStyle = this.color;
        context2D.font = this.size + "px" + " " + this.font;
        context2D.fillText(this.text, 0, 0);
        //console.log("alpha:" + this.alpha);
        //console.log("globalAlpha:" + this.globalAlpha);
        //字体颜色越来越深？
    };
    return TextField;
}(DisplayObject));
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape() {
        _super.call(this);
        this.graphics = new Graphics();
    }
    Shape.prototype.render = function (context2D) {
        for (var _i = 0, _a = this.graphics.shapeInfo; _i < _a.length; _i++) {
            var info = _a[_i];
            context2D.fillStyle = this.graphics.color;
            context2D.globalAlpha = info.alpha;
            switch (info.type) {
                case ShapeType.LINE:
                    context2D.moveTo(info.x, info.y);
                    context2D.lineTo(info.endx, info.endy);
                    context2D.stroke();
                    break;
                case ShapeType.RECT:
                    context2D.fillRect(info.x, info.y, info.width, info.height);
                    break;
                case ShapeType.CIRCLE:
                    context2D.beginPath();
                    context2D.arc(info.x, info.y, info.radius, 0, Math.PI * 2, true);
                    context2D.closePath();
                    context2D.fill();
                    break;
            }
        }
    };
    return Shape;
}(DisplayObject));
var ShapeType = {
    LINE: 0,
    RECT: 1,
    CIRCLE: 2
};
var Graphics = (function () {
    function Graphics() {
        this.color = "";
        this.shapeInfo = [];
    }
    Graphics.prototype.beginFill = function (color) {
        this.color = color;
    };
    Graphics.prototype.endFill = function () {
    };
    Graphics.prototype.drawCircle = function (x, y, radius) {
        this.shapeInfo.push(new CircleInfo(x, y, radius));
    };
    Graphics.prototype.drawRect = function (x, y, width, height) {
        this.shapeInfo.push(new RectInfo(x, y, width, height));
    };
    Graphics.prototype.lineTo = function (x, y) {
        this.shapeInfo.push(new LineInfo(this._x, this._y, x, y));
        this._x = x;
        this._y = y;
    };
    Graphics.prototype.moveTo = function (x, y) {
        this._x = x;
        this._y = y;
    };
    return Graphics;
}());
var ShapeInfo = (function () {
    function ShapeInfo() {
        this.alpha = 1;
    }
    return ShapeInfo;
}());
var CircleInfo = (function (_super) {
    __extends(CircleInfo, _super);
    function CircleInfo(x, y, radius) {
        _super.call(this);
        this.type = ShapeType.CIRCLE;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    return CircleInfo;
}(ShapeInfo));
var RectInfo = (function (_super) {
    __extends(RectInfo, _super);
    function RectInfo(x, y, width, height) {
        _super.call(this);
        this.type = ShapeType.RECT;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return RectInfo;
}(ShapeInfo));
var LineInfo = (function (_super) {
    __extends(LineInfo, _super);
    function LineInfo(_x, _y, x, y) {
        _super.call(this);
        this.type = ShapeType.LINE;
        this.x = _x;
        this.y = _y;
        this.endx = x;
        this.endy = y;
    }
    return LineInfo;
}(ShapeInfo));
var math;
(function (math) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    math.Point = Point;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    math.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
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
    math.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    math.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
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
        };
        return Matrix;
    }());
    math.Matrix = Matrix;
})(math || (math = {}));
//# sourceMappingURL=main.js.map