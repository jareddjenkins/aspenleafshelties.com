<?php

function createlistingrow($id,$rname,$cname,$dob,$sire,$dam){
?>
<td><a target="_blank" href="<?php echo "dogimages/large" . $$id .".jpg"; ?>" rel="lightbox"><img src="<?php echo "dogimages/thumb" . $id .".jpg"; ?>" alt="<?php echo $cname?>" width="166" height="125" /></a></td>
<?php
	echo "<tr><td>" . $rname . "<br/>";
	echo "<td>" . $cname . "<br/>";
	echo "<td>DOB: " . $dob . "<br/>";
	echo "<td>""Sire: " . $sire . "<br/>";
	echo "<td>""Dam: " . $dam . "</td>";
	echo "<td>""Dam: " . $dam . "</td>";
	echo "<td>""Dam: " . $dam . "</td></tr>";
}

?>
