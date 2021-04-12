// HTTP library
const http = require('http');
// filesystem library
const fs = require('fs');

// port number for HTTP server
const port = 4242;

// sendFile function - sends files in the HTTP response
// INPUT:
//		name of file to be sent
// 		HTTP response object

const sendFile = function(fileName, res) {
	// try to read file
	fs.readFile(fileName, function(error,data) {
		if (error) {
			// something went wrong
			// send a 404 error
			res.writeHead(404)
			res.write('Error: File Not Found')
		} else {
			// read file successfully
			// send file
			res.write(data)
		}
		// end HTTP response
		res.end()
	})
}


// creating HTTP server
const server = http.createServer(function(req, res){

  console.log(req.method)

  if (req.method == "GET") {
    // files object
    var routes = {
      '/':'static/hello.html',
      '/room':'static/room.html',
      '/sketch':'static/sketch.js',
      '/frontend':'static/client.js',
    }

    // checking if file is available
    var hasFile = routes.hasOwnProperty(req.url);
    if (hasFile) {
      // file found
      var fileName = routes[req.url];
      sendFile(fileName, res);
    } else {
      // not found 404
      res.writeHead(404);
      res.end();
    }

  } 
  
  if (req.method == 'POST') {
    var routes = {
      '/room':'static/index.html',
    }
    console.log(req);
    res.writeHead(200);
    res.end();
  }

})

// initializing HTTP server
// listens for requests on the specified port number
// INPUT: port number
//
server.listen(port, function(error) {
	if (error) {
		// something went wrong
		// print error to console
		console.log('nope', error)
	} else {
		// successfully initialized server
		// print port to console
		console.log('yep' + port)
	}
})
