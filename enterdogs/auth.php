<?php

session_start();
if($_SESSION["LoggedIn"]!=1 or !isset($_SESSION["LoggedIn"])) 
header("Location: index.php");

?>