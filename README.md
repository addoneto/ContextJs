# ContentJS Library

A minimal library made to simplify the repetitive action of creating canvas basis in JavaScript. It provides simple to use functions, implementing things such as a game loop and responsive canvas size.

___

## Documentation

### Adding the library to a project

All the code necessary for the library is in just one short file

```html
    <script src="engine/context.js"></script>
```

You can of course use the minified version that should perform a little faster.<br/> \* To prevent Errors add your script before the library.

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

`canvasResize`

> ! If no canvas is created after the `start` function an fullscreen canvas will be automatically created.

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

This function cover hole the canvas with an specified color. The color is supplied as a string in the form of any valid css color, such as hex, common names or rgb.

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
Mozila web docs

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
    vector.normalize();
```

Preserves the direction of the vector but changes its magnitude to 1.

#### Distance

```javascript
    let dist = vector1.dist(vector2);
```

Returns the distance between two vectors.

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

\* Other operation such as the `dot product` are planned to be added in future updated.