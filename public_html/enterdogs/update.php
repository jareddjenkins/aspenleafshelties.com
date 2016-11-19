<?php include "auth.php"; ?> 
<?php include "inc/data.php"; ?>
<?php

$id = $_POST['id'];
$rname = $_POST['rname'];	
$cname = $_POST['cname'];
$comments = $_POST['comments'];
$dob = $_POST['dob'];
$gender = $_POST['gender'];
$sire_id = $_POST['sire_id'];
$dam_id = $_POST['dam_id'];
$available = $_POST['available'];
$display = $_POST['display'];


if ($gender == "male"){
    $gender = 1;
}
else{
	$gender = 0;
}

if (isset($_POST['available']))
	{
	$available = 1;
	}
else 
	{
	$available = 0;
	}
if (isset($_POST['display']))
	{
	$display = 1;
	}
else 
	{
	$display = 0;
	}


update_dog_db($Connection,$id,$rname,$cname,$comments,$available,$display,$dob,$sire_id,$gender,$dam_id);
?>
<META HTTP-EQUIV=Refresh CONTENT="1; URL='index.php'">
Updated!