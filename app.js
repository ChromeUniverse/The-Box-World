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
  "#99C24D", // Atlantis Green
  "#2F2D2E", // Toledo  
  "#0B7A75", // Surfie Green
  "#7B2D26", // Lusty
  "#BFCDE0", // Link Water
  "#729B79", // Oxley
  "#59D2FE", // Maya Blue
];

// "Redirecting" GET requests to '/'
app.get('/', (req, res) => {
  res.status(200);
  res.sendFile('index.html');
})

app.get('/plop', (req, res) => {
  res.status(200);
  res.sendFile(__dirname + '/static/plop.mp3');
});

// POST request to /
app.post('/', (req, res) => {

  // parsing form data
  let formData = req.body;
  let username = formData['username'];
  let room = formData['room'];
  console.log('New user', username, 'requesting to join room', room);

  function isEmpty(u,r) {
    let name_empty = u.replace(/\s/g, '').length == 0;
    let room_empty = r.replace(/\s/g, '').length == 0;

    if (name_empty) {return true}
    else if (room_empty) {return true}
    else {return false}
  }

  // checking for whitespaces
  if (!isEmpty(username,room)) {

    // select random color from palette 
    let playerColor = palette[Math.floor(Math.random() * palette.length)];

    // replacing USERNAME, COLOR, ROOM with actual player name and random color
    res.status(200);
    let data = fs.readFileSync(__dirname + '/static/room.html');
    res.send(data.toString().replace('USERNAME', username).replace('COLOR', playerColor).replace('ROOM', room));
  
  } else {
    res.status(400);  
    res.sendFile(__dirname + '/static/empty.html');
  }
})

// Start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
})