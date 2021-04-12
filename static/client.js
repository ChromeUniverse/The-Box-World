const ws = new WebSocket("ws://localhost:2848");

ws.addEventListener("open", () => {
	console.log("Connected to WS Server");
  ws.send(JSON.stringify({'username':username}));
});

ws.addEventListener("message", msg => {
	console.log("Got: ", msg.data);
	const received = JSON.parse(msg.data);
  console.table(received);
});
