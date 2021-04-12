const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/room', (req, res) => {
  let formData = req.body;
  let username = formData['username'];
  console.log("New user:" + username);

  res.status(200);
  //res.sendFile(__dirname + '/static/room.html');
  let data = fs.readFileSync(__dirname + '/static/room.html');
  res.send(data.toString().replace('USERNAME', username));

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})