<?php
include_once (dirname(__FILE__).'/inc/views.php');
include_once (dirname(__FILE__).'/header.html'); 

$id = $_GET["id"];

$ped_name = ped_tree($Dog_array,$id);
pedigree_table($ped_name);