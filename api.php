<?php

function question_gen ($level) {
	$questions = array();
	
	$operators = array('+');
	$erand_max = 9;
	$erand_min = 1;
	$erand_sub_min = 7;			// Prevents too many [4 - 4] and [3 - 1], since no support for negative results. 
	$div_max_numerator = 144;
	$skiptrivial = false;
	$skipcommutativedups = false;
	$max_questions = 30;
	//$time_limit = 30;
	
	switch ($level) {
		default: 
			break;
		case 2: 
			$erand_max = 15;
			break;
		case 3: 
			$operators = array('+', '-');
			$erand_max = 20;
			break;
		case 4: 
			$operators = array('+', '-');
			$erand_max = 25;
			break;
		case 5: 
			$operators = array('*');
			break;
		case 6: 
			$operators = array('+', '-', '*');
			$erand_max = 30;
			$erand_sub_min = 10;
			$skipcommutativedups = true;
			break;
		case 7:
			$operators = array('-');
			$erand_max = 50;
			$erand_min = 5;
			$erand_sub_min = 9;
			$skiptrivial = true;
			break;
		case 8:
			$operators = array('/');	// Easier than 7. Perhaps okay though for new operator. 
			$div_max_numerator = 36;
			$skipcommutativedups = true;
			$skiptrivial = true;
			break;
		case 9: 
			$operators = array('+', '-', '*', '/');
			$div_max_numerator = 84;
			$erand_max = 20;
			$erand_min = 7;
			$erand_sub_min = 13;
			$skipcommutativedups = true;
			$skiptrivial = true;
			break;
		case 10: 
			$operators = array('+', '-', '*', '/');		// Super hard!
			$div_max_numerator = 144;
			$erand_max = 50;
			$erand_min = 7;
			$erand_sub_min = 29;
			$skipcommutativedups = true;
			$skiptrivial = true;
			break;
	}
	
	/* Configure question definition something like this... 
	each operator has rules, allowing difficulty balance e.g. [15 + 18] may be equivalent to [104 - 14], while [117 + 109] would be harder. 
	$qdef = array(
		'+' => array(
			'op_min' => 0,
			'op_max' => 50,
			'r_min' => 1,
			'r_max' => 100
		),
		'-' => array(
			'op_min' => 0,
			'op_max' => 50,
			'r_min' => 0,
			'r_max' => 20,
			'r_sig' => 2
		)
	);
	*/
	
	$max_tries = 1000;
	
	$divisors = json_decode('{"4":[2],"6":[2,3],"8":[2,4],"9":[3],"10":[2,5],"12":[2,3,4,6],"14":[2,7],"15":[3,5],"16":[2,4,8],"18":[2,3,6,9],"20":[2,4,5,10],"21":[3,7],"22":[2,11],"24":[2,3,4,6,8,12],"25":[5],"26":[2,13],"27":[3,9],"28":[2,4,7,14],"30":[2,3,5,6,10,15],"32":[2,4,8,16],"33":[3,11],"34":[2,17],"35":[5,7],"36":[2,3,4,6,9,12,18],"38":[2,19],"39":[3,13],"40":[2,4,5,8,10,20],"42":[2,3,6,7,14,21],"44":[2,4,11,22],"45":[3,5,9,15],"46":[2,23],"48":[2,3,4,6,8,12,16,24],"49":[7],"50":[2,5,10,25],"51":[3,17],"52":[2,4,13,26],"54":[2,3,6,9,18,27],"55":[5,11],"56":[2,4,7,8,14,28],"57":[3,19],"58":[2,29],"60":[2,3,4,5,6,10,12,15,20,30],"62":[2,31],"63":[3,7,9,21],"64":[2,4,8,16,32],"65":[5,13],"66":[2,3,6,11,22,33],"68":[2,4,17,34],"69":[3,23],"70":[2,5,7,10,14,35],"72":[2,3,4,6,8,9,12,18,24,36],"74":[2,37],"75":[3,5,15,25],"76":[2,4,19,38],"77":[7,11],"78":[2,3,6,13,26,39],"80":[2,4,5,8,10,16,20,40],"81":[3,9,27],"82":[2,41],"84":[2,3,4,6,7,12,14,21,28,42],"85":[5,17],"86":[2,43],"87":[3,29],"88":[2,4,8,11,22,44],"90":[2,3,5,6,9,10,15,18,30,45],"91":[7,13],"92":[2,4,23,46],"93":[3,31],"94":[2,47],"95":[5,19],"96":[2,3,4,6,8,12,16,24,32,48],"98":[2,7,14,49],"99":[3,9,11,33],"100":[2,4,5,10,20,25,50],"102":[2,3,6,17,34,51],"104":[2,4,8,13,26,52],"105":[3,5,7,15,21,35],"106":[2,53],"108":[2,3,4,6,9,12,18,27,36,54],"110":[2,5,10,11,22,55],"111":[3,37],"112":[2,4,7,8,14,16,28,56],"114":[2,3,6,19,38,57],"115":[5,23],"116":[2,4,29,58],"117":[3,9,13,39],"118":[2,59],"119":[7,17],"120":[2,3,4,5,6,8,10,12,15,20,24,30,40,60],"121":[11],"122":[2,61],"123":[3,41],"124":[2,4,31,62],"125":[5,25],"126":[2,3,6,7,9,14,18,21,42,63],"128":[2,4,8,16,32,64],"129":[3,43],"130":[2,5,10,13,26,65],"132":[2,3,4,6,11,12,22,33,44,66],"133":[7,19],"134":[2,67],"135":[3,5,9,15,27,45],"136":[2,4,8,17,34,68],"138":[2,3,6,23,46,69],"140":[2,4,5,7,10,14,20,28,35,70],"141":[3,47],"142":[2,71],"143":[11,13],"144":[2,3,4,6,8,9,12,16,18,24,36,48,72]}');
	
	// TODO: 
	//  - Don't allow "0 divided by 0"
	//  - ?? Avoid repeating answer, e.g. "5 - 2 = 3", "10 - 7 = 3"
	
	for ($i = 0; $i < $max_questions; $i++) {
		
		$op = $operators[mt_rand(0, count($operators)-1)];
		
		$tries = 0;
		
		do {
			$erand1 = mt_rand($erand_min, $erand_max);
			
			$r = null;
			
			if ($op === '+') {
				$erand2 = mt_rand($erand_min, $erand_max);
				$r = $erand1 + $erand2;
			}
			if ($op === '-') {
				$erand1 = mt_rand($erand_sub_min, $erand_max);
				$erand2 = mt_rand($erand_min, $erand1);
				$r = $erand1 - $erand2;
			}
			if ($op === '*') {
				$erand1 = mt_rand(0, 12);
				$erand2 = mt_rand(0, 12);
				$r = $erand1 * $erand2;
			}
			if ($op === '/') {
				// Division has to have a larger range to avoid trivial questions resulting 
				// from the small number of divisors / large number of primes in the small operands. 
				$erand1 = mt_rand(0, $div_max_numerator);
				$divs = $divisors->$erand1;
				
				if (!$divs) {
					// Prime.
					$divs = array();
				}
				
				// Add the two universal divisors. 
				// Note if $erand1 is zero, then only 0/1 is possible.
				$divs[] = 1; 
				$divs[] = ($erand1 > 0 ? $erand1 : 1);
					
				$erand2 = $divs[mt_rand(0, count($divs)-1)];
				
				$r = $erand1 / $erand2;
			}
			
			// Skip "trivial" questions ([0 * 5], [5 + 0]) 
			// TODO: May want to allow these for - and + operators.
			
			if ($skiptrivial && $r === 0 || $r === 1 || $r === $erand1 || $r === $erand2) {
				continue;
			}
			
			
			// Skip simple duplicates (operators in same position); *not* commutative duplicates (e.g. 5 + 4, 4 + 5)
			$havedup = false;
			for ($j = 0; $j < $i; $j++) {
				$q = $questions[$j];
				
				if ($q[0] === $op && $q[1] === $erand1 && $q[2] === $erand2) {
					$havedup = true;
					break;
				}
			}
			
			if ($havedup) {
				continue;
			}
			
			// Skip direct repeats of swapped operands for commutative operators. 
			// i.e. "duplicates" can exist, just not together. 
			if ($skipcommutativedups && $i > 0 && ($op === '*' || $op === '+') && $questions[$i-1][0] === $op && $questions[$i-1][1] === $erand2 && $questions[$i-1][2] === $erand1) {
				continue;
			}
			
			break;
			
		} while ($tries++ < $max_tries);
		
		$questions[] = array($op, $erand1, $erand2);
		
		if ($tries > $max_tries) {
			// Hit limit - questions are probably degenerate after this point. 
			// e.g. asking for 500 division questions (there are only ~446 unique up to operand 12)
			// Small probability exists of hitting this normally, causing truncated question list. 
			// TOFIX: Reduce probability to infinitesimal by allow multiple limit hits... or just permit degeneracy. 
			//echo "HIT LIMIT at $i\n";
			//break;
		}
	}
	
	return $questions;
	
}

$dbh = mysqli_connect('localhost', 'mathsdash', $_ENV['db_pword'], 'mathsdash', 0, '/var/run/mysqld/mysqld.sock');


$uid = 0;
$name = '';

$qstr = isset($_GET['q']) ? $_GET['q'] : '';

$get2 = array();
parse_str(urldecode($qstr), $get2);


switch ($_GET['x']) {
	case 'qtest':
		header('Content-Type: application/json');
		
		$intent = isset($_GET['intent']) ? $_GET['intent'] : '';
		$prev_round = isset($_GET['round_id']) ? (int)$_GET['round_id'] : 0;
		
		$level = 1;
		$timelimit = 30;
		
		if ($intent == '') {

		}
		
		if ($intent == 'next') {
			
		}	
	
		$rs = mysqli_query($dbh, 'SELECT name FROM users WHERE id = '.(int)$uid)
			or die (mysqli_error($dbh));

		if (!$rs || !mysqli_num_rows($rs)) {
			$rs = mysqli_query($dbh, 'INSERT INTO users (id, name) VALUES ('.(int)$uid.', "'.mysqli_real_escape_string($dbx, $name).'")')
				or die (mysqli_error($dbh));
		}
		else {
			$r = mysqli_fetch_assoc($rs);
			
			$name = $r['name'];
		}		
		
		mysqli_query($dbh, 'INSERT INTO rounds (user_id, tme_start, level, timelimit) VALUES ('.(int)$uid.', '.time().', '.(int)$level.', '.(int)$timelimit.')')
			or die (mysqli_error($dbh));			
	
		$round_id = mysqli_insert_id($dbh);

		echo json_encode(array('name' => $name, 'level' => $level, 'timelimit' => $timelimit, 'round_id' => $round_id, 'questions' => question_gen($level)));
		
		break;
	case 'submit':
	
		$input = file_get_contents('php://input');
		
		file_put_contents('logs/' . time() . '_' . mt_rand(10000, 99999) . '.txt', $input);

		$obj = json_decode($input);
		
		$round_id = (int)$obj->state->roundID;
		
		$inserts = array();
		for ($i = 0; $i < count($obj->state->times); $i++) {
			
			$operator = substr($obj->state->questions[$i][0], 0, 1);
			
			$inserts[] = '('.(int)$round_id.', '.(int)($i+1).', "'.mysqli_real_escape_string($dbh, $operator).'", '
			.(int)$obj->state->questions[$i][1].', '
			.(int)$obj->state->questions[$i][2].', '
			.(int)$obj->state->times[$i].', '
			.($obj->state->responses[$i] == null ? 'NULL' : (int)$obj->state->responses[$i]).')';

		}
		
		mysqli_query($dbh, 'INSERT INTO qperf (round_id, item, operator, operand1, operand2, ival_answer, answer_wrong) VALUES '.implode(', ', $inserts))
			or die (mysqli_error($dbh));
			
			
		mysqli_query($dbh, 'INSERT INTO results (round_id, tme_submit, ans_correct, ans_total, game_msec, stars, animal, rate_msg, acc_msg) 
			VALUES('.(int)$round_id.', '.(int)time().', '.(int)$obj->state->numCorrect.', '.(int)($obj->state->numIncorrect + $obj->state->numCorrect).', '.(int)($obj->state->numSeconds*1000).', '.(int)$obj->stars.', "'.mysqli_real_escape_string($dbh, $obj->animal).'", "'.mysqli_real_escape_string($dbh, $obj->rateMsg).'", "'.mysqli_real_escape_string($dbh, $obj->accMsg).'")')
			or die (mysqli_error($dbh));
			
			
		header('Status: 200 OK');
		break;
	default: 
		header('Status: 404 Not Found');
		exit();
}

?>