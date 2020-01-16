//for the game's state
var totalguesses = 0;
var g = false;
Boolean(g);



//for the timer
var timeDisplay = document.getElementById('display');
var toggleBtn = document.getElementsByClassName('buttons');
var restart = document.getElementById('restart');


for (var i = 0 ; i < toggleBtn.length; i++) {
	toggleBtn[i].addEventListener('click', startTimer);
}

restart.addEventListener('click', reset);

function startTimer(){
	timer.start();
	if (g === true){
		timer.stop();
	}
}

function reset(){
	//console.log(g);
	if (!timer.isOn){
		timer.reset();
	}
	location.reload();
}


var model = {

	//  Setting up the board
	boardSize: 6,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function (guess) {
		'use strict';

		//Determines coordinate status
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			if (ship.hits[index] === "hit") {
				view.displayMessage("Coordinate already hit. Choose another!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("IT'S A HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank a battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Negative Impact")
		return false;
	},

	isSunk: function (ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function () {
		var locations;

		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip()

				//output ship positions for debugging
				//console.log("Ships array:");

			} while (this.collision(locations));

			//Output ship locations
			//console.log(locations)

			this.ships[i].locations = locations;
		};
	},

	generateShip: function () { /*randomly generates ships*/
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else {
			col = Math.floor(Math.random() * this.boardSize);
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i)); /*horizontal ship*/
			} else {
				newShipLocations.push((row + i) + "" + col); /*vertical ship*/
			}
		}
		return newShipLocations;
	},

	collision: function (locations) { /*To make sure ships do not overlap*/
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var x = 0; x < locations.length; x++) {
				if (ship.locations.indexOf(locations[x]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};

var view = {
	displayMessage: function (msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

var controller = {
	guesses: 0,

	//  Outputs message that all ships are sunk when number of ships equals number of ships sunk    
	processGuess: function (guess) {
		var location = parseGuess(guess)
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all the enemy ships in the area! It took " + this.guesses + " guesses!");

				g = true;
				totalguesses = this.guesses;
			}
		}
	}
};

//Validation
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F"];

	if (guess === null || guess.length !== 2) {
		alert("Please enter a valid guess. Must be a letter and number")
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var col = guess.charAt(1);

		if (isNaN(row) || isNaN(col)) {
			alert("Not a valid input.")
		} else if (row < 0 || row >= model.boardSize || col < 0 || col >= model.boardSize) {
			alert("Input is not located on this board");
		} else {
			return row + col;
		}
		return null;
	}

	return row + col;
}

function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();

	getScores1();
}

//when game ends, prompt name
function promptName() {
	var txt;
	var player = prompt("Please enter your name:", "Ron");
	if (player == null || player == "") {
		player = "unknown player";
	} else {
		txt = "Congratulations, " + player + "! You won!";
	}
	document.getElementById("messageArea").innerHTML = txt;
}

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);
	//console.log(guess);

	guessInput.value = "";


	if (g === true){
		for (var i = 0 ; i < toggleBtn.length; i++) {
			toggleBtn[i].disabled = true;
		}
		console.log('input disabled');
		promptName();
		testScore(); // submits username and score
		getScores(); // updates leaderboards
		testScore(); // test
	}
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	//e = e || window.event;

	if (e.keycode === 13) {
		fireButton.click();
		return false;
	}
}


function btnClick1(guess) {
	'use strict';

	var guessInput = document.getElementById("guessInput");
	var guessString = guess;
	var guessCode = guessString.substr(3);
	guessInput.value = guessCode;

	document.getElementById("fireButton").click();
}

window.onload = init;


