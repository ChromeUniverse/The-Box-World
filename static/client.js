/*

**************** Constant Variables ****************

*/

// canvas properties
const canvasW = 600; 
const canvasH = 450;

// thingy dimensions
const thingyW = 40;
const thingyH = 40;

// player speed
const speedX = 5;
const speedY = 5;

// websockets server
const server = 'localhost';
//const server = '34.200.98.64';

// local list of players
let players = {};

/*

**************** Player Class ****************

*/

class Player{
  // creates new player instance
  constructor(id, name, col, x, y){
    this.id = id;
    this.name = name;
    this.col = col; // color
    this.x = x;
    this.y = y;
    this.has_msg = false;
    this.msg_text = '';
    this.msg_time = 0;
  }

  // renders the player on the canvas
  display() {
    // draw thingy
    noStroke();
    fill(this.col);
    rectMode(CENTER);
    rect(this.x, this.y, thingyW, thingyH, 12, 12);

    // show player name 
    textSize(20);
    fill(color(255));
    textAlign(CENTER, BOTTOM);
    text(this.name, this.x, this.y+thingyH/2+30);  
    
    let time_now = Math.round(Date.now()/1000);
    let timeout = max(user.msg_text.length * 1/30, 4);
    
    if (this.has_msg == true && time_now - this.msg_time < timeout) {      
      
      textSize(18);
      fill(color(255));
      triangle(this.x + 30, this.y-thingyH/2+20, this.x + 30, this.y - thingyH/2-10, this.x + 50, this.y - thingyH/2-10);
      
      if (this.x + textWidth(this.msg_text) + 60 > canvasW) {
        
        // display text box
        rectMode(CORNER);
        noStroke();
        fill(255);
        rect(canvasW - textWidth(this.msg_text) - 30, this.y-40, textWidth(this.msg_text)+30, textSize(this.msg_text)+10, 10, 10);

        // display message text
        noStroke();
        fill(this.col);
        textAlign(RIGHT, TOP);
        text(this.msg_text, canvasW - 15, this.y-35);
        
      } else {
        
        // display text box
        rectMode(CORNER);
        noStroke();
        fill(255);
        rect(this.x + 30, this.y-40, textWidth(this.msg_text)+30, textSize(this.msg_text)+10, 10, 10);

        // display message text
        noStroke();
        fill(this.col);
        textAlign(LEFT, TOP);
        text(this.msg_text, this.x + 45, this.y-35);
      
      }
      
    } else {
      this.has_msg = false;
      this.msg_text = '';
    }
  }
}


/*

**************** User Setup ****************

*/

// blank unique ID
let userID = '';

// set random spawn position within canvas borders
let minX = thingyW;
let maxX = canvasW-thingyW;
let minY = thingyH;
let maxY = canvasH-thingyH;

let userX = Math.floor(Math.random() * (maxX-minX) ) + minX;
let userY = Math.floor(Math.random() * (maxY-minY) ) + minY;

let user = new Player(userID, userName, userColor, userX, userY);





/*

**************** Websockets ****************

*/


// new websocket connection

const ws = new WebSocket('ws://' + server + ':2848');

// on connection
ws.addEventListener("open", () => {
  console.log("Connected to WS Server");  
});

// data received from server
ws.addEventListener("message", msg => {
  var dataJson = JSON.parse(msg.data);
  var dataType = dataJson['type'];

  // set user's unique ID
  if (dataType == 'set-id'){
    let ID = dataJson['id'];
    user.id = ID;
    // send login data
    send_login();
  }

  // set room
  if (dataType == 'set-room'){
    if (dataJson['room-state'].length != 0) {
      // looping through players in room state
      Object.values(dataJson['room-state']).forEach(p=>{
        let ID = p['id'];
        // create new players and add them to list
        newPlayer = new Player(
          p['id'], 
          p['name'], 
          p['color'], 
          p['x'], 
          p['y']
        );
        players[ID] = newPlayer;
      });
    } else {
      console.log('room is empty');
    }


    // start pinging the server every second or so
    let pingInterval = 1000;
    setInterval(() => { ping();}, pingInterval);
  }

  // update room state
  if (dataType == 'room-update'){

    let room = dataJson['room-state'];

    // looping over entries 
    Object.values(room).forEach(entry => {
      let player_id = entry['id'];

      if ( players.hasOwnProperty(player_id)) {
        // update player attributes on local player list
        let player = players[player_id];
        player.x = entry['x'];
        player.y = entry['y'];
      }

    });
  }

  // update room state
  if (dataType == 'new-player'){
  
    // get new player attributes
    newPlayer_ID = dataJson['id'];
    newPlayer_name = dataJson['name'];
    newPlayer_color = dataJson['color'];
    newPlayer_X = dataJson['x'];
    newPlayer_Y = dataJson['y'];

    // create new player and add it to players list
    // (but only if it's not the user)
    if (newPlayer_ID != user.id) {
      newPlayer = new Player(newPlayer_ID, newPlayer_name, newPlayer_color, newPlayer_X, newPlayer_Y);      
      players[newPlayer_ID] = newPlayer;
    }
    
  }

  if (dataType == 'down-chat') {      
    let senderID = dataJson['id'];    
    let sender = players[senderID];     

    let message_text = dataJson['message'];
    console.log(sender.name + ' sent a message: "' + message_text + '"');

    sender.has_msg = true;
    sender.msg_text = dataJson['message'];
    sender.msg_time = Math.round(Date.now()/1000)

  }

  if (dataType == 'delete-player') {

    let removedID = dataJson['id'];    

    // creating copy of players list
    let players_copy = {};
  
    // looping through players
    Object.values(players).forEach(p => {

      if (p.id === removedID) {        
        // skip over removed played
        console.log('Player ' + p['name'] + ' has left the room. ');        
      } else {
        // add active players to copy of player list        
        players_copy[p.id] = p;      
      }

    });

    // update players list
    players = players_copy;
  }

});





/*

**************** WS Functions ****************

*/

// send login data
function send_login() {
  ws.send(
    JSON.stringify(
      {
        type: 'login',
        id: user.id,
        name: user.name,
        color: user.col,
        x: user.x,
        y: user.y
      }
    )
  );
}

// send chat message to WS server
function sendChat() {
  // get message text
  let message = document.getElementById('chat').value;
  
  // update user attibutes
  /*
  user.has_msg = true;
  user.msg_text = message;
  user.msg_time = Math.round(Date.now() / 1000);  
  */

  // send message over websockets
  ws.send(
    JSON.stringify(
      {
        type: 'up_chat',
        id: user.id,
        name: user.name,
        message: message,
      }
    )
  );
}

// change user position based on keypresses
function move() {
  let moved = false;
  if (keyIsDown(LEFT_ARROW)) {
    moved = true;
    user.x -= speedX;  
    if (user.x < thingyW/2) {
      user.x = thingyW/2;
    }
  }
  if (keyIsDown(RIGHT_ARROW)) {
    moved = true;
    user.x += speedX;  
    if (user.x > canvasW-thingyW/2) {
      user.x = canvasW-thingyW/2;
    }
  }
  if (keyIsDown(UP_ARROW)) {
    moved = true;
    user.y -= speedY;  
    if (user.y < thingyH/2) {
      user.y = thingyH/2;
    }
  }
  if (keyIsDown(DOWN_ARROW)) {
    moved = true;
    user.y += speedY;  
    if (user.y > canvasH-thingyH/2) {
      user.y = canvasH-thingyH/2;
    }
  }
  
  return moved;
}

// sends current position 
function sendPos() {
  if (move(user)) {
    ws.send(
      JSON.stringify(
        {
          type: 'move',
          id: user.id, 
          name: user.name,
          x: user.x,
          y: user.y
        }
      )
    );
  }
}

// websockets server ping
function ping(){
  ws.send(
    JSON.stringify(
      {
        type: 'ping',
        id: user.id, 
        name: user.name     
      }
    )
  );
}


/*

**************** Main Program ****************

*/

// Main setup function
function setup() {
  // set up canvas
  let canvas = createCanvas(canvasW, canvasH);
  canvas.parent('canvas');

}

// player layering
function inFront(p1, p2){
  if (p1.y > p2.y)  return 1
  if (p1.y == p2.y) return 0
  if (p1.y < p2.y)  return -1
}

function draw() {
  background(220);

  // only run with websocket is open
  if (ws.readyState == 1) {
    // send position via websockets
    sendPos(user);
  }

  
  let render = [];

  Object.values(players).forEach(p => {
    render.push(p);
  });

  // layering
  render.sort(inFront);

  render.forEach(p => {
    p.display();
  })

}