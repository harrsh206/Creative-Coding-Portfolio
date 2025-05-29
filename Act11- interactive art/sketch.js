let particles = [];
let flowField = [];
let zoff = 0;
let resolution = 20;

function setup() {
  createCanvas(800, 600);
  
  // Create particles
  for (let i = 0; i < 500; i++) {
    particles.push(new Particle());
  }
  
  // Initialize flow field
  let cols = floor(width / resolution);
  let rows = floor(height / resolution);
  flowField = new Array(cols * rows);
}

function draw() {
  background(0, 10); // Semi-transparent for trail effect
  
  // Update flow field with Perlin noise
  let yoff = 0;
  for (let y = 0; y < floor(height / resolution); y++) {
    let xoff = 0;
    for (let x = 0; x < floor(width / resolution); x++) {
      let index = x + y * floor(width / resolution);
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.5);
      flowField[index] = v;
      xoff += 0.1;
      
      // Visualize flow field (optional)
      if (mouseIsPressed) {
        stroke(255, 50);
        push();
        translate(x * resolution, y * resolution);
        rotate(v.heading());
        line(0, 0, resolution * 0.4, 0);
        pop();
      }
    }
    yoff += 0.1;
    zoff += 0.0003;
  }
  
  // Update and display particles
  for (let p of particles) {
    p.follow(flowField);
    p.update();
    p.edges();
    p.show();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 2;
    this.prevPos = this.pos.copy();
    this.color = color(random(150, 255), random(150, 255), random(150, 255));
    this.size = random(1, 3);
  }

  follow(vectors) {
    let x = floor(this.pos.x / resolution);
    let y = floor(this.pos.y / resolution);
    let index = x + y * floor(width / resolution);
    let force = vectors[index];
    if (force) {
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos.y = height;
    }
  }

  show() {
    stroke(this.color);
    strokeWeight(this.size);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
}