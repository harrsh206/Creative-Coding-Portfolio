function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}

let carX = -100; // Initial position of the car
let carY = 300;
let carSpeed = 1;

function setup() {
  createCanvas(800, 400);
}

function draw() {
  background(220);
  drawCar(carX, carY);
  carX += carSpeed;
  
  // Reset car position when it moves off-screen
  if (carX > width) {
    carX = -100;
  }
}

function drawCar(x, y) {
  // Body
  fill(255, 0, 0);
  rect(x, y - 20, 100, 40, 10);
  rect(x + 20, y - 40, 60, 20, 5);
  
  // Wheels
  fill(0);
  ellipse(x + 20, y + 20, 20, 20);
  ellipse(x + 80, y + 20, 20, 20);
}