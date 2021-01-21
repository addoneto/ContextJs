let canvas, ctx, aspectRatio, padding = 0, fullScreen = false;
let FPS = 60, fpsInterval =  1000 / FPS, lastFrameTime, deltaT, now;
let startedLoop = false;
let body;

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

function rect(x, y, w, h, color){
    //ctx.fillRect(x, y, w, h);
    ctx.rect(x, y, w, h);
    if(color) fill(color);
}

function circle(x, y, radius){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
}

function elipse(x, y, w, h){
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.closePath();
}

function stroke(width, color){
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function fill(color){
    ctx.fillStyle = color;
    ctx.fill();
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