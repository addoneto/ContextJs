let canvas, ctx, aspectRatio, padding = 0, fullScreen = false;
let FPS = 60, fpsInterval =  1000 / FPS, lastFrameTime, deltaT, now;
let startedLoop = false;
let body;

let fillColor, strokeWeight, strokeColor;

window.onload = () => {
    body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';

    try{
        start();
    }catch(err){}

    if(!canvas) createFullScreenCanvas();

    lastFrameTime = Date.now();
    fixedUpdateLoop();
    startedLoop = true;

    updateLoop();
};

function setFrameRate(x){
    if(startedLoop) return console.error('Cannot set Frame Rate after start');
    FPS = x; fpsInterval =  1000 / FPS;
}

function fixedUpdateLoop(){
    requestAnimationFrame(fixedUpdateLoop);

    now = Date.now();
    deltaT = now - lastFrameTime;

    if(deltaT > fpsInterval){
        // subtract by (deltaT % fpsInterval) makes sure lastFrameTime is multiple of fpsInterval
        lastFrameTime = now - (deltaT % fpsInterval);

        try{ fixedUpdate();
        }catch(err){}
    }
}

function updateLoop(){
    try{
        update();
        requestAnimationFrame(updateLoop);
    }catch(err){}
}

function createCanvas(_width, _height){
    canvas = document.createElement('canvas');  
    body.appendChild(canvas);

    if(_width && _height){
        canvas.width = _width;
        canvas.height = _height;
    }

    ctx = canvas.getContext('2d');

    fill('grey');
    stroke(1,'black');
}

function createFullScreenCanvas(){
    fullScreen = true;

    createCanvas();

    window.addEventListener('resize', canvasResize);
    canvasResize();
}

function createResponsiveCanvas(aspectRadiusX, aspectRadiusY, p = 0){
    createCanvas();

    aspectRatio = [aspectRadiusX, aspectRadiusY];
    padding = p;

    window.addEventListener('resize', canvasResize);
    canvasResize();
}

function canvasResize(x, y){
    if(fullScreen){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight; 
        return;
    }

    // Resize by size
    if(x && y) {
        canvas.width = x;
        canvas.height = y;
        return;
    }

    // Resize by ratio
    if(aspectRatio){
        let width = window.innerWidth,
        height = window.innerHeight;

        let x,y;

        if(aspectRatio[0] > aspectRatio[1]){
            x = width;
            y = x * aspectRatio[1] / aspectRatio[0];
        }else if(aspectRatio[0] == aspectRatio[1]){
            if(width >= height){
                x = height;
            }else{
                x = width;
            }
            y = x;
        }else{
            y = height;
            x = y * aspectRatio[0] / aspectRatio[1];
        }

        canvas.width = x - padding;
        canvas.height = y - padding;
    }
}

function background(color){
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function rect(x, y, w, h){
    ctx.rect(x, y, w, h);

    pathStyle();
}

function circle(x, y, radius){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();

    pathStyle();
}

function elipse(x, y, w, h){
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.closePath();

    pathStyle();
}

function line(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();

    ctx.lineWidth = strokeWeight;
    ctx.strokeStyle = strokeColor;
    if(strokeWeight && strokeColor) ctx.stroke();
}

function stroke(weight, color){
    strokeWeight = weight;
    strokeColor = color;
}

function noFill(){
    fillColor = null;
}

function noStroke(){
    strokeWeight = null;
    strokeColor = null;
}

function fill(color){ fillColor = color; }

function pathStyle(){
    ctx.fillStyle = fillColor;
    ctx.lineWidth = strokeWeight;
    ctx.strokeStyle = strokeColor;

    if(fillColor) ctx.fill();
    if(strokeWeight && strokeColor) ctx.stroke();
}

function image(src, sourceXoffset = 0, sourceYoffset = 0, sourceWidth, sourceHeight,
    finalX, finalY, finalWidth, finalHeight){

    let image = new Image();
    image.src = src;

    if(!sourceWidth) sourceWidth = image.width;
    if(!sourceHeight) sourceHeight = image.height;

    if(!finalWidth) finalWidth = image.width;
    if(!finalHeight) finalHeight = image.height;

    ctx.drawImage(image, sourceXoffset, sourceYoffset, sourceWidth, sourceHeight, finalX, finalY, finalWidth, finalHeight);
}

function numberRemap(value, start1, stop1, start2, stop2){
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}

function random(min, max){
    return Math.random() * (max - min) + min;
    // 'float' random number between min - max
}

function canvasGetPixels(){
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
    // retuns an ImageData with .data being Uint8ClampedArray with the value of each pixel in the format rgba
}

function canvasUpdatePixels(newImageData){
    // pixelsArray.length should be equal to canvas.width * canvas.height * 4
    // let buffer = new Uint8ClampedArray(pixelsArray.length); 
    // let newCanvas = ctx.createImageData(canvas.width, canvas.height);
    //newCanvas.data.set(buffer);
    ctx.putImageData(newImageData, 0, 0);
}

class Vector2 {
    constructor(_x, _y){
        this.x = _x;
        this.y = _y;
    }

    sqrMag(){ return this.x * this.x + this.y * this.y; }

    mag(){ return Math.sqrt(sqrMag()); }

    normalize(){
        //this.divide(this.mag());
        let mag = this.mag();
        this.x /= mag;
        this.y /= mag;
    }

    distSqr(vec){
        let deltaX = this.x - vec.x;
        let deltaY = this.y - vec.y;

        return deltaX * deltaX + deltaY * deltaY;
    }

    dist(vec){
        return Math.sqrt(distSqr(vec));
    }

    add(vec){
        this.x += vec.x;
        this.y += vec.y;
    }

    subtract(vec){
        this.x -= vec.x;
        this.y -= vec.y;
    }

    divide(vec){
        this.x /= vec.x;
        this.y /= vec.y;
    }

    multiply(vec){
        this.x *= vec.x;
        this.y *= vec.y;
    }

}

function perlinNoise(x,y){

}