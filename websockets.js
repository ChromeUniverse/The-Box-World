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
        console.log("\nNew user connected:" + newPlayerName);

        // add new player to player list
        let newPlayerEntry = {
          name: newPlayerName,
          color: newPlayerColor,
          x: newPlayerX,
          y: newPlayerY,
        }
        players.push(newPlayerEntry);
        console.log(players);

        /*
        // Resend login event to all connected clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            // building JSON
            let newPlayerData = JSON.stringify(
              {
                type: 'new_player',
                name: newPlayerName,
                color: newPlayerColor,
                x: 100,
                y: 100
              }
            );
            // send JSON
            client.send(newPlayerData);
          }
        });
        */
      }

      // triggered on every new move event
      if (dataStatus == "move") {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            // updating players list
            players.forEach(p => {
              if (p['name'] == dataJson['name']){
                p['x'] = dataJson['x'];
                p['y'] = dataJson['y'];
              }
            })

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
      }
      

		});

		// When the WS is closed
		ws.on("close", () => {
			// Print confirmation to console
			console.log("Client has disconnected.");
		});
	}
);
