const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 8080;

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));

// color palette
const palette = [
  "#F18F01", // Tangerine
  "#048BA8", // Eastern Blue
  "#2E4057", // Madison
  "#99C24D", // Atlantis Green
  "#2F2D2E", // Toledo
  "#19535F", // Dark Teal Blue
  "#0B7A75", // Surfie Green
  "#D7C9AA", // Aths Special
  "#7B2D26", // Lusty
  "#BFCDE0", // Link Water
  "#729B79", // Oxley
  "#59D2FE", // Maya Blue
];

// "Redirecting" GET requests to '/room' to '/'
app.get('/room', (req, res) => {
  res.status(405);
  res.sendFile(__dirname + '/static/index.html');
})

// POST request to /room
app.post('/room', (req, res) => {
  // parsing form data
  let formData = req.body;
  let username = formData['username'];
  console.log("New user:" + username);

  // select random color from palette 
  let playerColor = palette[Math.floor(Math.random() * palette.length)];

  // replacing USERNAME and COLOR with actual player name and random color
  res.status(200);
  let data = fs.readFileSync(__dirname + '/static/room.html');
  res.send(data.toString().replace('USERNAME', username).replace('COLOR', playerColor));

})

// Start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
})