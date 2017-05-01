// HTTP PORTION

var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
		
	fs.readFile(__dirname + parsedUrl.pathname, 
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

// WEBSOCKET PORTION

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 

	function (socket) {
		console.log('socket server is running'); 
		console.log('new connection ' + socket.id);

		// socket.on('mouse', function(data) {
			
		// 	console.log(data);
		// 	//socket.broadcast.emit('otherdrawing', data); 
		// });

		socket.on('tagged', function(){
			console.log('yes');
		});

		socket.on('test', function(){
			console.log("test");
		});

		//listen for and receive tagged event
		// socket.on('tagged', function(data){
		// 	console.log("tagged happened, x: " + data.x + ", y:" + data.y);
		// });

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);