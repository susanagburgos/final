// motion and orientation variables are global
// var alpha, beta, gamma; //ORIENTATION
// var xmotion, ymotion, zmotion; //MOTION

// I wanted to do a drawing thingy, where user directed the ellipse
// according to the alpha and beta orientation but that didn't work
// created a version of my bubble-tag but mobile

// position values
var x = 0; 
var y = 0; 

// values that I'd like to receive from server
var theX, theY;

// speed - velocity
var vx = 0; 
var vy = 0; 

// acceleration 
var ax = 0; 
var ay = 0; 

var vMultiplier = 0.007; // so we don't get a huge number
var bMultiplier = 0.4; // accounting for the bouncing 

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background('white');
	noStroke();
	fill('green'); 
	// ellipse(x + 30, y + 30, 100);
	ellipse(theX, theY, 100, 100);
}
 
function init() {

	// function for orientation

	function handleOrientation(event){
		/* 
		alpha=Math.floor(event.alpha);
		beta=Math.floor(event.beta);
		gamma=Math.floor(event.gamma);

		// send values to the DOM so that we can see them
		document.getElementById('alpha').innerHTML=alpha;
		document.getElementById('beta').innerHTML=beta;
		document.getElementById('gamma').innerHTML=gamma;

		socket.emit('orientation', {
			'alpha': alpha,
			'beta': beta,
			'gamma':gamma
		});
		*/ 
	}
	// event listener for orientation
	// window.addEventListener('deviceorientation', handleOrientation, true);

	function deviceMotion(event) {
		// returns acceleration of object 
		var acc = event.acceleration;
		var alpha = Math.floor(event.alpha);
		var beta = Math.floor(event.beta);
		var gamma = Math.floor(event.gamma); 

		// accelerates with movement not considering gravity 
		var ax = Math.abs(acc.x);
		var ay = Math.abs(acc.y);
		var az = Math.abs(acc.z);

		vx = vx + ax; 
		vy = vy + ay; 

		// phyics formula for position - so I thought...
		x = x + vx * vMultiplier;
		y = y + vy * vMultiplier ; 

		if (x < 0) { // try to exit screen through left
			x = 0; // reset x 
			vx = -vx * bMultiplier; // changing direction of velocity
		} 
		if (y < 0) {
			y = 0; 
			vy = -vy * bMultiplier; 
		}
		if (x > windowWidth - 30) { // if it goes to the utmost right
			x = windowWidth - 30; 
			vx = -vx + ax * bMultiplier; // beta * vMultiplier; 
		}
		if (y > windowHeight - 30) { // if it goes to the bottom of page -15
			y = windowHeight - 30; 
			vy = -vy + ay * bMultiplier; // alpha * vMultiplier; 
		}
	
		document.getElementById('xmov').innerHTML = Math.floor(vx);
		document.getElementById('ymov').innerHTML = Math.floor(vy);
		document.getElementById('zmov').innerHTML = Math.floor(alpha); 

		socket.emit('motion', {
			'x': x,
			'y': y
		});

	} // end of deviceMotion

	window.addEventListener('devicemotion', deviceMotion, true);

	// when we touch we want velocity to change to 0
	function touchStarted(event) {
			
			vx = 0; 
			vy = 0; 
			ax = 0; 
			ay = 0;

		console.log('touched');
		return false;
	} // end of touch 
} // end of init

window.addEventListener('load', init);