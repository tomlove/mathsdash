"use strict";


var state = null;

var resetState = function () {
	state = {
		countdown: 0,
		onQ: 0,
		questions: null,
		answer: null,
		questionText: '',
		timeQstart: 0,
		timeStart: 0,
		times: [],
		responses: [],
		input: '',
		inputActive: false,
		
		numCorrect: 0,
		numIncorrect: 0,
		numSeconds: 0
	};
}

var showQuestion = function (question) {
	var operatorMap = {
		'+': '+',
		'-': '−',
		'*': '×',
		'/': '÷'
	}
	
	var nbsp = ' ';
	var equals = '=';
	
	var operator = question[0];
	var p1 = question[1];
	var p2 = question[2];
	
	var operatorName = '';
	
	var ans = null;
	switch (operator) {
		case '+':
			ans = p1 + p2;
			operatorName = 'plus';
			break;
		case '-': 
			ans = p1 - p2;
			operatorName = 'minus';
			break;
		case '*': 
			ans = p1 * p2;
			operatorName = 'times';
			break;
		case '/': 
			operatorName = 'divideby';
			ans = (p1 / p2)|0;	// Integer division
	}
	
	state.answer = ans;
	
	var qText = p1 + nbsp + operatorMap[operator] + nbsp + p2 + nbsp + equals;
	
	var $p1 = document.createElement("div");
	var $operator = document.createElement("div");
	var $p2 = document.createElement("div");
	var $eq = document.createElement("div");
	var $result = document.createElement("div");
	
	state.questionText = qText;
	
	state.timeQstart = performance.now();
	
	$operator.className = "operator op_"+operatorName;
	
	$operator.textContent = operatorMap[operator];
	$p1.textContent = p1;
	$p2.textContent = p2;
	$eq.textContent = equals;
	
	$question.innerHTML = '';
	$question.appendChild($p1);
	$question.appendChild($operator);
	$question.appendChild($p2);
	$question.appendChild($eq);
	$question.appendChild($result);
	
	state.$result = $result;
	
	$question.className = "";
	
	state.input = '';
	state.inputActive = true;
}


var init = function (gameconf) {
	state.roundID = gameconf['round_id']*1;
	state.questions = gameconf['questions'];
	state.timeLimit = gameconf['timelimit']*1;	// Seconds
	state.level = gameconf['level'];
	state.name = gameconf['name'];
	
	state.inputActive = true;
	
	document.getElementById("userName").textContent = state.name || '';

	//document.getElementById("gameIntro").textContent = "Level "+state.level + ". Time: "+state.timeLimit+" seconds.";
	//document.getElementById("gameIntro").style.display = "block";
	
	if ($kbd) {
		$question.textContent = "Tap Go to start";
	}
	else {
		$question.textContent = "Press enter to start";
	}
}

var initError = function (err) {
	$question.textContent = err;
}

var initLoad = function (err) {
	$question.textContent = "Loading...";
}

var start = function () {
	state.inputActive = false;
	
	document.getElementById("gameIntro").style.display = "none";
	
	var t = state.countdown;
	
	if (t < 1) {
		state.timeStart = performance.now();
		next();
		return;
	}
	
	state.countdown--;
	
	var o = t + "...";
	
	if (t === 2) {
		o = "Ready?";
	}
	if (t === 1) {
		o = "Go!";
	}
	
	$question.textContent = o;
	
	window.setTimeout(start, 1000);
}

var next = function () {
	
	if (state.numSeconds >= state.timeLimit) {
		end();
		return;
	}

	if (state.onQ > state.questions.length-1) {
		end();
		return;
	}
	
	showQuestion(state.questions[state.onQ]);
	
	state.onQ++;
	
	updateProgress();
}


	var numFW = 0;
	var doFireworks = function () {
		return false;
		
		console.log(numFW, cw, ch);
		fireworks.push( new Firework( cw / 2, ch, random( 0, cw ), random( 0, ch / 2 ) ) );
		numFW++;
		
		if (numFW < 40) {
			for (var i = 0; i < Math.sin(Math.PI*numFW/40) * 4; i++) {
				var d = random(1000, 5000);
				window.setTimeout(doFireworks, d);
			}
		}
		if (numFW == 1) {
			loop();
		}
	}

var end = function () {
	state.timeEnd = performance.now();
	
	document.body.classList.add("EndStage");
	
	var accuracy = state.numCorrect / (state.numCorrect + state.numIncorrect);
	var secPerQ = state.numCorrect > 0 ? (state.numSeconds / state.numCorrect) : Infinity;
	
	var accMsg = "";
	var stars = 0;
	var rateMsg = "";
	var animal = "";

	
	accMsg = "Try again!";
	
	if (accuracy >= 0.7) {
		stars = 1;
		accMsg = "Well done!";
	}
	if (accuracy >= 0.8) {
		if (secPerQ < 6) {
			stars = 2;
		}
	}
	
	if (accuracy >= 0.9) {
		accMsg = "Good job!";
	}
	
	if (accuracy === 1) {
		if (secPerQ < 20) {
			accMsg = "Excellent!";
			stars = 2;
		}
	}


	rateMsg = "";
	animal = "tortoise";
	
	if (accuracy < 0.7) {
		if (secPerQ < 5) {
			rateMsg = "Try going slower.";
		}
		
	} 
	else {
		if (secPerQ < 10) {
			rateMsg = "Keep it up.";
		}
		
		if (secPerQ < 6) {
			rateMsg = "Good speed.";
			if (accuracy >= 0.9) {
				stars = 3;
			}
		}
		
		if (secPerQ < 4) {
			if (accuracy >= 0.8) {
				stars = 3;
			}
			rateMsg = "Great speed.";
			animal = "giraffe";
		}

		if (secPerQ < 2) {
			if (accuracy === 1) {
				stars = 4;
			}
			animal = "leopard";
			rateMsg = "Super fast!";
		}
		
		if (secPerQ < 1.5) {
			rateMsg = "Amazing speed!";
		}
		
		if (secPerQ < 1.3 && accuracy >= 0.95) {
			accMsg = "";
			rateMsg = "Awesome!";
		}
		
		if (secPerQ < 1 && accuracy === 1) {
			accMsg = "";
			rateMsg = "Wow!";
			doFireworks();
			loop();
		}

	}
	
	console.log(secPerQ);
	
	var animalHTML = '<div class="circle '+animal+'"><img src="images/'+animal+'.png"></div>';
	
	var $starfield = document.createElement("div");
	$starfield.className = "starfield";
	
	for (var i = 1; i <= 4; i++) {
		(function (i) {

			var $star = document.createElement("img");
			$star.src = "images/star.png";
			$star.className = "";
			
			window.setTimeout(function () {
				$star.className = (stars >= i ? "Awarded" : "NotAwarded");
			}, 500 + 300*(i-1));
			
			$starfield.appendChild($star);
		}(i));
	}

	
	document.getElementById("results").innerHTML = animalHTML + ' <div id="starTemp"></div> ' + accMsg + " " + rateMsg;

	document.getElementById("starTemp").appendChild($starfield);

	
	document.getElementById("btnBack").onclick = function () {
		document.body.classList.remove("EndStage");
		resetAndStart('retry');
	}
	document.getElementById("btnNext").onclick = function () {
		document.body.classList.remove("EndStage");
		resetAndStart('next');
	}
	
	
	var sendObj = {
		accMsg: accMsg, 
		rateMsg: rateMsg,
		stars: stars,
		animal: animal,
		state: state
	}
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/mathsdash/api.php?x=submit");
	xhr.onreadystatechange = function (r) {

		if (xhr.status !== 200) {
			return;
		}
	}
	xhr.send(JSON.stringify(sendObj));

	//var correct = state.times.length - state.responses.reduce(function (a, v) {return a + (v !== null ? 1 : 0)}, 0);
	// Fastest: Math.round(state.times.reduce(function (a, v, i) { return (v < a && state.responses[i] === null) ? v : a}, Infinity))/1000

	var formatQuestion = function (qspec) {
		var operatorMap = {
			'+': '+',
			'-': '−',
			'*': '×',
			'/': '÷'
		}
		
		return qspec[1] + ' ' + operatorMap[qspec[0]] + ' ' + qspec[2];
	}
	
	var tableHTML = ['<table style="opacity: 0.5; min-width: 80vmin; text-align: right; margin-top: 5vh; user-select: text;">']
	tableHTML.push("<tr><th>Q</th><th>Question</th><th>Time</th><th>Response</th></tr>");
	
	state.questions.forEach(function (v, i) {
		if (!state.times[i]) {
			// Question not asked. 
			return;
		}
		tableHTML.push("<tr><td>", (i+1), "</td><td>", formatQuestion(v), "</td><td>", Math.round(state.times[i])/1000, "</td><td>", state.responses[i], "</td></tr>");
	});
	
	var gameTime = Math.round(state.timeEnd - state.timeStart)/1000
	var qTime = Math.round(state.times.reduce(function (a, v) { return a + v }, 0))/1000;
	
	
	console.log('Game time', gameTime);
	console.log('Q time', qTime);
	
	
	//document.getElementById("details").innerHTML = tableHTML.join('')
	//	+ '<br>Game time: '+ gameTime
	//	+ '<br>Q time: ' + qTime;
	

}

var updateStatus = function () {
	document.getElementById("result_correct").textContent = state.numCorrect+" correct";
	//document.getElementById("result_time").textContent = state.timeLimit;
	document.getElementById("result_accuracy").textContent = (state.numCorrect+state.numIncorrect > 0 ? Math.round((state.numCorrect/(state.numCorrect+state.numIncorrect))*100) : '-') + " %";
	document.getElementById("result_speed").textContent = (state.numSeconds > 0 ? (Math.round((state.numCorrect/state.numSeconds)*600)/10) : '-') + " Q/min";
}

var $question = document.getElementById("questionArea");

window.onkeydown = function (e) {
	//console.log(e);
	
	console.log(state.inputActive, e.key);
	
	if (!state.inputActive) {
		return;
	}
	
	var key = e.key || String.fromCharCode(e.keyCode);
	
	var isSubmit = false;
	
	if (e.key == ' ' || e.key == 'Enter' || e.keyCode == 13 || e.keyCode == 32) {
		isSubmit = true;
		key = '';
	}
	
	if (e.key == 'Delete' || e.keyCode == 46) {
		key = '';
		state.input = '';
	}
	
	if (e.key == 'Backspace' || e.keyCode == 8) {
		key = '';
		state.input = state.input.substring(0, state.input.length-1);
	}
	
	if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ''].indexOf(key) < 0) {
		return;
	}
	
	var val = state.input + key;
	
	state.input = val;
	
//	if (val.length === (""+state.answer).length) {
//		isSubmit = true;
//	}

	if (state.$result) {
		state.$result.textContent = val;
	}

	if (!isSubmit) {
		return;
	}

	if (!state.timeStart) {
		start();
		return;
	}
	
	if (isSubmit && !state.input.length) {
		// Nothing if no input. Must at least attempt.
		return;
	}

	var time = performance.now() - state.timeQstart;
	state.times.push(time);
	
	state.numSeconds += time/1000;

	if (parseInt(val) === state.answer) {
		state.responses.push(null);
		$question.className = "Correct";
		
		state.numCorrect++;
		updateStatus();
		
		// TODO: use state to avoid interference from more inputs.
		state.input = '';
		state.inputActive = false;
		window.setTimeout(next, WAIT_CORRECT);
		
		return;
	}

	state.responses.push(val);
	$question.className = "Incorrect";
	
	state.numIncorrect++;
	updateStatus();
	
	// TODO: Persist wrong answer in view? With right answer? 
	
	state.input = '';
	state.inputActive = false;
	window.setTimeout(next, WAIT_INCORRECT);
}


if ('ontouchstart' in window) {
	var $kbd = document.getElementById("keyboard");

	document.body.classList.add("VirtualKbd");
	
	$kbd.ontouchstart = function (e) {
		var key = e.srcElement.innerText;
		
		if (key == '<') {
			key = 'Backspace';
		}
		if (key == 'Go') {
			key = 'Enter';
		}
		
		window.onkeydown({
			key: key
		});
		
		e.preventDefault();
	}
}


var $prog = document.querySelector("#progressBar > div");

var updateProgress = function () {
	var time = state.times.length ? state.times.reduce(function (a, v) { return a + v }, 0)/1000 : 0;
	
	// TODO: Can add time expired on current question as well.
	//time += (performance.now() - state.timeQstart)/1000;
	
	console.log(time);
	
	var gameProgress = (time)/(state.timeLimit);
	
	//$prog.style.width = 100 - Math.min(100, gameProgress * 100) + "%";
	$prog.style.width = (gameProgress * 100) + "%";
	
	
	if (gameProgress > 0.8) {
		$prog.className = "end";
	}
	else if (gameProgress > 0.5) {
		$prog.className = "mid";
	}
};


var WAIT_CORRECT	= 150;
var WAIT_INCORRECT	= 500;
var COUNTDOWN_SEC	= 0;

var resetAndStart = function (intent) {
	
	var lastRoundID = (state ? state.roundID : 0) || 0;
	
	resetState();
	updateStatus();
	
	$prog.style.width = "0";
	
	state.countdown = COUNTDOWN_SEC;
	state.qstring = (document.location.search && document.location.search.substring(1)) || '';
	
	initLoad();
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/mathsdash/api.php?x=qtest&q="+encodeURIComponent(state.qstring)+"&round_id="+lastRoundID+"&intent="+(intent||''));
	xhr.onreadystatechange = function (r) {
		
		if (xhr.readyState !== 4) {
			return;
		}
		
		if (xhr.status !== 200) {
			initError("Error :(");
			return;
		}

		init(JSON.parse(xhr.responseText));
	}
	xhr.send();
	
	//	history.pushState(
}

resetAndStart();

/* DEMO
window.setTimeout(function () {
	init([['*', 1, 1], ['*', 1, 2], ['*', 1, 3], ['*', 1, 4], ['*', 1, 5]]);
}, 300);
*/
