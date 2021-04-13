// WebSockets library
const WebSocket = require("ws");

// Creating new WS server on port 2848
const wss = new WebSocket.Server({ port : 2848 });

// list of players
let players = []; 

// When a new client connects to the WS server
wss.on("connection",
	ws => {
		console.log("New client connected");

		// When new data is received
		ws.on("message", data => {
      let dataJson = JSON.parse(data);
      let dataStatus = dataJson["status"];
      
      // trigerred on every new login event
      if (dataStatus == "login") {
        
        // get new player name and color
        let newPlayerName = dataJson['name'];
        let newPlayerColor = dataJson['color'];
        let newPlayerX = dataJson['x'];
        let newPlayerY = dataJson['y'];
        let newPlayerTime = Math.round(Date.now() / 1000) // UNIX epoch timestamp

        console.log("\nNew user connected:" + newPlayerName);

        // add new player to player list
        let newPlayerEntry = {
          name: newPlayerName,
          color: newPlayerColor,
          x: newPlayerX,
          y: newPlayerY,          
          time: newPlayerTime  // player's last active time
        }
        players.push(newPlayerEntry);
        console.log(players);
      }
      
      
      
      // triggered on every new 'move' event
      if (dataStatus == "move") {                    
        // find who sent the 'move' update
        for (let i = 0; i < players.length; i++) {
          let p = players[i];
          // found the player who sent the 'move' event        
          if (p['name'] == dataJson['name']){
                
            // update player coordinates 
            p['x'] = dataJson['x'];
            p['y'] = dataJson['y'];
    
            break;
          }
        }                      
      }



      // triggered on every new 'ping' evert
      if (dataStatus == 'ping') {

        // find the pinger
        for (let i = 0; i < players.length; i++) {
          // found the pinger 
          if (players[i]['name'] == dataJson['name']){          
            // current time in seconds
            let time_now = Math.round(Date.now() / 1000); 
            // update player's last active time
            players[i]['time'] = time_now;
            break;
          }
        }
      }

		});

    // send room state to all clients every [interval] milliseconds
    var interval1 = 0;
    setInterval(() => {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          // building JSON
          let roomState = JSON.stringify(
            {
              status: 'room_update',
              player_list: players
            }
          );
          // send JSON
          client.send(roomState);
        }
      });
    }, interval1);




    // check for inactive clients and remove them from player list
    let interval2 = 1000;
    setInterval(() => {
      // creating copy of players list
      var players_copy = []; 

      // check every player for last active time
      for (let i = 0; i < players.length; i++) {
        let p = players[i];

        // current time in seconds
        let time_now = Math.round(Date.now() / 1000);
        let last_active_time = p['time'];
        let timeout = 1;

        // skip over timed out players
        if (time_now - last_active_time >= timeout) {
          console.log("User '" + p['name'] + "' has timed out!");
          continue;
        } 

        // add active players to copy of player list
        players_copy.push(p);
      }
      
      // update players list
      players = players_copy;
    }, interval2);
    

		// When the WS is closed
		ws.on("close", () => {
			// Print confirmation to console
			console.log("Client has disconnected.");
		});
	}
);
