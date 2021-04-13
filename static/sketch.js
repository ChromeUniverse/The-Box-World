/*

**************** General Variables ****************

*/

// canvas properties
const canvasW = 600; 
const canvasH = 450;

// thingy dimensions
const thingyW = 40;
const thingyH = 40;

// initial position
var x = canvasW/2;
var y = canvasH/2;

// player speed
var speedX = 5;
var speedY = 5;

/*

**************** Player Class ****************

*/

class Player{
  // creates new player instance
  constructor(name, col, x, y){
    this.name = name;
    this.col = col; // color
    this.x = x;
    this.y = y;
  }

  // renders the player on the canvas
  display() {
    // draw rectangle
    noStroke();
    fill(this.col);
    rectMode(CENTER);
    rect(this.x, this.y, thingyW, thingyH, 12, 12);

    // show player name 
    textSize(20);
    fill(color(255));
    textAlign(CENTER, BOTTOM);
    text(this.name, this.x, this.y-thingyH/2-8);    
  }
}



/*

**************** Websockets Stuff ****************

*/


// new websocket connection
const ws = new WebSocket("ws://34.200.98.64:2848");

// on connection
ws.addEventListener("open", () => {
  console.log("Connected to WS Server");  

  // sending login event to WS server
  ws.send(
    JSON.stringify(
      {
        status: 'login',
        name: playerName,
        color: playerColor,
      }
    )
  );

});

// data received from server
ws.addEventListener("message", msg => {
  var dataJson = JSON.parse(msg.data);
  var dataStatus = dataJson['status'];

  // update room state
  if (dataStatus == 'room_update'){
    var players_copy = [];
    dataJson['player_list'].forEach(p => {
      newPlayer = new Player(p['name'], p['color'], p['x'], p['y']);
      players_copy.push(newPlayer);
      players = players_copy;      
    });
  }
});







/*

**************** Program Setup ****************

*/


// list of players
let players = [];

// set random spawn position within canvas borders
let minX = thingyW;
let maxX = canvasW-thingyW;

let minY = thingyH;
let maxY = canvasH-thingyH;

let userX = Math.floor(Math.random() * (maxX-minX) ) + minX;
let userY = Math.floor(Math.random() * (maxY-minY) ) + minY;

// create the user
let user = new Player(playerName, playerColor, userX, userY);
players.push(user);



// Main setup function
function setup() {
  // set up canvas
  createCanvas(canvasW, canvasH);

  // ping the server every second or so
  let pingInterval = 1000;
  setInterval(() => { ping();}, pingInterval);
}



// change user position based on keypresses
function move(user) {
  if (keyIsDown(LEFT_ARROW)) {
    user.x -= speedX;  
    if (user.x < thingyW/2) {
      user.x = thingyW/2;
    }
  }
  if (keyIsDown(RIGHT_ARROW)) {
    user.x += speedX;  
    if (user.x > canvasW-thingyW/2) {
      user.x = canvasW-thingyW/2;
    }
  }
  if (keyIsDown(UP_ARROW)) {
    user.y -= speedY;  
    if (user.y < thingyH/2) {
      user.y = thingyH/2;
    }
  }
  if (keyIsDown(DOWN_ARROW)) {
    user.y += speedY;  
    if (user.y > canvasH-thingyH/2) {
      user.y = canvasH-thingyH/2;
    }
  }
}



// sends current position 
function sendPos(user) {
  ws.send(
    JSON.stringify(
      {
        status: 'move',
        name: user.name,
        color: user.col,
        x: user.x,
        y: user.y
      }
    )
  );
}


// websockets server ping
function ping(){
  ws.send(
    JSON.stringify(
      {
        status: 'ping',
        name: user.name
      }
    )
  );
}


// player layering
function inFront(p1, p2){
  if (p1.y > p2.y)  return 1
  if (p1.y == p2.y) return 0
  if (p1.y < p2.y)  return -1
}


/*

**************** Draw Function ****************

*/


function draw() {
  background(220);

  // only run with websocket is open
  if (ws.readyState == 1) {
    // move user's player 
    move(user);
    // send position via websockets
    sendPos(user);
  }

  // layering
  players.sort(inFront);

  // render players
  players.forEach(p => {
    p.display()
  }) 

}