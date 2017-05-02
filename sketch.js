// P5 STUFF
var shapes=[];
var colors=['darksalmon', 'mediumaquamarine', 'thistle', 'khaki'];
var playerNumber; 
var locY;
var locX;
var playerCount = 1;
var scoreArray= [8, 8, 8, 8];
var int;
var canMove = true;



function setup() {
	locX = [62.5, 187.5, 312.5, 437.5];
    locY = [575, 575, 575, 575];  
	createCanvas(500,600);
}

function draw() {
	background("white");
	// create some kind of while loop to go through array
	sendChange(); 

	for (var i = 0; i < playerCount; i++) {
		// console.log('draw players'+ i);
		stroke("silver");
		strokeWeight(3);
		fill(colors[i]);
		ellipse(locX[i], locY[i], 30);
	
	}

	if(keyIsDown(LEFT_ARROW) && canMove){
		locX[playerNumber-1] = (locX[playerNumber-1] - 3);

		if(locX[playerNumber-1] < 0) {
			// user will be stopped at edge
			locX[playerNumber-1] = 25; 
		}
	} 
	if(keyIsDown(RIGHT_ARROW) && canMove){
		locX[playerNumber-1] = (locX[playerNumber-1]+ 3);

		if(locX[playerNumber-1] > 500) {
			locX[playerNumber-1] = 475; 
		}
	}
	if(keyIsDown(UP_ARROW) && canMove){
		locY[playerNumber-1] = (locY[playerNumber-1] - 3);

		if(locY[playerNumber-1] < 0) {
			locY[playerNumber-1] = 25; 
		}
	}
	if(keyIsDown(DOWN_ARROW) && canMove){
		locY[playerNumber-1] = (locY[playerNumber-1] + 3);

		if(locY[playerNumber-1] > 600) {
			locY[playerNumber-1] = 575; 
		}
	}

	for(var i=0; i< shapes.length; i++){
		fill(colors[i%4]);
		shapes[i].display();
		shapes[i].check(i%4, i);
		// i is the index of the shape
		// i%4 give the color of the shape
	}
}

function init(){

}

function getPlayerNumber(data){
	playerNumber = data;
	alert('You are player ' + colors[playerNumber-1] + '. Eat as many shapes of your same color. Beware of other colors!');
	// textSize(32);
	// text("You are the " + colors[playerCount-1]+ "player");
	// fill(0, 102, 153);
}

// receiving change from index
function receiveChange(data) {
	// console.log("get change from" + data.player);
	// client is playerNumber and data.player is the client who's sending data

	if (playerCount < data.player) {
		playerCount = data.player; 
		// assumes there is no player #4 if there isn't a player #1etc... 
	}

	if (playerNumber != data.player) {
		locX[data.player-1] = data.x;  
		locY[data.player-1] = data.y;  
	}
}

function sendChange() {
	// sending location for player
	socket.emit('shapeChange', {"player": playerNumber, "x": locX[playerNumber-1], "y": locY[playerNumber-1]}); 
}

function recieveShapes(data){
	for(var i=0; i< 16; i++){
		shapes.push({
			"x": data.x[i] * 475,
			"y": data.y[i] * 475 + 30,
			"isActive": true,
			"display": function(){
				if(this.isActive){
					noStroke();
					triangle(this.x, this.y, this.x-20, this.y-30, this.x+20, this.y-30);
				}
			},
			"check": function(color, num){
				if(this.isActive){
					var playa = playerNumber-1; 
					if(dist(locX[playa], locY[playa], this.x, this.y-15) < 32){
						if(color == playa){
							this.isActive = false;
							subtract(playa, num);
						}
						else {
							recycleColor(playa);
							locY[playa] = 575;
						}

					}
				}
			}
			});
		}
		for(var i=0; i<16; i++) {
		shapes.push({
			"x": data.x[i+16] * 475,
			"y": data.y[i+16] * 475,
			"isActive": true,
			"display": function(){
				if(this.isActive){
					noStroke();
					rect(this.x, this.y, 30, 30);
				}
			},
			"check": function(color, num){
				if(this.isActive){
					var playa = playerNumber-1; 
					if(dist(locX[playa], locY[playa], this.x+15, this.y+15) < 35){
						if(color == playa){
							this.isActive = false;
							subtract(playa, num);
						}
						else {
							recycleColor(playa);
							locY[playa] = 575;
						}

					}
				}
			}

		});
	}
}

function hideShape(num) {
	if (!(num%4 == playerNumber-1)) {
		shapes[num].isActive = false; 
		var i = num%4;
		scoreArray[i]--;
		console.log( "player: " + (i+1) + " score subtract:" + scoreArray[i]);

		// if(scoreArray[i] == 0) {
		// 	alert(colors[i] + " won!");	
		// }
	}
}

function recycleColor(color){
	socket.emit("recycleColor", playerNumber-1);

	// I want to add a point to the scoreArray 
	// for each player, but everytime I bump into 
	// a color that's not mine, it gives me full points
	// therefore sometimes even though there are no more
	// shapes for me to eat, I still can't ever reach 0
	// whoever reaches 0 wins
	// also when we have more than one player
	// it adds points on one side but not on other

	// add(int); lit fixed it by adding an if statement
}

function drawNewColor(data){
	add(data.player);

	for(var i=data.player; i<32; i+=4 ){
		if( !shapes[i].isActive){

			if (i/16 < 1) { // we have a triangle
				shapes[i].isActive = true;
				shapes[i].x = data.x * 475;
				shapes[i].y = data.y * 475 + 30;
				return false; // when we restore one shape, it leaves this fct
			} 

			shapes[i].isActive = true;
			shapes[i].x = data.x * 475;
			shapes[i].y = data.y * 475;
			return false;
		}
	}
}

function add(i){
	if(scoreArray[i] < 8){
		scoreArray[i]++;
		console.log("player: " + (i+1) + " score add:" + scoreArray[i]);
	}
		// scoreArray[i] = scoreArray[i];
		// console.log('if add');
		console.log("score in our scoreArrays" + scoreArray[i]);
		// console.log("player: " + (i+1) + " score add:" + scoreArray[i]);
}

function subtract(i, num){
	// sending captured shape info to everyone
	socket.emit('gotShape', num); 

	scoreArray[i]--;

	// // i is the player
	// socket.emit('alertMe', i);

	if(scoreArray[i] == 0) {
		// alert(colors[i] + " won!");
		// location.reload();
		// io.sockets.emit is giving error	
		socket.emit('alertMe', i);
		// do we need a socket emit for message? 
		console.log("color of winner" + colors[i]);
	}

	console.log( "player: " + (i+1) + " score subtract:" + scoreArray[i]);
}


window.addEventListener("load", init);