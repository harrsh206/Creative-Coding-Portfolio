let font;
let points = [];
let bgCircles = [];
let ripples = [];
let stars = [];
let sparkles = [];
let trail = [];
let currentBgColor;
let t = 0;
let textColor = '#00f0ff';

function preload() {
  font = loadFont('SourceSansPro-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textSize(64);
  textAlign(CENTER, CENTER);
  currentBgColor = color('#2F0A28');

  // Centered text points generation
  points = font.textToPoints("Welcome to Bath Spa University", width/2, height/2, 64, {
    sampleFactor: 0.2,
    align: CENTER,
    baseline: CENTER
  });

  for (let i = 0; i < 80; i++) {
    bgCircles.push(new BgCircle());
  }

  for (let i = 0; i < 100; i++) {
    stars.push(new Star());
  }
}

function draw() {
  setGradientBackground();

  for (let s of stars) s.update(), s.show();
  for (let circle of bgCircles) circle.update(), circle.show();

  let time = millis() / 1000;
  for (let pt of points) {
    let wave = sin(pt.x * 0.05 + time * 2) * 10;
    fill(0, 255, 255, 50);
    ellipse(pt.x, pt.y + wave, 10, 10);
    fill(textColor);
    ellipse(pt.x, pt.y + wave, 4, 4);
  }

  for (let s of sparkles) s.update(), s.show();
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].show();
    if (ripples[i].isFinished()) ripples.splice(i, 1);
  }

  updateMouseTrail();
  drawMouseTrail();

  t += 0.005;
}

function mousePressed() {
  ripples.push(new Ripple(mouseX, mouseY));
  updateBubbleColors();
  createSparkles(mouseX, mouseY);
}

function setGradientBackground() {
  let c1 = color(20 + sin(t) * 50, 20, 80 + cos(t) * 50);
  let c2 = color(80, 30 + sin(t + PI) * 40, 150 + sin(t + PI/2) * 50);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function updateBubbleColors() {
  for (let circle of bgCircles) {
    circle.color = color(random(150, 255), random(80, 255), random(150, 255), random(80, 150));
  }
}

function createSparkles(x, y) {
  for (let i = 0; i < 10; i++) {
    sparkles.push(new Sparkle(x, y));
  }
}

function updateMouseTrail() {
  trail.push({ x: mouseX, y: mouseY, life: 255 });
  if (trail.length > 40) trail.splice(0, 1);
}

function drawMouseTrail() {
  noStroke();
  for (let i = 0; i < trail.length; i++) {
    let p = trail[i];
    fill(255, 255, 255, p.life);
    ellipse(p.x, p.y, 5);
    p.life -= 4;
  }
}

class BgCircle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(20, 100);
    this.speed = random(0.5, 1.2);
    this.color = color(random(150, 255), random(80, 255), random(150, 255), random(80, 150));
  }
  update() {
    this.y -= this.speed;
    if (this.y + this.r < 0) {
      this.reset();
      this.y = height + this.r;
    }
  }
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.r);
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 10;
    this.alpha = 255;
    this.color = color(random(255), random(255), random(255));
  }
  update() {
    this.r += 10;
    this.alpha -= 10;
  }
  show() {
    strokeWeight(3);
    stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    noFill();
    ellipse(this.x, this.y, this.r);
  }
  isFinished() {
    return this.alpha <= 0;
  }
}

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.alpha = random(100, 255);
    this.radius = random(1, 3);
  }
  update() {
    this.alpha += random(-10, 10);
    this.alpha = constrain(this.alpha, 100, 255);
  }
  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.radius);
  }
}

class Sparkle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.life = 255;
    this.size = random(3, 6);
    this.color = color(random(200, 255), random(200, 255), 255);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 5;
  }
  show() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.life);
    ellipse(this.x, this.y, this.size);
  }
  isDead() {
    return this.life <= 0;
  }
}