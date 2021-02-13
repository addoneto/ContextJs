<p align="center">
<img width="300" height="300" src="https://user-images.githubusercontent.com/25326579/106518655-fc06db80-64b8-11eb-9fc2-7884370b455d.png">
</p>

# ContextJS Library

A minimal library made to simplify the repetitive action of creating canvas basis in JavaScript. It provides simple to use functions, implementing things such as a game loop and responsive canvas size.

___

## Documentation

<span style="color:red">! Documentation will be refactor son when the new library core is finished</span>.

### Adding the library to a project

All the code necessary for the library is in just one short file

```html
    <script src="engine/context.js"></script>
```

You can of course use the minified version that should perform a little faster.<br/> \* To prevent Errors add your script before the library.

If you don't want to download the code to use in your project there is this awesome toll called [JsDeliver](https://www.jsdelivr.com/). It's a free CDN that can provides github projects. So you can add the link on your code and have fun without downloading anything.

https://cdn.jsdelivr.net/gh/addoneto/ContextJs@master/engine/context.js
https://cdn.jsdelivr.net/gh/addoneto/ContextJs@master/engine/context.min.js

### The `Setup` Method

The function `setup` is executed just when the page is loaded and every content is loaded. Adding it on the 

```javascript
    function start(){
        // code executed once when the page is loaded
    }
```

### Creating the Canvas

To create a canvas on html simply call the function `createFunction` with the size of it

```javascript
    function start(){
        createCanvas(800, 800);
    }
```

There are a couple more functions for creating the canvas.

#### Responsive Canvas

The function `createResponsiveCanvas` make possible to supply an aspect ratio and the canvas will automatically resize according to it. The last param is a padding that will reduce the final canvas size.

```javascript
    function start(){
        createResponsiveCanvas(16, 9);
    }
```

#### Fullscreen Canvas

Create a full-screen canvas that will automatically resize to the window size during runtime.

```javascript
    function start(){
        createFullScreenCanvas();
    }
```

#### Manualy resize Canvas

There is also an option for resizing the canvas at runt time. It asks for a width and height.

```javascript
    canvasResize(600, 300);
```

### Game Loop

ContextJS provides two Game loop / Update functions

```javascript
    function update(){
        // called every time when the navigator is ready 
    }
```

The `update` function is called using `requestAnimationFrame` with no specific frame rate. So the software running the library that controls the _repaint_/update rate.

```javascript
    function fixedUpdate(){
        // called in fixed framerate 
    }
```

By default, the frame rate is set to 60 frames per seconds (FPS). The navigator will always try to achieve the frame rate specified.

To set a different Frame rate call `setFrameRate` on the `start` function with the desired fps.

```javascript
    function start(){
        setFrameRate(30);
    }
```

### Background

```javascript
    background('#ffffff');
    background('white');
    background('rgb(255,255,255)');
```

This function cover whole the canvas with an specified color. The color is supplied as a string in the form of any valid css color, such as hex, common names or rgb.

### Clear Canvas

```javascript
    clear();
```

### Translate

Use the function `translate(x, y)` to move all canvas matrix to an specific position choose, remaping the [0, 0] to it.

```javascript
    translate(canvas.width / 2, canvas.height / 2);
```

To restore the default translation use `returnTranslate`.

```javascript
    returnTranslate();
```

### Drawing shapes

#### Rectangle

```javascript
    rect(x, y, widht, height [, color]);
```

A normal `rect` js function. If a color is supplied the rectangle will be filed with this color.

#### Circle 

```javascript
    circle(x, y, radius);
```

#### Elipse 

```javascript
    elipse(x, y, w, h);
```

#### Coloring & Styling

There are some options for stylizing shapes.

##### Fill 

```javascript
    fill(color);
```

Calling `fill()` after any shape will fill its inside with a specified color in a format similar as [background](#Background).

##### Stroke 

```javascript
    stroke(width, color);
```

Similar as `fill`, `stroke` create a line on the outside of a shape.
<br>

```javascript
    rect(0,0, 10, 10)
    fill('white');
    stroke(1, 'black');
```

<br>

Booth settings can be removing simply by adding a `no` after the common function.

```javascript
    noFill();
    noStroke();
```

### Images

```javascript
    image(src [,sourceXoffset] [,sourceYoffset] [,sourceWidth],[,sourceHeight], finalX, finalY [,finalWidth] [,finalHeight)];
```

The function drawImage supplied natively by js provide tree forms of creating an image by specifying characteristics of the source image and the destination final image.

ContextJs provides a only one image function with optional params, being the only necessary ones:

- Image source path
- Destination position x
- Destination position y
![params explanation](https://media.prod.mdn.mozit.cloud/attachments/2012/07/09/225/46ffb06174df7c077c89ff3055e6e524/Canvas_drawimage.jpg)
<br>Mozila web docs

#### Loading Images

You can also load an image before really displaying it. This can be handy when you want to acess image information before showing it, or to remove `onload` on the `image` function itself.

```javascript
    let image = await asyncLoadImage(src);
```

`asyncLoadImage` returns an Image object witch contains a width and a height. Equivalent of creating an img DOM element inside the canvas.

To prevent erros the function returns a promisse that only fullfil when the image is loaded. The implementation, however, utilizes `await` to avoid using callbacks, so the start function need to be async.

Of course there is the option of using `then` but It is not the recomended way.

```javascript
    asyncLoadImage('path').then(image => {});
```
<br>

To show a loaded image just pass the image object insted of its source on `image()`.

Other way of loading a image is using a callback that is called soon when the image is loaded.

```javascript
    loadImage('path', function() {
        const image = this;
    }); 
```

> In future Update an preload will be added, so the assets can be loaded in an blocking way, removing the need of promises or callbacks in the start / update functions.

### Math functions

#### Map numbers to threshold

Suppose you have a value inside a certain threshold boundary that you want to extrapolate to other range.

```javascript
    numberRemap(value, start1, stop1, start2, stop2);
```

The function returns the 'remaped' value. The math behind it is quite simple, consisting in basically one formula that proportionally increase or decrease the provides value based on the two ranges. 

#### Liniar Interpolation (LERP)

Returns a value inside a range based on the linear 'line' between two numbers that define the boundary.

```javascript
    lerp(v1, v2, t);
```

> Interpolation consists basically in the process of constructing a new set of numbers based on other one. Linear Interpolation is one specific Interpolation by creating a line between the numbers inside of a give set of numbers (In case of the funcitons just 2 numbers determines the set)

### 2D Vector

ContextJs describes a simple structure that contains [x, y] values and methods to manipulate those numbers.

```javascript
    let vector = new Vector2(3, 4);
```

#### Magnitude

```javascript
    let mag = vector.mag();
```

The `mag` function returns the value of length of the vector considering the starting point being [0,0].

#### Square Magnitude

```javascript
    let sqrMag = vector.sqrMag();
```

This function is similar as the common magnitude with the only difference being not calculating the square root of the mag.

```
    mag = sqrt(sqrMag)
```

It can be realy useful to use sqrMag instead of mag. Doing the square root of a number can be really performance heavy, and if you are comparing the magnitude of a vector you can just use sqrMag and compare with the desired number multiplied by itself (^2).

#### Normalize

```javascript
    vector.Normalize();
```

Preserves the direction of the vector but changes its magnitude to 1. You can also use lowercase `normalize` that returns the final vector but don't change the it self.

```javascript
    let new_vector = vector.normalize();
```

#### Set Magnitude

Changes the magnitude of a vector preserving its direction.

```javascript
    vector.setMag(100);
```

It consists basically in multiplying an unit vector (normalized) by the desired magnitude.

#### Distance

```javascript
    let dist = vector1.dist(vector2);
```

Returns the distance between two vectors.

```javascript
    // static dist
    let dist = Vector2.dist(vector1, vector2);
```

##### Static Distance

If you want to get the distance between two vectors without actually instantiating they use the static distance.

```javascript
    let dist = Vector2.dist(vector1, vector2);
```

#### Square Distance

```javascript
    let dist = vector1.distSqr(vector2);
```

Returns the distance between two vectors squared. Similar as the distance function but without doing the square root.

As explained on  [Square Magnitude](#Square-Magnitude) this function can be really handy. Suppose you want to do some action when the distance between two vectors are x. You can instead use `distSqr` and compare to x * x (x ** 2).

#### Add, Subtract, Divide & Multiply

```javascript
    vector1.add(vector2);
    vector1.subtract(vector2);
    vector1.divide(vector2);
    vector1.multiply(vector2);
```

Perform a simple operation between two vectors. The vector that called the method is changed by the result. The process consists in just calculating the operation in x and y of each vector respectively.

You can also use the static version that return the operation between two given vectors.

```javascript
    let addition = Vector2.add(vector1, vector2);
```

\* Other operation such as the `dot product` are planned to be added in future updated.

#### Angle to Direction

```javascript
    let vector = Vector2.angleToDirectionVector()
```

Static method that returns a Vector2 pointing to the direction. It consists bassicaly in:

```javascript
    vector.x = Math.cos(angle);
    vector.y = Math.sin(angle);
```

The function automatically converts the angle to radians

\* The mag of the vector will be by default 1, since trigonometric circle has radius of 1.

### Angles

#### Converting Degrees to Radians

In javascript an in many other languages, trigonometry equations functions need to receive radians values, while we are used to thinking in degress.

```javascript
    let angle = deg2rad(angle_in_degrees);
```

<p align="center">radians = degrees × π /180 </p>

#### Cosine, Sine and Tangent

ContextJs provides cosine and sine functions using degrees, with intrinsic conversion to radians. 

```javascript
    let cos = cos(angle_in_degrees);
    let sin = sin(angle_in_degrees);
    let tan = tan(angle_in_degrees);
```

### Random

The random function returns a value between a range of values defined by min (included) and max (excluded). Contaning 16 decimal points.

```javascript
    let v = random(1,10);
```

#### Random integer

```javascript
    let v = randint(1,10);
```

> In further updates Coherent Pseudo Random Noise will be added. Such as Improved Perlin Noise and Simplex Noise.

### Keyboard Input

#### Keydown and Keyup Event

The functions `keyDown` and `keyUp` will be called when a keyboard key is pressed or released, respectively.

```javascript
    function keyDown(keyCode){ /* your code */ }
    function keyUp(keyCode){ /* your code */ }
```

##### Default key codes

| Variable name | Code |
|-------------|----|
| ARROW_UP    | 38 |
| ARROW_DOWN  | 40 |
| ARROW_LEFT  | 37 |
| ARROW_RIGHT | 39 |
| SPACE       | 32 |

#### Recommendations

There is a delay between maintain the key pressed and the continous `keyDown` calls. `keyDown` will be called just when a key is pressed, hovewer, when some key is keep presed a delay appear. This can results in snapy unenjoyable controlls for a player, for exemple.

You can work around this by adding a velocity that is added to the player position each frame and reseting it when a key is up.

```javascript
    class Player{
        constructor(x, y){
            this.pos = new Vector2(x, y);
            this.dir = new Vector2(0, 0);
        }

        update(){
            this.pos.add(this.dir);
        }

        draw(){
            fill('red');
            circle(this.pos.x, this.pos.y, 15);
        }

        setDirection(x, y){
            this.dir.x = x;
            this.dir.y = y;
        }
    }

    let player;

    function start(){
        createCanvas(800,800);
        player = new Player(50, 50);
    }

    function update(){
        background('rgb(50,50,50)');
        player.draw();
    }

    function fixedUpdate(){
        player.update();
    }

    function keyDown(key){
        switch(key){
            case 37: // Left arrow
                player.setDirection(-1, 0);
                break;
            case 38: // Up arrow
                player.setDirection(0, -1);
                break;
            case 39: // Right arrow
                player.setDirection(1, 0);
                break;
            case 40: // Down arrow
                player.setDirection(0, 1);
                break;
        }
    }

    function keyUp(key){
        if(key === 37 || key === 38 || key === 39 || key === 40){
            player.setDirection(0, 0);
        }
    }
```

### Mouse Input

The global variables `MouseX` and `MouseY` can be used to get the mouse position relative to the canvas.

```javascript
    function click(x, y){ /* your code */ }
```

You can implement `click()` on your code, it is called when a click is performed inside the canvas. Arguments `x` and `y` are, as MouseX and MouseY, relative to canvas.

### Pixel Manipulation

ContextJs offers a function that get all the pixels of an specific region of the canvas. It returns an ImageData object that stores:

- .data (Uint8ClampedArray)
- width
- height

The data contains information of each pixel that you can manipulate just like in an array.

> Each pixel has 4 index values on the data array: Red, Green, Blue and Alpha. 

```javascript
    // Get pixels from the whole canvas
    imageData = canvasGetPixels();
    pixels = imageData.data;

    // Get pixels from specific square region
    imageData2 = canvasGetPixels(xpos, ypos, width, height);
```

#### Updating

Simply chanching the data of an ImageData instance does not update the result on the screen automatically. So, when all the manipulation is done you have to call `canvasUpdatePixels`.

```javascript
    canvasUpdatePixels(imageData [,x] [,y]);
```

#### Examples

##### TV Random Noise

![preview](https://user-images.githubusercontent.com/25326579/105415123-2209c180-5c17-11eb-9ca6-bdab2af790d0.png)

```javascript
function start(){
    createFullScreenCanvas();
}

function update(){
    let imageData = canvasGetPixels();

    for(let i = 0; i < imageData.data.length; i += 4){
        let r = Math.floor(random(0,255));

        imageData.data[0 + i] = r;
        imageData.data[1 + i] = r;
        imageData.data[2 + i] = r;
        imageData.data[3 + i] = 255;
    }

    canvasUpdatePixels(imageData);
}
```

#### Canvas Tantained Error

Even when displaying local image files it is possible to get the error with `canvasGetPixels`:

```
execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data
```

There is this security check on some browser that forbides performing `getImageData` after rendering an supposedly cross-origin data (e.g Images). I will persist searching about the error and probably in further updates this will be fixed.