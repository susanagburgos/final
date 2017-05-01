var pins = []; // array of objects
var d; // diameter of circles 
var r; 
var tag;
var value;
var socket; 

function setup() {	
  createCanvas(windowWidth, windowHeight);  
  //var pins = []; // array of objects
  d = 50; // diameter of circles 
  r = d/2; 
  tag = false;
  value = random(120);
 
  for(var i = 0; i < 10; i++) {
  	var speedX = random(-4, 4);
  	var speedY = random(-4, 4);
  	var randX = random(0, windowWidth);
	var randY = random(0, windowHeight);

	pins.push(new Pin(randX, randY, speedX, speedY)); 
  }	

  socket = io.connect('http://localhost:8080');
}

function draw() {	
	socket.emit('test');
	
	background(0); 
	for(var i = 0; i < pins.length; i++) {
		pins[i].display();
		pins[i].move();
	}	
}

/* function sendTags(message) {
	socket.emit('tags', message);
}

function updateTags(ballX, ballY, speedX, speedY, ballColor) {
	// updating info of tags that I am receiving
	// how can I update
	// I want ball being passed that have 0 speed

} 
*/ 

function windowResize() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {

	

	// if mouse is pressed, check if mouse is on bubble
	// if mouse is on ball change color of that bubble

	//tagged stops the ball from moving when it's clicked
	for(var i = 0; i < pins.length; i++) {
  		pins[i].tagged(); // once mouse is clicked, I want to trigger something in every object
  		//send x and y position of that ball to the server
  		
  		// console.log('tagged x:' + pins[i].x + ', y: ' + pins[i].y);
  	}

 //  	console.log('Sending: ' + mouseX + ',' + mouseY);	

 //  	var data = {
	// 		x: mouseX,
	// 		y: mouseY
	// }

	// socket.emit('mouse', data);
}

function Pin(x, y, speedX, speedY) {
	this.x = x; // position of circle
	this.y = y; 
	this.color = color(255);
	this.speedX = speedX; // speed of circle
	this.speedY = speedY;

	this.display = function() {
		fill(this.color);
		ellipse(this.x, this.y, d, d);

	}

	this.move = function() {

		// constructing barriers for ball 

		if (this.x < 0 || this.x > width) { 
			this.speedX *= -1; 
		} 

		if (this.y < 0 || this.y > height) {
			this.speedY *= -1; 
		}

		this.x = this.x + this.speedX; 
		this.y = this.y + this.speedY; 
	} 

	this.tagged = function() {
		
		var dis = dist(mouseX, mouseY, this.x, this.y);

		if (dis < 25) {
			this.color = color(255, 0, 200);
			this.speedX = 0; 
			this.speedY = 0; 

			console.log('tagged x:' + this.x + ', y: ' + this.y);

			sendTags({
				'x': this.x,
				'y': this.y,
				'color': this.color		
			}); 

		} // end of if statement
  	
	} // end tagged method

}// end of pin object

// referenced for object help: The Coding Train

function sendTags(message) {
	console.log("sending tags to the server");
	//this sends the tagged pin's x and y coordinates
	socket.emit('tagged', message);
} 

