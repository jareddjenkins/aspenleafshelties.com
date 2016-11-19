<?php 
include (dirname(__FILE__).'/inc/views.php');
include (dirname(__FILE__).'/enterheader.html'); ?>

<body>
	<img style="display: block;   margin-left: auto;   margin-right: auto;" src="../images/aspenleafshelties.png" alt="ASPEN LEAF SHELTIES"/></td>
<div id="content">

<form name="test" onsubmit="add_dog_form(this.value)">
<input type="submit" name="adddog"value="1" />
</form>
<br />
<div id="txtHint"><b>Person info will be listed here.</b></div>
</div>

<?php include (dirname(__FILE__)."/footer.html");?>
