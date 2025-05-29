function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100);
  noLoop(); // No animation
  generatePattern();
}

function draw() {
  // Pattern is generated in generatePattern()
}

function generatePattern() {
  background(0, 0, 95); // Light gray background
  
  let tileSize = 40;
  let margin = 20;
  let patternWidth = width - 2 * margin;
  let patternHeight = height - 2 * margin;
  let cols = patternWidth / tileSize;
  let rows = patternHeight / tileSize;
  
  // Draw the pattern
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = margin + i * tileSize;
      let y = margin + j * tileSize;
      
      // Alternate between two design types
      if ((i + j) % 2 === 0) {
        drawDiamondTile(x, y, tileSize);
      } else {
        drawCircleTile(x, y, tileSize);
      }
    }
  }
  
  // Add border
  noFill();
  stroke(0, 0, 30);
  strokeWeight(3);
  rect(margin, margin, patternWidth, patternHeight);
}

function drawDiamondTile(x, y, size) {
  push();
  translate(x + size/2, y + size/2);
  
  // Color based on position
  let hue = map(x + y, 0, width + height, 0, 360);
  fill(hue, 80, 90);
  noStroke();
  
  // Diamond shape
  beginShape();
  vertex(0, -size/2);
  vertex(size/2, 0);
  vertex(0, size/2);
  vertex(-size/2, 0);
  endShape(CLOSE);
  
  // Inner decoration
  fill(0, 0, 100, 50);
  ellipse(0, 0, size/2, size/2);
  
  pop();
}

function drawCircleTile(x, y, size) {
  push();
  translate(x + size/2, y + size/2);
  
  // Different color scheme
  let hue = map(x - y, -height, width, 180, 270);
  fill(hue, 60, 80);
  noStroke();
  
  // Four quarter-circles
  for (let i = 0; i < 4; i++) {
    push();
    rotate(i * HALF_PI);
    arc(0, 0, size, size, 0, HALF_PI);
    pop();
  }
  
  // Center square
  fill(0, 0, 100);
  rectMode(CENTER);
  rect(0, 0, size/4, size/4);
  
  pop();
}

function mouseClicked() {
  // Generate new random pattern on click
  randomSeed(millis());
  generatePattern();
}