// canvas properties
const canvasW = 600; 
const canvasH = 450;

// thingy properties
const thingyW = 60;
const thingyH = 60;

// initial position
var x = canvasW/2;
var y = canvasH/2;

// speed
var speedX = 10;
var speedY = 10;

// text to be displayed
var name = expressName;

function setup() {
  // colors 
  const colors = ["#F18F01", "#048BA8", "#2E4057", "#99C24D", "#2F2D2E"];
  const thingy_color = random(colors);
  
  // actual canvas setup
  createCanvas(canvasW, canvasH);
  
  // thingy setup
  rectMode(CENTER);
  fill(thingy_color);
}

function draw() {
  background(220);
  
  // handling keypresses
  if (keyIsDown(LEFT_ARROW)) {
    x -= speedX;  
    if (x < thingyW/2) {
      x = thingyW/2;
    }
  }
  if (keyIsDown(RIGHT_ARROW)) {
    x += speedX;  
    if (x > canvasW-thingyW/2) {
      x = canvasW-thingyW/2;
    }
  }
  if (keyIsDown(UP_ARROW)) {
    y -= speedY;  
    if (y < thingyH/2) {
      y = thingyH/2;
    }
  }
  if (keyIsDown(DOWN_ARROW)) {
    y += speedY;  
    if (y > canvasH-thingyH/2) {
      y = canvasH-thingyH/2;
    }
  }
  
  // drawing thingy
  rect(x, y, thingyW, thingyH, 5, 5);
  
  // displaying text
  text(name, x-thingyW/2, y-thingyH/2-8);
}