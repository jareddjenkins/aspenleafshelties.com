<?php include "inc/views.php"; ?>
<?php include "header.html";?>
<body>
<div id="maintb">
	<img  src="images/aspenleafshelties.png" alt="ASPEN LEAF SHELTIES"/></td>
	<?php include "navbar.html";?>
<div id="content">
 
	<p>If you are interested in obtaining an available puppy, please fill out the <a href="/files/AspenLeafQuestionnaire.doc" > Aspen Leaf Questionnaire </a>
	and send it to me in an email at <a href="mailto:aspenleafshelties@gmail.com">aspenleafshelties@gmail.com</a>

<? list_table($Dog_array,'get_available',1)?>

</div>
</div>
<?php include "footer.html";?>