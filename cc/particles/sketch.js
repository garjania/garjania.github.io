// Constants
const WINDOW_SIZE = 800;
const FPS = 60;
const PARTICLE_RADIUS = 5;
const MAX_SPEED = 3;
const ATTRACTION_FORCE = 0.1;
const REPULSION_FORCE = 1000;
const TRAIL_ALPHA_FACTOR = 0.8;  // Alpha value for the trail effect (0-255)
const PARTICLE_ALPHA = 50;
const EDGE_FORCE = 10;
const EPSILON = 0.0001;
const BLUR_RADIUS = 2;  // Radius for the Gaussian blur effect
const NUM_PARTICLES = 314;
const TRAIL_LENGTH = 20;  // Number of previous positions to store

// Colors
const BLACK = [0, 0, 0];
const MILKY_WHITE = [248, 246, 240];

class Particle {
  constructor(x, y, color = BLACK, name = "", maxSpeed = MAX_SPEED,
              attractionForce = ATTRACTION_FORCE, repulsionForce = REPULSION_FORCE,
              epsilon = EPSILON, edgeForce = EDGE_FORCE, alpha = PARTICLE_ALPHA, 
              trail_alpha_factor = TRAIL_ALPHA_FACTOR, trail_length = TRAIL_LENGTH, mouse_effect=false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.alpha = alpha;
    this.name = name;
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxSpeed = maxSpeed;
    this.attractionForce = attractionForce;
    this.repulsionForce = repulsionForce;
    this.epsilon = epsilon;
    this.edgeForce = edgeForce;
    this.trail = [];  // Array to store previous positions
    this.trail_alpha_factor = trail_alpha_factor;
    this.trail_length = trail_length;
    this.mouse_effect = mouse_effect;
  }

  update(target, repulsion) {
    // Store current position in trail
    this.trail.unshift({x: this.x, y: this.y});
    if (this.trail.length > this.trail_length) {
      this.trail.pop();
    }

    // Calculate distance to target
    let dx = target.x - this.x;
    let dy = target.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      // Attraction force
      this.velocityX += (dx / distance) * this.attractionForce * distance;
      this.velocityY += (dy / distance) * this.attractionForce * distance;
    }

    // Add mouse attraction
    let mouseDx = mouseX - this.x;
    let mouseDy = mouseY - this.y;
    let mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
    
    if (mouseDistance > 0 && this.mouse_effect) {
      // Mouse repulsion force (stronger than regular attraction)
      this.velocityX -= (mouseDx / mouseDistance) * this.repulsionForce * 1/(mouseDistance + this.epsilon);
      this.velocityY -= (mouseDy / mouseDistance) * this.repulsionForce * 1/(mouseDistance + this.epsilon);
    }

    // Calculate distance to repulsion target
    let dxRep = repulsion.x - this.x;
    let dyRep = repulsion.y - this.y;
    let distanceRep = Math.sqrt(dxRep * dxRep + dyRep * dyRep);
    
    if (distanceRep > 0) {
      // Repulsion force
      this.velocityX -= (dxRep / distanceRep) * this.repulsionForce * 1/(distanceRep + this.epsilon);
      this.velocityY -= (dyRep / distanceRep) * this.repulsionForce * 1/(distanceRep + this.epsilon);
    }

    // Edge avoidance
    let distToLeft = this.x;
    let distToRight = WINDOW_SIZE - this.x;
    let distToTop = this.y;
    let distToBottom = WINDOW_SIZE - this.y;

    // Apply repulsion from edges
    this.velocityX += this.edgeForce * (Math.exp(-distToLeft / WINDOW_SIZE));
    this.velocityX -= this.edgeForce * (Math.exp(-distToRight / WINDOW_SIZE));
    this.velocityY += this.edgeForce * (Math.exp(-distToTop / WINDOW_SIZE));
    this.velocityY -= this.edgeForce * (Math.exp(-distToBottom / WINDOW_SIZE));

    // Limit speed
    let speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
    if (speed > this.maxSpeed) {
      this.velocityX = (this.velocityX / speed) * this.maxSpeed;
      this.velocityY = (this.velocityY / speed) * this.maxSpeed;
    }

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Keep particles within bounds
    this.x = Math.max(0, Math.min(WINDOW_SIZE, this.x));
    this.y = Math.max(0, Math.min(WINDOW_SIZE, this.y));
  }

  draw() {
    // Draw trail
    for (let i = 0; i < this.trail.length; i++) {
      let pos = this.trail[i];
      let alpha = int(this.trail_alpha_factor ** i * this.alpha);
      fill(this.color[0], this.color[1], this.color[2], alpha);
      noStroke();
      circle(pos.x, pos.y, PARTICLE_RADIUS * 2);
    }

    // Draw current particle
    fill(this.color[0], this.color[1], this.color[2], 100);
    noStroke();
    circle(this.x, this.y, PARTICLE_RADIUS * 2);
    fill(BLACK);
    textSize(12);
    text(this.name, this.x - 5, this.y - 10);
  }
}

let particles = [];
let attractionIndices = [];
let repulsionIndices = [];
let offset = 1;
let trailGraphics;

function initializeIndices(offset) {
  let attIndices = [];
  let repIndices = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    attIndices.push((i + 1) % NUM_PARTICLES);
    repIndices.push((i + offset) % NUM_PARTICLES);
  }
  return [attIndices, repIndices];
}

function setup() {
  createCanvas(WINDOW_SIZE, WINDOW_SIZE);
  frameRate(FPS);
  
  // Create particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle(
      random(0, WINDOW_SIZE),
      random(0, WINDOW_SIZE)
    ));
  }
  
  // Initialize indices
  [attractionIndices, repulsionIndices] = initializeIndices(offset);
  
  // Create graphics buffer for trail effect
  trailGraphics = createGraphics(WINDOW_SIZE, WINDOW_SIZE);
}

function draw() {
  // Randomly update indices
  if (random() < 0.05) {
    offset += 2;
    [attractionIndices, repulsionIndices] = initializeIndices(offset);
    offset = offset % NUM_PARTICLES;
  }

  // Update particle positions
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles[i].update(
      particles[attractionIndices[i]],
      particles[repulsionIndices[i]]
    );
  }

  // Draw trail effect
  background(MILKY_WHITE);
  
  // Draw particles
  for (let particle of particles) {
    particle.draw();
  }
} 