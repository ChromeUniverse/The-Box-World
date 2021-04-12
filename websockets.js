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
      let json_data = JSON.parse(data);
      let username = json_data["username"];
      players.push(username);
      
      console.log("New user connected:" + username);
      console.log("Players logged in:" + players);


			// Resend new data to all clients...
			wss.clients.forEach(client => {
				if (client.readyState === WebSocket.OPEN) {
					// ... but only if their WS is still open
					client.send(data);
				}
			});

		});

		// When the WS is closed
		ws.on("close", () => {
			// Print confirmation to console
			console.log("Client has disconnected.");
		});
	}
);
