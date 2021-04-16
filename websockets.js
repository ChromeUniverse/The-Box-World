// WebSockets library
const WebSocket = require("ws");

// Creating new WS server on port 2848
const wss = new WebSocket.Server({ port : 2848 });
console.log('[ WEBSOCKETS SERVER INITIALIZED ]\n')


// list of players
let players = {}; 

// connection pool
let sockets = {}


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

    console.log("[ Send out ID#"+ newID +" to new client ]\n");

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
        let newPlayerTime = Math.round(Date.now() / 1000) // UNIX epoch timestamp

        // add new player to player list
        let newPlayerEntry = {
          id: newPlayerID.toString(),
          name: newPlayerName.toString(),
          color: newPlayerColor.toString(),
          x: newPlayerX,
          y: newPlayerY,          
          time: newPlayerTime  // player's last active time
        }

        // log new player
        console.log("[ NEW USER ]", [newPlayerID, newPlayerName, newPlayerColor, newPlayerX, newPlayerY, newPlayerTime] + '\n');
        
        players[newPlayerID] = newPlayerEntry;                        
        
        console.log("[ ONLINE PLAYER LIST ]", players);

        // notify all clients that a new player has logged in
        wss.clients.forEach(client => {
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
            );
            // send JSON
            client.send(message);
          }
        });

        // send ID to newly logged in user
        send_set_room(newPlayerID);
        console.log("[ Send out initial room state to new client ]\n");
      }  
      
      // triggered on every new 'move' event
      if (dataType == "move") {                    
        // find who sent the 'move' update        
        let ID = dataJson['id'];
        let p = players[ID];
        p['x'] = dataJson['x'];
        p['y'] = dataJson['y'];
             
      }

      // triggered on every new 'ping' evert
      if (dataType == 'ping') {
        //console.log(dataJson);
                  
        // find the pinger
        let pingerID = dataJson['id'];         
        //console.log(pingerID);

        if (players.hasOwnProperty(pingerID)) {
          let p = players[pingerID];
          //console.log(players);
          //console.log(p);
          
          // updating last active time
          p['time'] = Math.round(Date.now() / 1000);
        }

      }

      if (dataType == 'up_chat') {
        // reset buffers
        let sender_name = '';
        let message_text = '';

        // find the sender
        let sender_id = dataJson['id'];      
        let p = players[sender_id]; 
      

        // fill buffers
        sender_name = p['name'];
        message_text = dataJson['message'];
        console.log('[ CHAT ] [ ' + sender_name + ' says: "' + message_text + '" ]\n');

        // rebroadcast message to all players
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            // building JSON
            let message = JSON.stringify(
              {
                type: 'down-chat',
                id:sender_id,
                name: sender_name,
                message: message_text
              }
            );
            // send JSON
            client.send(message);
          }
        });
      }

		});

		// When the WS is closed
		ws.on("close", () => {
			// Print confirmation to console
			console.log("[ CLIENT DISCONNECTED ]\n");
		});
	}
);


function room_to_send() {
  // creating player list to send to clients
  let player_list_to_send = {};

  Object.values(players).forEach(p => {
    let player_to_send = {
      id: p['id'],   
      name: p['name'],
      color: p['color'],
      x: p['x'],  
      y: p['y'],
    }
    player_list_to_send[p['id']] = player_to_send;
  });

  return player_list_to_send;
}


// send room state to all clients every [interval] milliseconds
var interval1 = 5;
setInterval(() => {

  let sending = room_to_send();
  
  // broadcast room state to all connected clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      // sending JSON
      let message = JSON.stringify(
        {
          type: 'room-update',
          'room-state': sending
        }
      );
      client.send(message);
    }
  });
  
}, interval1);


// sends room state for client-side room initialization
function send_set_room(id) {

  // creating player list to send to clients
  let sending = room_to_send();

  ws = sockets[id];

  // send room state
  ws.send(
    JSON.stringify(
        {
          type: 'set-room',
          'room-state': sending
        }
      )
    );
}


// check for inactive clients and remove them from player list
let interval2 = 700;
setInterval(() => {

  // creating copy of players list
  let players_copy = players; 
  let new_players = {};

  // looping through players
  Object.values(players_copy).forEach(p => {

    // timeout invertal (measured in seconds)
    let timeout = 2;

    // compare time now and last active time
    let time_now = Math.round(Date.now() / 1000);
    let last_active_time = p['time'];

    if (time_now - last_active_time < timeout) {
      // add active players to copy of player list
      new_players[p['id']] = p; 

    } else {
      // skip over timed out players
      console.log('[ TIMEOUT ] [ Player ' + p['name'] + ' has timed out. ]\n');

      removed_player_id = p['id'];
      removed_player_name = p['name'];

      // order clients to remove player      
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          // sending JSON
          let message = JSON.stringify(
            {
              type: 'delete-player',
              id: removed_player_id,
              name: removed_player_name
            }
          );
          client.send(message);
        }
      });
    }

  });

  // update players list
  players = new_players; 

  // log currently players currently connected
  console.log("[ ONLINE PLAYER LIST ]", players);
  
}, interval2);
