function start(){
    //createCanvas(800, 800);
    createResponsiveCanvas(16,9);
    //createFullScreenCanvas();
}

function update(){
    background('#202020');

    rect(100,100,100,100);
    fill('red');
    stroke(5, 'white');

    circle(300,150,50);
    fill('blue');
    stroke(5, 'purple');

    circle(450,150,50);
    fill('cyan');
    stroke(5, 'gray');

    circle(600,150,50);
    stroke(0, 'white');

    image('cat.jpeg', null, null, null, null,
        750, 100, 450, 300);
}