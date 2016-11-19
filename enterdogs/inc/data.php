<?php
require_once (dirname(__FILE__).'/classes.php');

function createconnection() {

	try {
		$con = new PDO('mysql:host=localhost;dbname=kdavidso_aspenleaf', 'kdavidso_web', 'IfC8wk6u2)zO');
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	} catch(PDOException $e) {
		echo 'Error: ' . $e->getMessage();
	}
	return $con;
}

$Connection = createconnection();

function create_dog_array($Connection){
	$sth = $Connection->prepare("SELECT * FROM dogs");
	$sth->execute();
	$Returned_array = $sth->fetchAll(PDO::FETCH_CLASS, 'Dog');
	
	foreach($Returned_array as $Value){
		$Indexed_array[$Value->get_id()] = $Value;
		}
	return $Indexed_array;
}

		function find_sire($Dog) {

		if ($Dog->get_sire_id) {
			return $Dog->get_sir_id;
		}
}


function authenticate($Connection,$username,$password){
	try {
		//$password = md5($password);
		$stmt = $Connection->prepare("SELECT * FROM users WHERE Username = :username AND Password = :password");
		$stmt->execute(array('username' => $username,'password' => $password));
		$result = $stmt->fetchAll();
		
		if ( count($result) ) {
			foreach($result as $row) {
			    $_SESSION['Username'] = $username;
				$_SESSION['LoggedIn'] = 1;
			}
		} else {
			$checklogin = FALSE;
		}
	} catch(PDOException $e) {
		echo 'ERROR: ' . $e->getMessage();
	}

}

function add_dog_db($Connection){
    $Connection->query("INSERT INTO dogs (id) VALUES('')");
}
function delete_dog_db($Connection,$id){
    $Connection->exec("DELETE FROM dogs WHERE id = '$id'");
}
function update_dog_db($Connection,$id,$rname,$cname,$comments,$available,$display,$dob,$sire_id,$gender,$dam_id){
try {
	$stmt = $Connection->prepare("UPDATE dogs SET rname = :rname, cname = :cname, comments = :comments,  available = :available,display = :display,dob = :dob,gender = :gender, sire_id = :sire_id, dam_id = :dam_id WHERE id = :id");
	
	$params = array(
	':id' => $id,
    ':rname' => $rname,
    ':cname' => $cname,
	':comments' => $comments,
    ':available' => $available,
    ':display' => $display,
    ':dob' => $dob,
    ':gender' => $gender,
    ':sire_id' => $sire_id,
	':dam_id' => $dam_id
	);
	var_dump($params);
	$stmt->execute($params);
	} catch(PDOException $e) {
  echo 'Error: ' . $e->getMessage();
}
}
//mysql_query("");


/// change id to dog_array index making referencing it easier



/*

	$ped_array[0] = 1;
	
	for ($i = 0; $i <= 31; $i++) {
		$ped_array[$i] = (((int)($i / 2)));
		echo $i . " " . $ped_array[$i] . " " ;		
		
		if ($i & 1) {
			$ped_array[$i] = (((int)($i / 2)));
			echo "dam <br />" ;
		} else {
			$ped_array[$i] = (((int)($i / 2)));
			echo "sire <br />";
		}


	}
*/



?>