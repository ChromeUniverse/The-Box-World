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

// speed
var speedX = 5;
var speedY = 5;

// color palette
const palette = ["#F18F01", "#048BA8", "#2E4057", "#99C24D", "#2F2D2E", "#19535F", "#0B7A75", "#D7C9AA", "#7B2D26", "#BFCDE0", "#729B79", "#59D2FE"];


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
  //console.log("Got: ", msg.data);
  var dataJson = JSON.parse(msg.data);
  var dataStatus = dataJson['status'];
  

  // add new player to room
  if (dataStatus == 'new_player'){
    //console.log('Got a new player!');
    var newPlayerName = dataJson['name'];
    var newPlayerColor = dataJson['color'];
    var newPlayerX = dataJson['x'];
    var newPlayerY = dataJson['y'];
    
    //new Player(newPlayerName, newPlayerX, newPlayerY));
    //let newPlayerEntry = [newPlayerName, newPlayerX, newPlayerY];
    //players.push(newPlayerEntry);
    players.push(new Player(newPlayerName, newPlayerColor, newPlayerX, newPlayerY));
  }


  // remove player from room
  if (dataStatus == 'remove_player'){
    //console.log('Remove one player');
    var playerName = dataJson['name'];
    var players_copy = [];

    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      if (players[i].name != playerName) {
        players_copy.push(player);
      }
    }
    players = players_copy;
  }


  // update room state
  if (dataStatus == 'room_update'){
    /*
    players.forEach(p => {
      for (var i = 0; i < dataJson['player_list'].length; i++) {
        var playerJson = dataJson['player_list'][i];
        if ( p.name == playerJson['name'] ) {
          p.x = playerJson['x'];
          p.y = playerJson['y'];
        }
      } 
    });
    */
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
var players = [];

// represents the actual user
let user = new Player(
  playerName, 
  playerColor, 
  Math.floor(Math.random() * canvasW) + 1, 
  Math.floor(Math.random() * canvasH) + 1
);


// Main setup function
function setup() {
  createCanvas(canvasW, canvasH);

  // ping the server every second or so
  setInterval(() => {    
      ping();      
  }, 1000);
}


// handling keypresses
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



// sends current position to websockets server
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

  // move user's player 
  move(user);

  // send position via websockets
  sendPos(user);

  // layering
  players.sort(inFront);

  // render players
  players.forEach(p => {
    p.display()
  }) 

}