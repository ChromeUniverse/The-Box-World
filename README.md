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
  * Minimal HTML for the landing page and room page with p5.js canvas 
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

## Working features

* Functional multiplayer
* Periodic server pinging and player timeout

## Todo

* High priority
  * Improve message exchange model

* Important

  * Add message/chat functionality
  * Add multiple rooms functionality
  * Check for two users with the same name
  * Make a half decent UI with some ✨fancy CSS ✨

* Not so high priority

  * Add 'Leave' button
  * Change server-side script daemon package (maybe [pm2](https://pm2.keymetrics.io/) or [nodemon](https://nodemon.io/))

* Far out ideas

  * Add WebRTC-based voice chat
 
## Gallery

![here](https://media.discordapp.net/attachments/760252264723644426/831382969770967110/unknown.png?width=650&height=550)
