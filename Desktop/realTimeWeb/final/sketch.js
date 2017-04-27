// P5 STUFF
var shapes=[];
var colors=['blue', 'red', 'green', 'yellow'];
var playerNumber; 
var locY;
var locX;
var playerCount = 1;
var scoreArray= [8, 8, 8, 8];
var int;



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
		stroke("black");
		strokeWeight(3);
		fill(colors[i]);
		ellipse(locX[i], locY[i], 30);
	
	}

	if(keyIsDown(LEFT_ARROW)){
		locX[playerNumber-1] = (locX[playerNumber-1] - 3);
	}
	if(keyIsDown(RIGHT_ARROW)){
		locX[playerNumber-1] = (locX[playerNumber-1]+ 3);
	}
	if(keyIsDown(UP_ARROW)){
		locY[playerNumber-1] = (locY[playerNumber-1] - 3);
	}
	if(keyIsDown(DOWN_ARROW)){
		locY[playerNumber-1] = (locY[playerNumber-1] + 3);
	}

	for(var i=0; i< shapes.length; i++){
		fill(colors[i%4]);
		shapes[i].display();
		shapes[i].check(i%4);

	}

}

function init(){

}

function getPlayerNumber(data){
	playerNumber = data;
	alert('You are player ' + colors[playerNumber-1] + '. Eat as many shapes of the same color!');
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
			"x": data.x[i] * 500,
			"y": data.y[i] * 500,
			"isActive": true,
			"display": function(){
				if(this.isActive){
					noStroke();
					triangle(this.x, this.y, this.x-20, this.y-30, this.x+20, this.y-30);
				}
			},
			"check": function(color){
				if(this.isActive){
					for(var i=0; i< 4; i++){
					if(dist(locX[i], locY[i], this.x, this.y-15) < 35){
						if(color == i){
							this.isActive = false;
							subtract(i);
						}
						else{
							recycleColor(i);
							locY[i] = 575;
							int= i;
						}

					}
				}
				}
			}

		});
	}
		for(var i=0; i<16; i++){
		shapes.push({
			"x": data.x[i+16] * 500,
			"y": data.y[i+16] * 500,
			"isActive": true,
			"display": function(){
				if(this.isActive){
					noStroke();
					rect(this.x, this.y, 30, 30);
				}
			},
			"check": function(color){
				if(this.isActive){
					for(var i=0; i< 4; i++){
					if(dist(locX[i], locY[i], this.x+15, this.y+15) < 35){
						if(color == i){
							this.isActive = false;
							subtract(i);

						}
						else{
							recycleColor(i);
							locY[i] = 575;
							int= i;
						}

					}
					}
				}
			}

		});
	}
}


function recycleColor(color){
	socket.emit("recycleColor", playerNumber-1);
}


function drawNewColor(data){
	for(var i=data.player; i<32; i+=4 ){
		if( !shapes[i].isActive){
			add(int);
			shapes[i].isActive = true;
			shapes[i].x = data.x * 500;
			shapes[i].y = data.y * 500;
			return false;
		}
	}
}


function add(int){
	while(scoreArray[int] < 8){
		scoreArray[int]++;
		console.log("player: " + (int+1) + " score add:" + scoreArray[int]);
	}
		// scoreArray[i] = scoreArray[i];
		// console.log('if add');
		console.log(scoreArray[int]);
		// console.log("player: " + (i+1) + " score add:" + scoreArray[i]);
}
function subtract(i){
	if(scoreArray[i] == 0){
		alert("the game is over.");
	}
	else{
		scoreArray[i]--;
		console.log( "player: " + (i+1) + " score subtract:" + scoreArray[i]);
	}
}




window.addEventListener("load", init);