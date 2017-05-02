// HTTP PORTION

var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	// console.log("The Request is: " + parsedUrl.pathname);
		
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

var currentPlayer = 1; 
var currentRoom = Math.random().toString(36).substring(7); 

var io = require('socket.io').listen(httpServer);

function genShapes(theRoom){
			var numbersX=[32];
			var numbersY=[32];

			for(var i=0; i<32; i++){
				numbersX[i]= Math.random();
				numbersY[i]= Math.random();
			}

			io.to(theRoom).emit('getShapes', {"x": numbersX, "y": numbersY}); 
			console.log("sending shapes");

}

io.sockets.on('connection', 

	function (socket) {
		var thisRoom = currentRoom;

		// creating a new room
 		socket.join(currentRoom);

		console.log("We have a new client: " + socket.id);

		var playerNumber = currentPlayer;

		// updating server's information
		socket.emit('playerNumber', playerNumber); 

		if(currentPlayer == 4){
			genShapes(thisRoom);
		}

		currentPlayer += 1;  

		// creating a new room once more than 4 people are connected
		if (currentPlayer > 4) {
			currentPlayer = 1; 
			// creating random string to name different rooms
			currentRoom = Math.random().toString(36).substring(7); 
			console.log('WELCOME TO CURRENT ROOM' + currentRoom);
		}

		socket.on('recycleColor', function(data){
				var numberX; 
				var numberY;
				numberX= Math.random();
				numberY= Math.random();
				io.to(thisRoom).emit('getRecycle', {"x": numberX, "y":numberY, "player": data});
		});

		// room functionalities here 

		socket.on('shapeChange', function(data) {
			// what serveer does when it gets message 
			// filtering data it to the right room

			// everytime somebody changes shape 
			// client sends change to everyone in room through server
			io.to(thisRoom).emit('getChange', data); 
			// console.log("this is what data is: " + data.player);
			// client will recieve its own changes
			// taking data from clients and sending it to every client on that room
		});

		socket.on('gotShape', function(num) {
			// sending the number of the shape
			io.to(thisRoom).emit('sendShape', num); 
		});

		socket.on('alertMe', function(player) {

			// io.to(thisRoom).emit('sendWinner', player);
			gameOver(thisRoom, player);
			// if(scoreArray[player] == 0) {
			// 	alert(colors[player] + " won!");
			// 	// location.reload();	
				
			// 	// do we need a socket emit for message? 
			// 	console.log("color of winner" + colors[player]);

			// 	io.to(thisRoom).emit('sendWinner', player);
			// }

		});

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);


function gameOver(room, player) {
	io.to(room).emit('sendWinner', player);
	
}





