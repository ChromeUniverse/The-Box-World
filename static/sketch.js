///
/// Player class
///

class Player{
  constructor(name, x, y){
    this.x = x;
    this.y = y;
    this.dimensionX = 80;
    this.dimensionY = 80;
    this.col = playerColor;
    this.name = name;
  }
  
  /*
  move(dir){
    this.velocity.add(dir.mult(this.acceleration))
    this.velocity.mult(this.damping);
    this.position.add(this.velocity)
  }
  */
  
  underMouse() {
    return mouseX >= this.x-this.dimensionX/2 &&
           mouseX <= this.x+this.dimensionX/2 &&
           mouseY >= this.y-this.dimensionY/2 &&
           mouseY <= this.y+this.dimensionY/2;
  }
  
  display(){
    noStroke();
    fill (this.col);
    rectMode(CENTER);
    
    rect(this.x, this.y, this.dimensionX, this.dimensionY, 12, 12);
    
    if (this.underMouse()){
      textSize(20);
      fill(color(255))
      textAlign(CENTER, BOTTOM);
      text(this.name, this.x, this.y-this.dimensionY/2-8);
    }
  }

}

///
///   getDir 
///
/*
function getDir(){
  let dirX = 0;
  let dirY = 0;
  if (keyIsDown(UP_ARROW))    dir.y --;
  if (keyIsDown(DOWN_ARROW))  dir.y ++;
  if (keyIsDown(LEFT_ARROW))  dir.x --;
  if (keyIsDown(RIGHT_ARROW)) dir.x ++;
  dir.normalize();
  return dir;
}
*/

///
///   inFront
///

function inFront(p1, p2){
  if (p1.y > p2.y)  return 1
  if (p1.y == p2.y) return 0
  if (p1.y < p2.y)  return -1
}


///
///   Main code
///

let players = [];

/*
[
  ['Lucca', 100, 100],
  ['Elon Musk', 150, 12]
]
*/

const ws = new WebSocket("ws://localhost:2848");

ws.addEventListener("open", () => {
  console.log("Connected to WS Server");  
  ws.send(
    JSON.stringify(
      {
        type: 'login',
        name: playerName
      }
    )
  );
});

// data received from server
ws.addEventListener("message", msg => {
  //console.log("Got: ", msg.data);
  let dataJson = JSON.parse(msg.data);
  let dataType = dataJson['type'];
  
  // add new player to room
  if (dataType = 'new_player'){
    let newPlayerName = dataJson['name'];
    let newPlayerX = dataJson['x'];
    let newPlayerY = dataJson['y'];
    //new Player(newPlayerName, newPlayerX, newPlayerY));
    //let newPlayerEntry = [newPlayerName, newPlayerX, newPlayerY];
    //players.push(newPlayerEntry);
    players.push(new Player(newPlayerName, newPlayerX, newPlayerY));
  }

  // remove player from room
  if (dataType = 'remove_player'){
    let playerName = dataJson['name'];
    let players_copy = [];

    for (var i = 0; i < players.length; i++) {
      let player = players[i];
      if (players[i].name != playerName) {
        players_copy.push(player);
      }
    }
    players = players_copy;
  }

  
  if (dataType = 'room_update'){
    //console.log(dataJson['player_list'][0]['x']);
    players.forEach(player => {
      for (let i = 0; i < dataJson['player_list'].length; i++) {
        let playerJson = dataJson['player_list'][i];
        if ( player.name == playerJson['name'] ) {
          player.x = playerJson['x'];
          player.y = playerJson['y'];
        }
      } 
    });
    console.log(players)
  }
  

  //console.table(dataJson);
});

function setup() {
  createCanvas(600, 600);
}


function send_keys(){
  let upKey = false;
  let downKey = false;
  let leftKey = false;
  let rightKey = false;
  if (keyIsDown(UP_ARROW))    upKey = true;
  if (keyIsDown(DOWN_ARROW))  downKey = true;
  if (keyIsDown(LEFT_ARROW))  leftKey = true;
  if (keyIsDown(RIGHT_ARROW)) rightKey = true;
  keyJson = JSON.stringify(
    {
      type: 'move',
      name: playerName,
      key_presses: {
        'up': upKey,
        'down': downKey,
        'left': leftKey,
        'right': rightKey
      }
    }
  );
  //console.table(keyJson);
  ws.send(keyJson);
}

function draw() {
  background(color('rgba(110, 110, 110, 1)'));
  send_keys();
  players.sort(inFront);
  players.forEach(i => i.display());

}
