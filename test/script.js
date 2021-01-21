function start(){
    //createCanvas(800,800);
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