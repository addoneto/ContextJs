let body, canvas, ctx, width, height, windowWidth, windowHeight, fullscreen = false, aspectRatio = [], loop = true;
let FPS, fpsInterval = 1000 / FPS, lastFrameTime, deltaT, now, startedLoop;

window.onload = function () {
    body = document.getElementsByTagName('body')[0];

    let startFunc = false, updateFunc = false, fixedFunc = false;

    try { if( start ) startFunc = true; }catch(err){}
    try { if( update ) updateFunc = true; }catch(err){}
    try { if( fixedUpdate ) fixedFunc = true; }catch(err){}

    if(startFunc) start();
    if(updateFunc) updateLoop();
    if(fixedFunc) {
        lastFrameTime = Date.now();
        fixedUpdateLoop();
    }
}

function updateLoop() {
    if(loop){ update(); requestAnimationFrame(updateLoop); } 
}

/**
 * Changes the Frame Rate of fixedUpdate loop.
 * @param  {Number} _fps New FPS value.
 */
function setFrameRate(_fps) {
    // TODO: check if changing the fps after the loop has started causes some issues
    FPS = _fps;
    fpsInterval = 1000 / FPS;
}

function fixedUpdateLoop() {
    if(loop) requestAnimationFrame(fixedUpdateLoop);
    else return;

    now = Date.now();
    deltaT = now - lastFrameTime;
    if (deltaT > fpsInterval) {
        // subtract by (deltaT % fpsInterval) makes sure lastFrameTime is multiple of fpsInterval
        lastFrameTime = now - (deltaT % fpsInterval);
        fixedUpdate(); 
    }
}

/**
 * Stops all update loops.
 */
function noLoop(){  loop = false; }

/**
 * Creates an hmtl canvas.
 * @param  {Number} _width Canvas width or aspect ratio numerator.
 * @param  {Number} _height  Canvas height or aspect ratio denominator.
 * @param  {Boolean} _aspectRatio If the canvas should be created considering a fixed size or an aspect ratio. 
 */
function createCanvas(_width, _height, _aspectRatio = false){
    canvas = document.createElement('canvas');
    body.appendChild(canvas);

    ctx = canvas.getContext('2d');

    if(_width == null && _height == null){ fullscreen = true; }
    aspectRatio[0] = _width; aspectRatio[1] = _height;

    if(fullscreen || aspectRatio){
        window.addEventListener('resize', canvasResize);
        canvasResize();
        return;
    }

    if(_width != null && _height != null) {
        canvas.width = _width;
        canvas.height = _height;

        width = _width;
        height = _height;
        return;
    }

    console.error("`createCanvas` needs 2, 3 or none argument passed; not only 1");
    return new Error("`createCanvas` needs 2, 3 or none argument passed; not only 1");
}

/**
 * Removes body's overflow, hidding scroll bars.
 */
function noOverflow(){
    body.style.overflow = 'hidden';
}

/**
 * Resizes the canvas to a specified size.
 * @param  {Number} _w New canvas width.
 * @param  {Number} _h New canvas height.
 */
function canvasResize(_w, _h){
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if (_w != null && _h != null) {
        canvas.width = _w; canvas.height = _h;
        updateWh();
        return;
    }

    if (fullscreen) {
        canvas.width = windowWidth; canvas.height = windowHeight;
        updateWh();
        return;
    }

    if (aspectRatio[0] != null) {
        let w, h;
        if (aspectRatio[0] != aspectRatio[1]) {
            h = windowHeight;
            w = h * aspectRatio[0] / aspectRatio[1];
            
            if(w > windowWidth){
                w = windowWidth;
                h = w * aspectRatio[1] / aspectRatio[0];
            }
        } else {
            w = windowWidth >= windowHeight ? windowHeight : windowWidth;
            h = w;
        }

        canvas.width = w;
        canvas.height = h;
    }

    updateWh();
}

function updateWh(){
    width = canvas.width; height = canvas.height;
}

/**
 * Covers the whole canvas with a specified color
 * @param  {String} color Canvas width or aspect ratio numerator.
 */
function background(color){
    if(ctx == null){
        console.error("Create a canvas before calling `background`");
        return new Error("Create a canvas before calling `background`");
    } 
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Returns a css rgb color string.
 * 
 * If just one param is passed the function returns a color with all 3 channels with the specified value.
 * @param  {Number} r Red color channel value.
 * @param  {Number} g Green color channel value.
 * @param  {Number} b Blue color channel value.
 */
function color(r, g, b){
    if(g == null && b == null) return `rgb(${r}, ${r}, ${r})`;
    else if(g != null && b != null) return `rgb(${r}, ${g}, ${b})`;

    console.error("`color` function needs 1 or 3 params");
    return new Error("`color` function needs 1 or 3 params");
}

/**
 * Clear canvas content.
 */
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}