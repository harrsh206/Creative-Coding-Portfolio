let letters = [];
let originalText = "BATH SPA UNIVERSITY";
let isScattered = false;
let bgColor;
let glowEffect = [];
let font;

function preload() {
  // Try to load a stylish font (fallback to system font if offline)
  font = loadFont('Oswald.ttf');
}

function setup() {
  createCanvas(1000, 600);
  bgColor = color(5, 15, 25); // Deep space blue
  if (font) textFont(font);
  textSize(60);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  initializeLetters();
}

function draw() {
  // Gradient background
  setGradient(0, 0, width, height, color(5, 15, 25), color(10, 30, 50));
  
  // Glow trail effect
  glowEffect.push({x: mouseX, y: mouseY, alpha: 255});
  for (let i = glowEffect.length - 1; i >= 0; i--) {
    let g = glowEffect[i];
    noStroke();
    fill(100, 180, 255, g.alpha);
    ellipse(g.x, g.y, 120, 120);
    g.alpha -= 8;
    if (g.alpha <= 0) glowEffect.splice(i, 1);
  }

  if (!isScattered) {
    // Draw glowing main text
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color(100, 180, 255);
    fill(255);
    text(originalText, width/2, height/2);
    drawingContext.shadowBlur = 0;
  } else {
    // Interactive particles
    for (let letter of letters) {
      letter.update();
      letter.display();
      
      // Mouse repulsion
      let mouseDist = dist(mouseX, mouseY, letter.x, letter.y);
      if (mouseDist < 150) {
        let repelForce = p5.Vector.sub(letter, createVector(mouseX, mouseY));
        repelForce.setMag(30 - mouseDist/5);
        letter.applyForce(repelForce);
      }
    }
  }
}

function setGradient(x, y, w, h, c1, c2) {
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function initializeLetters() {
  letters = [];
  let x = width/2 - textWidth(originalText)/2;
  for (let i = 0; i < originalText.length; i++) {
    let char = originalText.charAt(i);
    if (char !== " ") {
      letters.push(new Letter(
        x + i * textWidth("M"), // Better spacing
        height/2,
        char
      ));
    }
  }
}

function mousePressed() {
  isScattered = !isScattered;
  if (isScattered) {
    for (let letter of letters) {
      letter.explode();
    }
  } else {
    for (let letter of letters) {
      letter.returnHome();
    }
  }
}

class Letter {
  constructor(x, y, char) {
    this.originalX = x;
    this.originalY = y;
    this.x = x;
    this.y = y;
    this.char = char;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.size = 60;
    this.targetSize = 60;
    this.hue = random(180, 220);
  }
  
  explode() {
    this.targetX = random(width);
    this.targetY = random(height);
    this.velocity = p5.Vector.random2D().mult(random(5, 15));
    this.targetSize = random(30, 80);
  }
  
  returnHome() {
    this.targetX = this.originalX;
    this.targetY = this.originalY;
    this.targetSize = 60;
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  update() {
    // Physics
    this.velocity.add(this.acceleration);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.mult(0.95); // Drag
    this.acceleration.mult(0);
    
    // Size animation
    this.size = lerp(this.size, this.targetSize, 0.1);
    
    // Constrain to canvas
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
  
  display() {
    // Glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(this.hue, 150, 255, 150);
    
    // Letter color
    fill(255, 200);
    textSize(this.size);
    text(this.char, this.x, this.y);
    
    drawingContext.shadowBlur = 0;
  }
}