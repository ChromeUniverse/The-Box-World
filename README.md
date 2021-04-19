# The Box World

A simple lounge for hanging out for friends, where you play as a colorful box in a grey background.

This project was made solely for educational purposes. 

Have any ideas or suggestions? Check out the discussion page [here](https://github.com/ChromeUniverse/The-Box-World/discussions).

## At a glimpe

This is full-stack JavaScript web application.

* **Backend** - Two node.js servers:
  * One for serving static files (HTMLs and JS scripts)
  * Another one for handling real-time communication over Websockets and room state

  Libraries used: [Express](https://www.npmjs.com/package/express) for static file server, [ws](https://www.npmjs.com/package/ws) for websockets server and [forever](https://www.npmjs.com/package/forever) for daemonizing scripts

* **Frontend**
  * [p5.js](https://p5js.org/) for graphics
  * Minimal HTML for the home page and room page with p5.js canvas 
  * No stylesheets/CSS yet

## Websockets message exchange model

### Client -> Server

_Coming soon_

### Server -> Client

## Usage

_Coming soon_

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
* Home page has some ✨fancy CSS✨ styling
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
 
## Gallery

### Room view

![here](https://media.discordapp.net/attachments/760252264723644426/832846019070394428/unknown.png?width=800&height=400)
