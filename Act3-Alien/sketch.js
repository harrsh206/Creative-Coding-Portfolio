// Cute Alien using p5.js
let isHappy = false;
let alienColor;

function setup() {
  createCanvas(800, 600);
  alienColor = color(100, 200, 100); // Green alien by default
}

function draw() {
  background(30, 10, 50); // Dark purple space background
  
  // Draw stars
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height/2);
    let size = random(1, 3);
    fill(255, 255, random(200, 255));
    noStroke();
    ellipse(x, y, size, size);
  }
  
  // Draw alien
  drawAlien(mouseX, mouseY);
}

function drawAlien(x, y) {
  // Body
  fill(alienColor);
  ellipse(x, y, 100, 120); // Main body
  
  // Head
  ellipse(x, y - 80, 80, 90); // Head
  
  // Eyes
  fill(255);
  ellipse(x - 20, y - 90, 30, 40); // Left eye
  ellipse(x + 20, y - 90, 30, 40); // Right eye
  
  // Pupils (follow mouse slightly)
  fill(0);
  let leftPupilX = map(mouseX, 0, width, x - 25, x - 15, true);
  let rightPupilX = map(mouseX, 0, width, x + 15, x + 25, true);
  let pupilY = map(mouseY, 0, height, y - 95, y - 85, true);
  ellipse(leftPupilX, pupilY, 10, 15);
  ellipse(rightPupilX, pupilY, 10, 15);
  
  // Mouth
  fill(0);
  if (isHappy) {
    // Smile
    arc(x, y - 60, 30, 20, 0, PI);
  } else {
    // Neutral mouth
    line(x - 15, y - 60, x + 15, y - 60);
  }
  
  // Antenna
  stroke(alienColor);
  strokeWeight(4);
  line(x - 20, y - 130, x - 30, y - 170); // Left antenna
  line(x + 20, y - 130, x + 30, y - 170); // Right antenna
  noStroke();
  fill(255, 50, 50);
  ellipse(x - 30, y - 170, 15, 15); // Left antenna ball
  ellipse(x + 30, y - 170, 15, 15); // Right antenna ball
  
  // Arms
  stroke(alienColor);
  strokeWeight(8);
  noFill();
  // Wavy arms
  beginShape();
  curveVertex(x - 50, y - 40);
  curveVertex(x - 50, y - 20);
  curveVertex(x - 70, y);
  curveVertex(x - 60, y + 20);
  endShape();
  
  beginShape();
  curveVertex(x + 50, y - 40);
  curveVertex(x + 50, y - 20);
  curveVertex(x + 70, y);
  curveVertex(x + 60, y + 20);
  endShape();
  noStroke();
  
  // Legs
  fill(alienColor);
  ellipse(x - 25, y + 50, 30, 40); // Left leg
  ellipse(x + 25, y + 50, 30, 40); // Right leg
}

function mouseClicked() {
  // Toggle happiness
  isHappy = !isHappy;
  
  // Change to random alien color
  alienColor = color(random(100, 200), random(100, 200), random(100, 200));
  
  // Prevent default behavior
  return false;
}