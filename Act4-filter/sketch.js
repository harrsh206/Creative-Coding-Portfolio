var img;

function preload() {

img = loadImage("M4.png");

}


function setup () { 
createCanvas (900, 900);

background(0);

}


function draw() { 

background(0); 
image(img, 0, 0);

filter(INVERT);

}

