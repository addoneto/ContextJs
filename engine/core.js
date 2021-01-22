let canvas, ctx, aspectRatio = null, padding, fullscreen = false;
let FPS, fpsInterval = 1000 / FPS, lastFrameTime, deltaT, now, startedLoop;
let body;
let gFill, gStrokeWeight, gStrokeColor;
window.onload = function () {
    body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
    try {
        start();
    }
    catch (err) {
        console.error('Start function not found');
    }
    updateLoop();
    lastFrameTime = Date.now();
    fixedUpdateLoop();
    startedLoop = true;
};
function setFrameRate(_fps) {
    if (startedLoop)
        return console.error('Cannot set Framerate after start');
    FPS = _fps;
    fpsInterval = 1000 / FPS;
}
function fixedUpdateLoop() {
    requestAnimationFrame(fixedUpdateLoop);
    now = Date.now();
    deltaT = now - lastFrameTime;
    if (deltaT > fpsInterval) {
        lastFrameTime = now - (deltaT % fpsInterval);
        try {
            fixedUpdate();
        }
        catch (err) { }
    }
}
function updateLoop() {
    try {
        update();
        requestAnimationFrame(updateLoop);
    }
    catch (err) { }
}
function createCanvas(_width = 500, _height = 500) {
    canvas = document.createElement('canvas');
    body.appendChild(canvas);
    canvas.width = _width;
    canvas.height = _height;
    ctx = canvas.getContext('2d');
    fill('grey');
    stroke(1, 'black');
}
function createFullScreenCanvas() {
    fullscreen = true;
    createCanvas();
    window.addEventListener('resize', canvasResize);
    canvasResize();
}
function createResponsiveCanvas(aspectRatioX, aspectRatioY, _padding) {
    createCanvas();
    aspectRatio = [aspectRatioX, aspectRatioY];
    padding = _padding;
    window.addEventListener('resize', canvasResize);
    canvasResize();
}
function canvasResize(_w = null, _h = null) {
    if (fullscreen) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        return;
    }
    if (_w && _h) {
        canvas.width = _w;
        canvas.height = _h;
        return;
    }
    if (aspectRatio) {
        let width = window.innerWidth, height = window.innerHeight;
        let w, h;
        if (aspectRatio[0] > aspectRatio[1]) {
            w = width;
            h = w * aspectRatio[1] / aspectRatio[0];
        }
        else if (aspectRatio[0] == aspectRatio[1]) {
            w = width >= height ? height : width;
            h = w;
        }
        else {
            h = height;
            w = h * aspectRatio[0] / aspectRatio[1];
        }
        canvas.width = w - padding;
        canvas.height = h - padding;
    }
}
function background(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function rect(x, y, w, h) {
    ctx.rect(x, y, w, h);
    style();
}
function circle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    style();
}
function ellipse(x, y, w, h) {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.closePath();
    style();
}
function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.lineWidth = gStrokeWeight;
    ctx.strokeStyle = gStrokeColor;
    if (gStrokeWeight && gStrokeColor)
        ctx.stroke();
}
function noFill() {
    gFill = null;
}
function noStroke() {
    gStrokeWeight = null;
    gStrokeColor = null;
}
function stroke(weight, color) {
    gStrokeWeight = weight;
    gStrokeColor = color;
}
function fill(color) {
    gFill = color;
}
function style() {
    ctx.fillStyle = gFill;
    ctx.lineWidth = gStrokeWeight;
    ctx.strokeStyle = gStrokeColor;
    if (gFill)
        ctx.fill();
    if (gStrokeWeight && gStrokeColor)
        ctx.stroke();
}
async function loadImage(source) {
    return new Promise(resolve => {
        const img = new Image();
        img.src = source;
        img.onload = function () {
            resolve(this);
        };
    });
}
function callbackLoadImage(source, callback) {
    const img = new Image();
    img.src = source;
    img.onload = callback;
    return img;
}
function image(src, sourceXoffset = 0, sourceYoffset = 0, sourceWidth, sourceHeight, finalX, finalY, finalWidth, finalHeight) {
    let image;
    if (typeof src === "string") {
        image = new Image();
        image.src = src;
    }
    else if (typeof src === "object") {
        image = src;
    }
    else
        return;
    image.onload = function () {
        if (!sourceWidth)
            sourceWidth = image.width;
        if (!sourceHeight)
            sourceHeight = image.height;
        if (!finalWidth)
            finalWidth = image.width;
        if (!finalHeight)
            finalHeight = image.height;
        ctx.drawImage(image, sourceXoffset, sourceYoffset, sourceWidth, sourceHeight, finalX, finalY, finalWidth, finalHeight);
    };
}
function map(value, start1, stop1, start2, stop2) {
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}
function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function deg2rad(degrees_angle) {
    return degrees_angle * Math.PI / 180;
}
function sin(degrees_angle) {
    return Math.sin(deg2rad(degrees_angle));
}
function cos(degrees_angle) {
    return Math.cos(deg2rad(degrees_angle));
}
function tan(degrees_angle) {
    return Math.tan(deg2rad(degrees_angle));
}
class Vector2 {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    sqrMag() { return this.x * this.x + this.y * this.y; }
    mag() { return Math.sqrt(this.sqrMag()); }
    normalize() {
        let mag = this.mag();
        return new Vector2(this.x / mag, this.y / mag);
    }
    Normalize() {
        let mag = this.mag();
        this.x /= mag;
        this.y /= mag;
    }
    distSqr(vector) {
        let deltaX = this.x - vector.x;
        let deltaY = this.y - vector.y;
        return deltaX * deltaX + deltaY * deltaY;
    }
    dist(vector) {
        return Math.sqrt(this.distSqr(vector));
    }
    static dist(vector1, vector2) {
        let deltaX = vector1.x - vector2.x;
        let deltaY = vector1.y - vector2.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    static angleToDirection(degrees_angle) {
        return new Vector2(Math.cos(deg2rad(degrees_angle)), Math.sin(deg2rad(degrees_angle)));
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    static add(vector1, vector2) {
        return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
    }
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }
    static subtract(vector1, vector2) {
        return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y);
    }
    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
    }
    static divide(vector1, vector2) {
        return new Vector2(vector1.x / vector2.x, vector1.y / vector2.y);
    }
    multiply(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
    }
    static multiply(vector1, vector2) {
        return new Vector2(vector1.x * vector2.x, vector1.y * vector2.y);
    }
}
function perlinNoise(x, y) {
    return 0;
}
function getPixels(x = 0, y = 0, w = null, h = null) {
    if (!w)
        w = canvas.width;
    if (!h)
        h = canvas.height;
    return ctx.getImageData(x, y, w, h);
}
function updatePixels(imgData, x = 0, y = 0) {
    ctx.putImageData(imgData, x, y);
}
const ARROW_UP = 38, ARROW_DOWN = 40, ARROW_LEFT = 37, ARROW_RIGHT = 39, SPACE = 32;
document.addEventListener('keydown', function (event) {
    let key = event.which || event.keyCode;
    try {
        keyDown(key);
    }
    catch (err) { }
});
document.addEventListener('keyup', function (event) {
    let key = event.which || event.keyCode;
    try {
        keyUp(key);
    }
    catch (err) { }
});
let mouseX, mouseY;
document.onmousemove = event => {
    event = event || window.event;
    const rect = canvas.getBoundingClientRect();
    mouseX = Math.trunc(event.clientX - rect.left);
    mouseY = Math.trunc(event.clientY - rect.top);
};
canvas.onmousedown = event => {
    event = event || window.event;
    const rect = canvas.getBoundingClientRect();
    try {
        click(Math.trunc(event.clientX - rect.left), Math.trunc(event.clientY - rect.top));
    }
    catch (err) { }
};
