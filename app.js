const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));

const palette = ["#F18F01", "#048BA8", "#2E4057", "#99C24D", "#2F2D2E", "#19535F", "#0B7A75", "#D7C9AA", "#7B2D26", "#BFCDE0", "#729B79", "#59D2FE"];

app.get('/room', (req, res) => {
  res.status(405);
  res.sendFile(__dirname + '/static/index.html');
})

app.post('/room', (req, res) => {
  let formData = req.body;
  let username = formData['username'];
  console.log("New user:" + username);

  let playerColor = palette[Math.floor(Math.random() * palette.length)];

  res.status(200);
  let data = fs.readFileSync(__dirname + '/static/room.html');
  res.send(data.toString().replace('USERNAME', username).replace('COLOR', playerColor));

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})