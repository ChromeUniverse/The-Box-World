const palette = ["#F18F01", "#048BA8", "#2E4057", "#99C24D", "#2F2D2E"];

class Player{
  constructor(name, x, y, controller){
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = 0.5
    this.dimensions = createVector(80, 80);
    this.col = color(random(palette))
    this.name = name;
    this.controller = controller
    this.damping =  0.95;
  }
  
  move(dir){
    this.velocity.add(dir.mult(this.acceleration))
    this.velocity.mult(this.damping);
    this.position.add(this.velocity)
  }
  
  underMouse() {
    return mouseX >= this.position.x-this.dimensions.x/2 &&
           mouseX <= this.position.x+this.dimensions.x/2 &&
           mouseY >= this.position.y-this.dimensions.y/2 &&
           mouseY <= this.position.y+this.dimensions.y/2;
  }
  
  display(){
    noStroke()
    fill (this.col)
    rectMode(CENTER)
    
    rect(this.position.x,
         this.position.y,
         this.dimensions.x,
         this.dimensions.y, 12, 12)
    
    if (this.underMouse()){
      textSize(20);
      fill(color(255))
      textAlign(CENTER, BOTTOM);
      text(this.name, this.position.x,
                      this.position.y-this.dimensions.y/2-8);
    }
  }
}

function getDir(controller){
  let dir = createVector(0,0)
  if (controller==0){
    if (keyIsDown(UP_ARROW))    dir.y --;
    if (keyIsDown(DOWN_ARROW))  dir.y ++;
    if (keyIsDown(LEFT_ARROW))  dir.x --;
    if (keyIsDown(RIGHT_ARROW)) dir.x ++;
  }
  if (controller==1){
    if (keyIsDown(87))  dir.y --;
    if (keyIsDown(83))  dir.y ++;
    if (keyIsDown(65))  dir.x --;
    if (keyIsDown(68))  dir.x ++;
  }
  dir.normalize()
  return dir
}

function inFront(p1, p2){
  if (p1.position.y > p2.position.y)  return 1
  if (p1.position.y == p2.position.y) return 0
  if (p1.position.y < p2.position.y)  return -1
}

let players = [];

function setup() {
  createCanvas(600, 600);
  players.push(new Player(username, 80, 80, 0));
}

function draw() {
  background(color('rgba(110, 110, 110, .8)'));
  players.forEach(i => i.move(getDir(i.controller)))
  players.sort(inFront)
  players.forEach(i => i.display())

}
