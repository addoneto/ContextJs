function start() {
    createFullScreenCanvas();
}

function update(){
    background('rgb(50,50,50)');

    stroke(5, 'gray');
    translate(canvas.width / 2, canvas.height / 2);
    // let  vector = new Vector2(mouseX - canvas.width / 2, mouseY - canvas.height / 2);
    // vector.setMag(100);
    // line(0, 0, vector.x, vector.y);

    let vector = Vector2.angleToDirection(270);
    vector.setMag(100);
    line(0, 0, vector.x, vector.y);
    returnTranslate();
}