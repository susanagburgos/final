var pins = []; // array of objects
var img;  


function preload() { // loading images, soudns and data files
	img = loadImage('pin0.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
}

function draw() {
  
  for(var i = 0; i < pins.length; i++) {
  	pins[i].draw(); // calling on methods for this object
  	// pins[i].update();
  }
  
}

function windowResize() {
	resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
	//var newObj = new Pin(mouseX, mouseY); 
	console.log('mouse down function');
	pins.push(new Pin(mouseX, mouseY)); // pushing new object to our array 
}

// how to double click - check wheter we have a a bubble already there 

/* function mousePressed() {
 	for(var i = 0; i < bubbles.length; i++) {
 		if(bubbles[i].poke()) {
 			// deletes one element at position i
 			bubbles.splice(i, 1); 
 		}
 	}
 } */ 

//Creating pin object
function Pin(x, y) {
	//constructor: defining properties of objects
	this.x = x; 
	this.y = y; 

	this.draw = function() {
		image(img, this.x, this.y); // printing image at position of the mouse
	}

	/* this.poke = function() {

	 //this.update = function() {
		if( mouseX > (this.x - this.size/2) && 
	 		mouseX < (this.x + this.size/2) &&
	 		mouseY > (this.y - this.size/2) &&
	 		mouseY < (this.y + this.size/2) ) {
	 		return true; 
	 	} else {
	 		return false; 
	 	}
	} */ 
}

