let particles = [];
let trailMode = 1; // 1=Normal, 2=Waves, 3=Spiral, 4=Fire
let lastMouseX = 0;
let lastMouseY = 0;
let speed = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  background(0);
}

function draw() {
  // Fading background (lower alpha = longer trails)
  background(0, 0, 0, 10);

  // Calculate mouse speed for dynamic effects
  speed = dist(mouseX, mouseY, lastMouseX, lastMouseY);
  lastMouseX = mouseX;
  lastMouseY = mouseY;

  // Add new particles
  if (mouseIsPressed && mouseButton === LEFT) {
    createExplosion(mouseX, mouseY, 20); // Big burst on click
  } else {
    createParticles(mouseX, mouseY, max(1, speed * 0.2));
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

function createParticles(x, y, count) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y));
  }
}

function createExplosion(x, y, count) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, true));
  }
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    background(0); // Clear trail on right-click
  }
}

function keyPressed() {
  if (key >= '1' && key <= '4') {
    trailMode = parseInt(key);
  }
}

// ---- PARTICLE CLASS ----
class Particle {
  constructor(x, y, isExplosion = false) {
    this.x = x;
    this.y = y;
    this.size = random(5, 15);
    this.baseSize = this.size;
    
    // Different behaviors per mode
    switch (trailMode) {
      case 1: // Normal
        this.speedX = random(-1, 1);
        this.speedY = random(-1, 1);
        break;
      case 2: // Wave
        this.speedX = cos(frameCount * 0.1 + x) * 0.5;
        this.speedY = sin(frameCount * 0.1 + y) * 0.5;
        break;
      case 3: // Spiral
        this.angle = atan2(y - height/2, x - width/2);
        this.speedX = cos(this.angle + frameCount * 0.05) * 1.5;
        this.speedY = sin(this.angle + frameCount * 0.05) * 1.5;
        break;
      case 4: // Fire
        this.speedX = random(-0.5, 0.5);
        this.speedY = random(-3, -1); // Rising
        break;
    }
    
    // Explosion effect
    if (isExplosion) {
      this.speedX *= 3;
      this.speedY *= 3;
      this.size *= 1.5;
    }
    
    this.hue = (frameCount + random(60)) % 360; // Shifting colors
    this.alpha = 100;
    this.decayRate = random(0.3, 1.5);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Gravity (mode-dependent)
    if (trailMode !== 4) this.speedY += 0.05;
    
    // Pulsing size
    this.size = this.baseSize * (0.8 + sin(frameCount * 0.1) * 0.2);
    
    // Fade out
    this.alpha -= this.decayRate;
  }

  display() {
    // Glow effect
    fill(this.hue, 80, 100, this.alpha * 0.3);
    ellipse(this.x, this.y, this.size * 2);
    
    // Main particle
    fill(this.hue, 100, 100, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}