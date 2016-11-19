<?php
include (dirname(__FILE__).'/inc/views.php');

$Dog_array = create_dog_array($Connection);
$default_id=$_POST['id'];
$name=$_POST['id'];
echo $default_id;
echo $name;
echo "<form>
<select>";

drop_menu($Dog_array,$default_id);
echo "</select></form>";

echo "<div jquery></div>";
?>