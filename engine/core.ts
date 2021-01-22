let canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    aspectRatio: number[] = null,
    padding: number,
    fullscreen: boolean = false;

let FPS: number,
    fpsInterval: number = 1000 / FPS,
    lastFrameTime: number,
    deltaT: number,
    now: number,
    startedLoop: boolean;

let body: HTMLBodyElement;

let gFill: string,
    gStrokeWeight: number,
    gStrokeColor: string;

// ************************************************************************** //
// ********************************* START ********************************** //
// ************************************************************************** //

window.onload = function (): void {
    body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';

    // TODO: blocking preload function that wait until async operations finishes

    try {
        // @ts-ignore
        start();
    } catch (err) {
        console.error('Start function not found');
    }

    updateLoop();

    lastFrameTime = Date.now();
    fixedUpdateLoop();
    startedLoop = true;
}

// ************************************************************************** //
// ******************************* GAME LOOPS ******************************* //
// ************************************************************************** //

function setFrameRate(_fps: number): void {
    if (startedLoop)
        return console.error('Cannot set Framerate after start');

    FPS = _fps;
    fpsInterval = 1000 / FPS;
}

function fixedUpdateLoop(): void {
    requestAnimationFrame(fixedUpdateLoop);

    now = Date.now();
    deltaT = now - lastFrameTime;

    if (deltaT > fpsInterval) {
        // subtract by (deltaT % fpsInterval) makes sure lastFrameTime is multiple of fpsInterval
        lastFrameTime = now - (deltaT % fpsInterval);

        try {
            // @ts-ignore
            fixedUpdate();
        } catch (err) { }
    }
}

function updateLoop(): void {
    try {
        // @ts-ignore
        update();
        requestAnimationFrame(updateLoop);
    } catch (err) { }
}

// ************************************************************************** //
// ********************************* CANVAS ********************************* //
// ************************************************************************** //

function createCanvas(_width: number = 500, _height: number = 500) {
    canvas = document.createElement('canvas');
    body.appendChild(canvas);

    canvas.width = _width;
    canvas.height = _height;

    ctx = canvas.getContext('2d');

    // default shape config
    fill('grey'); stroke(1, 'black');
}

function createFullScreenCanvas(): void {
    fullscreen = true;
    createCanvas();
    // @ts-ignore
    window.addEventListener('resize', canvasResize);
    canvasResize();
}

function createResponsiveCanvas(aspectRatioX: number, aspectRatioY: number, _padding: number): void {
    createCanvas();
    aspectRatio = [aspectRatioX, aspectRatioY];
    padding = _padding;

    // @ts-ignore
    window.addEventListener('resize', canvasResize);
    canvasResize();
}

function canvasResize(_w: number = null, _h: number = null): void {
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
        let width: number = window.innerWidth,
            height: number = window.innerHeight;

        let w: number, h: number;

        if (aspectRatio[0] > aspectRatio[1]) {
            w = width;
            h = w * aspectRatio[1] / aspectRatio[0];

        } else if (aspectRatio[0] == aspectRatio[1]) {
            w = width >= height ? height : width;
            h = w;

        } else {
            h = height;
            w = h * aspectRatio[0] / aspectRatio[1];
        }

        canvas.width = w - padding;
        canvas.height = h - padding;
    }
}

// ************************************************************************** //
// ********************************* SHAPES ********************************* //
// ************************************************************************** //

function background(color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clear(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function rect(x: number, y: number, w: number, h: number): void {
    ctx.rect(x, y, w, h);
    style();
}

function circle(x: number, y: number, radius: number): void {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();

    style();
}

function ellipse(x: number, y: number, w: number, h: number): void {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.closePath();

    style();
}

function line(x1: number, y1: number, x2: number, y2: number): void {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();

    ctx.lineWidth = gStrokeWeight;
    ctx.strokeStyle = gStrokeColor;
    if (gStrokeWeight && gStrokeColor) ctx.stroke();
}

// ************************************************************************** //
// ****************************** PATH STYLING ****************************** //
// ************************************************************************** //

function noFill(): void{
    gFill = null;
}

function noStroke(): void{
    gStrokeWeight = null;
    gStrokeColor = null;
}


function stroke(weight: number, color: string): void {
    gStrokeWeight = weight;
    gStrokeColor = color;
}

function fill(color: string): void {
    gFill = color;
}

function style(): void {
    ctx.fillStyle = gFill;
    ctx.lineWidth = gStrokeWeight;
    ctx.strokeStyle = gStrokeColor;

    if (gFill) ctx.fill();
    if (gStrokeWeight && gStrokeColor) ctx.stroke();
}

// ************************************************************************** //
// ********************************* IMAGES ********************************* //
// ************************************************************************** //

async function loadImage(source: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
        const img = new Image();
        img.src = source;
        img.onload = function (): void {
            // @ts-ignore
            resolve(this);
        }
    });
}

function callbackLoadImage(source: string, callback: any): HTMLImageElement {
    const img: HTMLImageElement = new Image();
    img.src = source;
    img.onload = callback;
    return img;
}

function image(src: any,
    sourceXoffset: number = 0, sourceYoffset: number = 0,
    sourceWidth: number, sourceHeight: number,
    finalX: number, finalY: number,
    finalWidth: number, finalHeight: number): void {

    let image: HTMLImageElement;

    if (typeof src === "string") {
        image = new Image();
        image.src = src;
    } else if (typeof src === "object") {
        image = src;
    } else return;

    image.onload = function (): void {
        if (!sourceWidth) sourceWidth = image.width;
        if (!sourceHeight) sourceHeight = image.height;

        if (!finalWidth) finalWidth = image.width;
        if (!finalHeight) finalHeight = image.height;

        ctx.drawImage(image, sourceXoffset, sourceYoffset, sourceWidth, sourceHeight, finalX, finalY, finalWidth, finalHeight);
    }

}

// ************************************************************************** //
// ***************************** MATH FUNCTIONS ***************************** //
// ************************************************************************** //

function map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

function lerp(v0: number, v1: number, t: number): number {
    return (1 - t) * v0 + t * v1;
}

function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randint(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;

}

// ********************************* ANGLES ********************************* //

function deg2rad(degrees_angle: number): number {
    return degrees_angle * Math.PI / 180;
}

function sin(degrees_angle: number): number {
    return Math.sin(deg2rad(degrees_angle));
}

function cos(degrees_angle: number): number {
    return Math.cos(deg2rad(degrees_angle));
}

function tan(degrees_angle: number): number {
    return Math.tan(deg2rad(degrees_angle));
}

// ************************************************************************** //
// ******************************** VECTOR 2 ******************************** //
// ************************************************************************** //

class Vector2 {
    x: number;
    y: number;

    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }

    sqrMag() { return this.x * this.x + this.y * this.y; }

    mag() { return Math.sqrt(this.sqrMag()); }

    normalize() {
        let mag: number = this.mag();
        return new Vector2(this.x / mag, this.y / mag);
    }

    Normalize() {
        let mag: number = this.mag();
        this.x /= mag;
        this.y /= mag;
    }

    distSqr(vector: Vector2) {
        let deltaX = this.x - vector.x;
        let deltaY = this.y - vector.y;

        return deltaX * deltaX + deltaY * deltaY;
    }

    dist(vector: Vector2) {
        return Math.sqrt(this.distSqr(vector));
    }

    static dist(vector1: Vector2, vector2: Vector2) {
        let deltaX = vector1.x - vector2.x;
        let deltaY = vector1.y - vector2.y;

        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    static angleToDirection(degrees_angle: number) {
        return new Vector2(Math.cos(deg2rad(degrees_angle)),
            Math.sin(deg2rad(degrees_angle)));
    }

    add(vector: Vector2) {
        this.x += vector.x;
        this.y += vector.y;
    }

    static add(vector1: Vector2, vector2: Vector2) {
        return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    subtract(vector: Vector2) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    static subtract(vector1: Vector2, vector2: Vector2) {
        return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y);
    }


    divide(vector: Vector2) {
        this.x /= vector.x;
        this.y /= vector.y;
    }

    static divide(vector1: Vector2, vector2: Vector2) {
        return new Vector2(vector1.x / vector2.x, vector1.y / vector2.y);
    }

    multiply(vector: Vector2) {
        this.x *= vector.x;
        this.y *= vector.y;
    }

    static multiply(vector1: Vector2, vector2: Vector2) {
        return new Vector2(vector1.x * vector2.x, vector1.y * vector2.y);
    }
}

// ************************************************************************** //
// ********************************** NOISE ********************************* //
// ************************************************************************** //

function perlinNoise(x: number, y: number): number {
    return 0;
}

// ************************************************************************** //
// *************************** PIXEL MANIPULATION *************************** //
// ************************************************************************** //

// TODO: return only the Uint8ClampedArray pixel array

function getPixels(x: number = 0, y: number = 0, w: number = null, h: number = null): ImageData {
    if (!w) w = canvas.width;
    if (!h) h = canvas.height;

    return ctx.getImageData(x, y, w, h);
}

function updatePixels(imgData: ImageData, x: number = 0, y: number = 0): void {
    ctx.putImageData(imgData, x, y);
}

// ************************************************************************** //
// ********************************** INPUT ********************************* //
// ************************************************************************** //

const ARROW_UP: number    = 38, ARROW_DOWN: number  = 40, ARROW_LEFT: number  = 37,
      ARROW_RIGHT: number = 39, SPACE = 32;

document.addEventListener('keydown', function (event): void {
    let key = event.which || event.keyCode;
    try {
        // @ts-ignore
        keyDown(key);
    } catch (err) { }
});

document.addEventListener('keyup', function (event): void {
    let key = event.which || event.keyCode;
    try {
        // @ts-ignore
        keyUp(key);
    } catch (err) { }
});

let mouseX: number, mouseY: number;

document.onmousemove = event => {
    // @ts-ignore
    event = event || window.event;
    const rect: DOMRect = canvas.getBoundingClientRect();
    mouseX = Math.trunc(event.clientX - rect.left);
    mouseY = Math.trunc(event.clientY - rect.top);
};

canvas.onmousedown = event => {
    // @ts-ignore
    event = event || window.event;
    const rect: DOMRect = canvas.getBoundingClientRect();

    // @ts-ignore
    try { click(
        Math.trunc(event.clientX - rect.left),
        Math.trunc(event.clientY - rect.top)
    ) }
    catch (err) { }
}