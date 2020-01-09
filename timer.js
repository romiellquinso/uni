function Timer(elem) {

	var time = 0;
	var interval;
	var offset;

	//updates the timer view
	function update() {
		time += delta();
		var formattedTime = timeFormatter(time);

		//sends elapsed time to timer display
		elem.textContent = formattedTime;
	};

	//calculates time passed from init
	function delta() {
		var now = Date.now();
		var timePassed = now - offset;
		offset = now;
		return timePassed;
	};

	//formats time so it's readable
	function timeFormatter(timeInMilliseconds) {
		var time = new Date(timeInMilliseconds);
		var minutes = time.getMinutes().toString();
		var seconds = time.getSeconds().toString();
		var milliseconds = time.getMilliseconds().toString();

		if (minutes.length < 2) {
			minutes = '0' + minutes;
		}

		if (seconds.length < 2) {
			seconds = '0' + seconds;
		}

		while (milliseconds.length < 3) {
			milliseconds = '0' + milliseconds;
		}

		return minutes + ' : ' + seconds + ' . ' + milliseconds;
	};



	this.isOn = false;

	//runs when first coordinate is clicked
	this.start = function () {
		if (!this.isOn) { //makes sure it doesnt keep getting initiated after every click
			interval = setInterval(update, 10);
			offset = Date.now();
			this.isOn = true;
		}
	};

	//runs when all ships are sunk
	this.stop = function () {
		if (this.isOn) {
			clearInterval(interval);
			interval = null;
			this.isOn = false;
		}
	};

	//runs when New Game is clicked
	this.reset = function () {
		time = 0;
	};
}

var timer = new Timer(timeDisplay);