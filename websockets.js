// WebSockets library
const WebSocket = require('ws');
const colors = require('colors');

// Creating new WS server
let portNumber = 2848;
const wss = new WebSocket.Server({ port : portNumber });
console.log("\n[ START ]".green,`[ Websockets server started on port ${portNumber}]\n`);


// stores all active rooms
let rooms = {}; 

// connection pool
let sockets = {}

// canvas properties
const canvasW = 600; 
const canvasH = 530;

// thingy dimensions
const thingyW = 40;
const thingyH = 40;

// player speed
const speedX = 5;
const speedY = 5;


// genreate unique ID for players
function getUniqueID() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }                                  
  return s4() + s4() + s4();
}


// Websockets stuff
wss.on("connection",
	ws => {	
    // generate new uniqueID
    let newID = getUniqueID();
    
    // send ID to newly logged in user
    ws.send(
      JSON.stringify(
        {
          type: "set-id",
          id: newID
        }
      )
    );
    
    // store websocket in sockets list
    sockets[newID] = ws;

    console.log("[ NEW ID ]".cyan, "[ Send out ID#" + newID.cyan + " to new client ]\n");

		// Incoming data
		ws.on("message", data => {
      // parse out data
      let dataJson = JSON.parse(data);
      let dataType = dataJson["type"];
      
      // trigerred on every new login event
      if (dataType == "login") {
        
        // get new player data
        let newPlayerID = dataJson['id']
        let newPlayerName = dataJson['name'];
        let newPlayerColor = dataJson['color'];
        let newPlayerX = dataJson['x'];
        let newPlayerY = dataJson['y'];
        let roomName = dataJson['room'];        

        // add new player to player list
        let newPlayerEntry = {
          id: newPlayerID.toString(),
          name: newPlayerName.toString(),
          color: newPlayerColor.toString(),
          x: newPlayerX,
          y: newPlayerY,
          room: roomName,          
        }

        // log new player
        console.log("[ NEW USER ]".cyan, "[", [newPlayerID, newPlayerName, newPlayerColor, newPlayerX, newPlayerY, roomName], ']\n');


        // creating new room if it doesn't already exist
        if (!rooms.hasOwnProperty(roomName)){
          console.log('[ NEW ROOM ]'.cyan, '[ Creating room:', roomName.cyan, ']\n');
          rooms[roomName] = {};          
        } 
        
        let room = rooms[roomName];
        room[newPlayerID] = newPlayerEntry;
        
        console.log("[ ONLINE PLAYER LIST ]".magenta, "\n", rooms, '\n');

        Object.keys(room).forEach(id => {
          let client = sockets[id];
          if (client.readyState === WebSocket.OPEN) {
            // building JSON
            let message = JSON.stringify(
              {
                type: 'new-player',
                id: newPlayerID.toString(),
                name: newPlayerName.toString(),
                color: newPlayerColor.toString(),
                x: newPlayerX,
                y: newPlayerY,  
              }
            )
            // send JSON
            client.send(message);
          }
        });        

        // send ID to newly logged in user
        send_set_room(newPlayerID, roomName);        
      }  
      
      // triggered on every new 'move' event
      if (dataType == "move") {                    
        // find who sent the 'move' update        
        let ID = dataJson['id'];    
        let roomName = dataJson['room'];
        let room = rooms[roomName];

        let keystrokes = dataJson['keys'];

        if (room.hasOwnProperty(ID)) {
          let p = room[ID];
          let x = p['x'];
          let y = p['y'];

          // check keystrokes
          if (keystrokes.includes('w')) {            
            y-= speedY; 
            if (y < thingyH/2) { y = thingyH/2; }
          }
          if (keystrokes.includes('a')) {
            x-= speedX; 
            if (x < thingyW/2) { x = thingyW/2; }                        
          }
          if (keystrokes.includes('s')) {
            y+= speedY; 
            if (y > canvasH-thingyH/2) { y = canvasH-thingyH/2; }
          }
          if (keystrokes.includes('d')) {
             x+= speedX; 
             if (x > canvasW-thingyW/2) { x = canvasW-thingyW/2; }
          }

          // update position
          p['x'] = x;
          p['y'] = y;        
        }
             
      }      

      if (dataType == 'up-chat') {
        // reset buffers
        let sender_name = '';
        let message_text = '';

        // find the sender
        let sender_id = dataJson['id']; 
        let roomName = dataJson['room'];    
        let room = rooms[roomName]; 
        
        if (room.hasOwnProperty(sender_id)) {
          let p = room[sender_id]; 
      

          // fill buffers
          sender_name = p['name'];
          message_text = dataJson['message'];
          console.log('[ CHAT ]'.yellow, '[', sender_name.yellow, '@', roomName.yellow, 'says:', message_text.yellow, ']\n');

          // rebroadcast message to all players in room
          
          Object.keys(room).forEach(id => {
            let client = sockets[id];
            if (client.readyState === WebSocket.OPEN) {
              // send message
              let message = JSON.stringify(
                {
                  type: 'down-chat',
                  id:sender_id,
                  name: sender_name,
                  message: message_text
                }
              );
              client.send(message);
            }
          });

        }   
                   
      }
		});

		// When the WS is closed
		ws.on("close", () => {
      // remove connection from sockets list
      // ...
      // update socket list
      let new_sockets = {};        
      Object.keys(sockets).forEach(id => {
        let socket = sockets[id];
        // removing timed out connections
        if (socket != ws) {
          new_sockets[id] = socket;
        } else {          
          remove_player(id);
        }
      });
      sockets = new_sockets;
		});
	}
);




// removes player from room
function remove_player(removedID){  
  
  let removed_player_room_name = '';
  let removed_player_name = '';

  // finding timed out player
  Object.keys(rooms).forEach(roomName => {
    let is_done = false;

    let room = rooms[roomName];
    let new_room = {};

    Object.keys(room).forEach(id => {
      let p = room[id];

      if (id == removedID) {
        console.log('[ REMOVE PLAYER ]'.red, '[', p['name'].red, p['id'].red, p['room'].red, ']\n');
        removed_player_name = p['name'];
        removed_player_room_name = p['room'];
        is_done = true;
      } else {
        // add active players
        new_room[id] = p;
      }

    });

    rooms[roomName] = new_room;
    
    if (is_done) {return true;}

  });


  // removing empty rooms
  
  new_rooms = {};
  
  Object.keys(rooms).forEach(roomName => {
    let is_done = false;
    let room = rooms[roomName];
    
    if (Object.keys(room) == 0) {
      console.log('[ EMPTY ROOM ]'.red, '[ Removing room', roomName.red, ']\n');
      is_done = true;
    } else {
      // add active rooms
      new_rooms[roomName] = room;
    }

    if (is_done) {return true;}
  });
  // update rooms
  rooms = new_rooms;

  // get removed player's room
  removed_player_room = rooms[removed_player_room_name];


  if (rooms.hasOwnProperty(removed_player_room_name)) {
    // alert everybody in the room
    Object.keys(removed_player_room).forEach(id => {

      let client = sockets[id];
      if (client.readyState === WebSocket.OPEN) {
        // send message
        let message = JSON.stringify(
          {
            type: 'delete-player',
            id: removedID,
            name: removed_player_name
          }
        );            
        client.send(message);            
      }    
      
    });
  }
  
}




// gets room name and returns corresponding room object
function getRoom(roomName) {

  let room = rooms[roomName];

  // creating player list to send to clients
  let room_to_send = {};

  Object.values(room).forEach(p => {
    let player_to_send = {
      id: p['id'],   
      name: p['name'],
      color: p['color'],
      x: p['x'],  
      y: p['y'],
    }
    room_to_send[p['id']] = player_to_send;
  });

  return room_to_send;
}


// send room state to all clients every [interval] milliseconds
var interval1 = 10;
setInterval(() => {

  // iterating through rooms
  Object.keys(rooms).forEach(roomName => {

    let room = rooms[roomName];    

    // send room state to all players in room
    Object.keys(room).forEach(id => {

      // get room state
      let room_state = getRoom(roomName);

      // need to check if connection is still open
      if (sockets.hasOwnProperty(id)){
        let client = sockets[id];        
        if (client.readyState === WebSocket.OPEN) {
          // sending JSON
          let message = JSON.stringify(
            {
              type: 'room-update',
              'room-state': room_state
            }
          );
          client.send(message);
        }
      }
      
    });

  });
  
}, interval1);


// sends initial room state for client-side room init
function send_set_room(id, roomName) {

  // getting client's room
  let room = getRoom(roomName);

  // get client's websocket and send room state
  let client = sockets[id];
  client.send(
    JSON.stringify(
      {
        type: 'set-room',
        'room-state': room
      }
    )
  );
}
