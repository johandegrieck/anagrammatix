// Import the Express module
var express = require('express');

// Import the 'path' module (packaged with Node.js)
var path = require('path');

// Create a new instance of Express
var app = express();

// Import the Anagrammatix game file.
var agx = require('./agxgame');

// Create a simple Express application
app.configure(function() {

	/*SPECIFIC CONFIG FOR OPENSHIFT*/
	app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);  
	app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"); 
	
    // Turn down the logging activity
    app.use(express.logger('dev'));

    // Serve static html, js, css, and image files from the 'public' directory
    app.use(express.static(path.join(__dirname,'public')));

});

// Create a Node.js based http server on port 3000
var server = require('http').createServer(app).listen(app.get('port'), app.get('ipaddr'), function(){
		console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
	});

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

// Reduce the logging output of Socket.IO
io.set('log level',1);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
    //console.log('client connected');
    agx.initGame(io, socket);
});


