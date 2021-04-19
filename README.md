# The Box World

A simple lounge for hanging out with friends, where you play as a colorful box in a grey background.

This project was made solely for educational purposes. 

Have any ideas or suggestions? Check out the discussion page [here](https://github.com/ChromeUniverse/The-Box-World/discussions).

## Gallery

### Room page

![here](https://media.discordapp.net/attachments/760252264723644426/833543383335043113/unknown.png?width=800&height=500)


## At a glimpe

This is full-stack JavaScript web application.

* **Backend** - Two Node.js servers:
  * One for serving static files (HTMLs, client-side JS scripts and CSS stylesheets)
  * Another one for handling real-time communication over Websockets and room state

  Libraries used: [Express](https://www.npmjs.com/package/express) for static file server, [ws](https://www.npmjs.com/package/ws) for websockets server and [pm2](https://www.npmjs.com/package/pm2) for daemonizing scripts

* **Frontend**
  * Minimal HTML for the home page (no styling yet) - just a simple POST request form with the user's name and room name.
  * Room page uses CSS with Flexbox for styling and a client-side script with a [p5.js](https://p5js.org/) canvas for graphics and a websocket client

## Websockets message exchange model

### Server -> Client

* Message type `set-id`

  ```json
  {
    type: "set-id",
    id: "372dd9b624af"
  } 
  ```

  Sent to client on every new connection. Specficies a unique hexadecimal ID that the client uses to identify itself when exchanging other messages with the server.

* Message type `
  ```json
  {
    type: "set-room",
    room-state: 
    {
      "372dd9b624af": {
        id: "372dd9b624af",
        name: "Lucca",
        color: "#0B7A75",
        x: 258,
        y: 225,
      },
      "5b6fd779e7ee": {
        id: "5b6fd779e7ee",
        name: "qrno",
        color: "#F18F01",
        x: 525,
        y: 367,
      }
    }
  }
  ```

  Sent to a client that has just logged in. This message displays the room state prior to the client"s login. 
  
  The client parses out this JSON to set the initial players positions on the p5.js canvas. 

* Message type `new player`
  ```json
  {
    type: "new-player",
    id: "f6759586f1a3",
    name: "Tyuk3",
    color: "#729B79",
    x: 522,
    y: 42,  
  }
  ```

  Sent to all active players in the room. States that a new player has been added to the room.
  
  All clients add the new player to the local player list and the p5.js canvas.

* Message type `room-update`
  ```json
  {
    type: "set-room",
    room-state: 
    {
      "372dd9b624af": {
        id: "372dd9b624af",
        name: "Lucca",
        color: "#0B7A75",
        x: 258,
        y: 225,
      },
      "5b6fd779e7ee": {
        id: "5b6fd779e7ee",
        name: "qrno",
        color: "#F18F01",
        x: 525,
        y: 367,
      },
      "965706c2062e": {
        id: "965706c2062e",
        name: "Vilsu",
        color: "#59D2FE",
        x: 266,
        y: 349,
      }
    }
  }
  ```

  Sent regularly to all active players in all rooms. Represents the current positions for all active players in the room.

  The clients use this data to update the player's position on the p5.js canvas.

* Message type `down-chat`
  ```json
  {
    type: "down-chat",
    id: "372dd9b624af",
    name: "Lucca",
    message: "Hi guys!😄"
  }
  ```

  Sent to all active players in the room when a new chat message is received by the server. The server simply rebroadcasts the new chat message to all clients and doesn't store any information about it. 
  
  The clients parse out this JSON, display a bubble above the corresponging player and add it to the chat.

* Message type `delete-player`
  ```json
  {
    type: "delete-player",
    id: "5b6fd779e7ee",
    name: "qrno"
  }
  ```

  Sent to all players in the room when a client closes its websocket connection and, therefore, has left the room. 

  The clients use this to display an alert on the chat to remove the player from their local player list.



### Client -> Server

* Message type `login`
  ```json
  {
    type: "login",
    id: "372dd9b624af",
    name: "Lucca",
    color: "#0B7A75",
    x: 258,
    y: 225,
    room: "room1"
  }
  ```

  Sent to the server right after the client has received its unique hex ID. 

  The server uses this data to update the room state and rebroadcasts this data to all players in the same room in the form of a `new-player` message.

* Message type `move`

  ```json
  {
    type: "move",
    id: "372dd9b624af",
    name: "Lucca",
    color: "#0B7A75",
    x: 258,
    y: 225,
    room: "room1"
  }
  ```

  Sent to the server everytime the user presses the arrow keys. Constains the user's new position.

  The server parses this JSON and updates the room state.

* Message type `up-chat`
  ```json
  {
    type: "up-chat",
    id: "372dd9b624af",
    name: "Lucca",
    message: "Hi guys!😄",
    room: "room1"
  }
  ```

  Sent to the server when the user sends a new chat message.

  The server rebroadcasts this message to all active players in the room in the form of a `down-chat` message.


## Usage (Ubuntu Linux)

* Clone this repo and `cd` into it

`git clone https://github.com/ChromeUniverse/The-Box-World.git`

`cd The-Box-World`

* Make sure you have Node.js installed

`node --version`

(Install it if haven"t already)

`sudo apt update`

`sudo apt install nodejs`

* Install packages with npm

`sudo npm install -g`

(If that doesn"t work, you"ll have to install packages manually)

`sudo npm install express -g`

`sudo npm install ws -g`

`sudo npm install pm2 -g`

* Run server scripts

`pm2 start app.js`

`pm2 start websockets.js`

## Folder Structure


```
.
├── bash                    # bash shell scripts
├── node modules            # node.js packages
├── static                  # static files
|
├── package.json            # npm packages
├── package-lock.json
|
├── app.js                  # node.js Express server
├── websockets.js           # node.js websockets server
|
├── messages.txt            # mockups for websocket messages
└── .gitignore
```

## Progress

* Functional multiplayer
* Periodic server pinging and player timeout
* Working chat with message bubble
* Two players can now have the same name
* Users automatically time out and and are removed from the room after 5 seconds of inactivity
* Room page has some ✨fancy CSS✨ styling
* Changed package daemonizer to [PM2](https://pm2.keymetrics.io/)
* Chat now displays alert messages (e.g.:_Player joined the room_ and _Player has left the room_) 
* Added chat auto-scroll (when receiving new messages) and improved chat styles
* Room page now uses Flexbox-based styling
* Added simpler (and more efficient/more effective!) player timeout and remove functions
* Added multiple room functionality

## Todo

* High priority
  * Improve message exchange model 
  * Implement full server-side room state processing 
  * Add actual fun features (games, video watch-along, something idk)

* Important      
  * Improve styles
    * Make a half decent UI with some ✨fancy CSS✨ for the home page
      

* Not so high priority
  * Add buttons for navigation
    * Change room
    * Return to home page

* Far out ideas
  * Add WebRTC-based voice chat
 
