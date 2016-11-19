<?php require "auth.php";

include (dirname(__FILE__).'/inc/views.php');
include (dirname(__FILE__).'/enterheader.html'); 
$id = $_POST['id'];
?>
<body>
	<img style="display: block;   margin-left: auto;   margin-right: auto;" src="images/aspenleafshelties.png" alt="ASPEN LEAF SHELTIES"/></td>
<div id="content">
	<div  class="listingtb" >
		<table  >
		<? edit_table($Dog_array,$id); ?>
		</table>
	</div>
</div>

<?php include (dirname(__FILE__)."/footer.html");?>