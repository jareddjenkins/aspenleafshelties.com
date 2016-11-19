<?php 
include (dirname(dirname(__FILE__)).'/inc/views.php');
include (dirname(__FILE__).'/enterheader.html'); ?>

<body>
<div id="maintb">
	<img  src="../images/aspenleafshelties.png" alt="ASPEN LEAF SHELTIES"/></td>

<div id="content">
	<div class="listingtb">

		<? edit_table($Dog_array); ?>
		
	</div>
</div>
</div>
<?php include (dirname(dirname(__FILE__))."/footer.html");?>