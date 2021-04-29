/*

**************** Constant Variables ****************

*/

// canvas properties
const canvasW = 600; 
const canvasH = 530;

// thingy dimensions
const thingyW = 40;
const thingyH = 40;

// player speed
const speedX = 5;
const speedY = 5;

// websockets server
const server = 'localhost';
// const server = '192.168.1.109'
// const server = '34.200.98.64';
// const server = '18.229.74.58';

// local list of players
let players = {};




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
  if (dataType == 'new-player') {new_player(dataJson);}

  if (dataType == 'down-chat')  {down_chat(dataJson);}

  if (dataType == 'delete-player') {delete_player(dataJson);}

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
        y: user.y,
        room: roomName
      }
    )
  );
}

// send chat message to WS server
function sendChat() {
  // get message text
  let input = document.getElementById('send-message');
  let message = input.value;

  // clear input field
  input.value = '';
  
  // Checking if input is empty
  if (message.replace(/\s/g, '').length > 0) {
    // send message over websockets
    ws.send(
      JSON.stringify(
        {
          type: 'up-chat',
          id: user.id,
          name: user.name,
          message: message,
          room: roomName
        }
      )
    );
  }
}

// change user position based on keypresses
function keys() {
  let moved = false;

  let keystrokes = '';
  
  if (keyIsDown(UP_ARROW)) {
    moved = true;
    keystrokes += 'w';    
  }
  if (keyIsDown(LEFT_ARROW)) {
    moved = true;
    keystrokes += 'a';
  }
  if (keyIsDown(DOWN_ARROW)) {
    moved = true;
    keystrokes += 's';
  }
  if (keyIsDown(RIGHT_ARROW)) {
    moved = true;
    keystrokes += 'd';
  }
  
  if (keyIsDown(13)){
    // send chat when Enter is pressed    
    sendChat();
  }
  
  
  return [ moved, keystrokes ];
}

// sends current position 
function sendKeys() {

  let data = keys();
  let moved = data[0];
  let keystrokes = data[1];

  if (moved) {
    ws.send(
      JSON.stringify(
        {
          type: 'move',
          id: user.id, 
          name: user.name,
          keys: keystrokes,
          room: roomName
        }
      )
    );
  }

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
    sendKeys(user);
  }


  // rendering players on screen

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