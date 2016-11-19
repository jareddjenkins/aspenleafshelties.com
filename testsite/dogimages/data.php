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

function create_dog ($id){
	$Connection = createconnection();
	$sth = $Connection->prepare("SELECT dogs.id,dogs.rname,dogs.cname,dogs.comments,dogs.dob,dogs.gender,pedigreeinfo.sire_id,pedigreeinfo.dam_id FROM dogs JOIN pedigreeinfo ON dogs.id = pedigreeinfo.dogs_id WHERE dogs.id = :id");
	$sth->bindValue('id', $id);
	$sth->setFetchMode( PDO::FETCH_CLASS, 'Dog');
	$sth->execute();
	return $sth->fetch( PDO::FETCH_CLASS );
}

function create_dog_array($Connection){
	$Connection = createconnection();
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

function ped_tree($id) {
	//Tree to determine where we are at in the pedigree chart. The tree will trail behind the array
	$ped_tree[1] = $id;
	$Dog = create_dog ($id);
	//set first dog rname
	$ped_array[1] = $Dog->get_rname();
	
	for ($i = 2; $i <= 31; $i++) {
		//divide by two and round down
		$child_loc = (((int)($i / 2)));
		//get the id of child		
		$child_id = $ped_tree[$child_loc];
		//make sure we've obtained an actual dog for this part of the tree
		if ($ped_tree[$child_loc]){
			//male is always an odd number in location
			$Dog = create_dog ($child_id);
			if ($i & 1) {
				if ($Dog->get_dam_id()) {
					$ped_tree[$i] = $Dog->get_dam_id();
					$Dam = create_dog ($ped_tree[$i]);
					$ped_array[$i] = $Dam->get_rname();
				}
			} else {
				if ($Dog->get_sire_id()){
					$ped_tree[$i] = $Dog->get_sire_id();
					$Sire = create_dog ($ped_tree[$i]);
					$ped_array[$i] = $Sire->get_rname();
				}
			}
		}
	}

	return $ped_array;
}