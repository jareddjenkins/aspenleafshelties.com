<?php require "auth.php";

$id = $_POST['id'];

include (dirname(__FILE__).'/inc/views.php');
include (dirname(__FILE__).'/enterheader.html'); 
$id = $_POST['id'];
?>
<?php

delete_dog_db($Connection,$id);
?>
Done
=<META HTTP-EQUIV=Refresh CONTENT="1; URL='index.php'">';