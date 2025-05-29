// Car animation using p5.js (Processing JS)
function setup() {
  createCanvas(800, 400);
}

function draw() {
  background(135, 206, 235); // Sky blue background
  
  // Road
  fill(50);
  rect(0, 300, width, 100);
  
  // Road markings
  for (let x = 0; x < width; x += 60) {
    fill(255, 255, 0);
    rect(x, 350, 30, 5);
  }
  
  // Car body
  fill(255, 0, 0); // Red car
  rect(mouseX - 60, 270, 120, 40);
  rect(mouseX - 30, 250, 60, 20);
  
  // Wheels
  fill(0);
  ellipse(mouseX - 40, 310, 30, 30);
  ellipse(mouseX + 40, 310, 30, 30);
  
  // Windows
  fill(200, 200, 255);
  rect(mouseX - 25, 255, 20, 15);
  rect(mouseX + 5, 255, 20, 15);
  
  // Headlights (they glow when mouse is pressed)
  if (mouseIsPressed) {
    fill(255, 255, 150);
  } else {
    fill(255, 255, 100);
  }
  ellipse(mouseX + 60, 280, 10, 10);
}

// Click to change car color
function mouseClicked() {
  fill(random(255), random(255), random(255));
}