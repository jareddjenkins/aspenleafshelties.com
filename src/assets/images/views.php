<?php
require (dirname(__FILE__).'/data.php');

///////////////////////////////////////////////////////////////////////////////////////////////////

$Dog_array = create_dog_array($con);

function drop_menu($Obj_array,$default_id,$gender = NULL) {
	$options_avail = array();
	$options_not_avail = array();
?>
	<option value="NULL"> -----------  Not Selected  ----------- </option>
<?php
	foreach ($Obj_array as $Dog) {

		
		if ((strcmp($Dog->get_gender(), $gender) === 0)&& ($Dog->get_display() == TRUE)){
				$options_avail[$Dog->get_id()] = $Dog->get_display_name();			
			} elseif ((strcmp($Dog->get_gender(), $gender) === 0)&& ($Dog->get_display()== FALSE)){
				$options_not_avail[$Dog->get_id()] = $Dog->get_display_name();
			}
	}
	foreach ($options_avail as $key => $value){
		echo "<option value=\"". $key . "\"";
			if($key == $default_id) {
				echo " selected";
			}

		echo ">" . $value . "</option>\n";
	}
	
	echo "<optgroup label=\"---------------------\"></optgroup>\n";			
	
	foreach ($options_not_avail as $key => $value){
		echo "<option value=\"". $key . "\"";
			if($key == $default_id) {
				echo " selected";
			}

		echo ">" . $value . "</option>\n";
	}
}

function list_table($Object_array,$filter_collumn,$filter_value) {
?>
<div class="listingtb">
	<table>
	<?php


	foreach ($Object_array as $Dog) {
			
		if (strcmp ($Dog->$filter_collumn(), $filter_value) == 0 && $Dog->get_display() )  {
			?><tr><td>
				<a target="_blank" href="dogimages/large<?php echo $Dog->get_id();?>.jpg" rel="lightbox[list]">
				<img src="dogimages/thumb<?php echo $Dog->get_id();?>.jpg" alt="<?php echo $Dog->get_cname();?>" width="166" height="125"></a></td>

				<td><ul><?php 
				echo "<li> \"" . $Dog->get_cname() . "\" </li><li>" . $Dog->get_rname(). "</li><li>&nbsp" ;
				if ($Dog->get_dob()){ echo "</li><li>DOB: " . $Dog->get_dob(); }
				if ($Dog->get_sire_id()){ echo "</li><li>Sire: " . $Object_array[$Dog->get_sire_id()]->get_rname(); }
				if ($Dog->get_dam_id()){ echo "</li><li>Dam: " . $Object_array[$Dog->get_dam_id()]->get_rname(); }
				?>
			</li></ul></td></tr>
	<?php 
		}
	}
	?>
	</table>
</div>
<?php
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function full_table($Object_array) {
	echo "<table border=\"1\" style=\"width:90%; text-align:center; margin:0 auto 0 auto; background-color:#e6eee8; \"><th>ID</th>\n
	<th>Registered name</th>\n
	<th>Call name</th>\n
	<th>Date of Birth</th>\n
	<th>Sire</th><th>Dam</th>\n
	<th>Gender</th>\n
	<th>Available</th>\n
	<th>Display</th>\n
	<th></th>\n<th></th>";

	foreach ($Object_array as $Dog) {
	echo "<tr>
	<td>" . $Dog->get_id() . "</td>\n
	<td>" . $Dog->get_rname() . "</td>\n
	<td>" . $Dog->get_cname() . "</td>\n<td>";
	 if($Dog->get_dob() != "0000-00-00"){echo $Dog->get_dob_display();}
	echo"</td>\n<td>";
	
	if($Dog->get_sire_id()){ echo $Object_array[$Dog->get_sire_id()]->get_rname();} 
	echo "</td>\n<td>";
	
	if($Dog->get_sire_id()){ echo $Object_array[$Dog->get_dam_id()]->get_rname();}
	echo "</td>\n
	<td>" . $Dog->get_gender() . "</td>\n<td>";
	if ($Dog->get_available()) { echo "Yes";} else { echo "No";}
	echo  "</td>\n<td>";
	if ($Dog->get_display()) { echo "Yes";} else { echo "No";}
	  
	echo "</td>\n
	<td><form name=\"id\"" .$Dog->get_id() ."edit\" action=\"edit.php\" method=\"POST\">\n
	<input type=\"hidden\" name=\"id\" value=\"" . $Dog->get_id() ."\">\n
	<input type=\"submit\" value=\"edit\" /></form></td>\n
	<td><form name=\"id\"" .$Dog->get_id() ."delete\" action=\"delete.php\" method=\"POST\">\n
	<input type=\"hidden\" name=\"id\" value=\"" . $Dog->get_id() ."\">\n
	<input type=\"submit\" value=\"delete\" /></form></td>
	</tr>\n";
	}

	?>
	</table>
	<form name='add' action='insert.php' method='POST'>
	<input type='submit' value='Add Dog' />
	</form>
<?php
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function edit_table($Obj_array, $id) {
?> 
		<table border="1" class="listingtb">
		<th>ID</th><th>Registered Name</th>
		<th>Call Name</th>
		<th>Date of Birth</th>
		<th>Gender</th>
		<th>Sire</th>
		<th>Dam</th>
		<th>Available</th>
		<th>Display</th>
		<tr><form name="updateall" action='update.php' method ='POST'>
		<input type='hidden' name='id' value="<?php echo $Obj_array[$id]->get_id(); ?>">
		<td><?php echo $Obj_array[$id]->get_id(); ?></td>
		<td><input type='text' name='rname' value="<?php echo $Obj_array[$id]->get_rname(); ?>"></td>
		<td><input type='text' name='cname' value="<?php echo $Obj_array[$id]->get_cname(); ?>"></td>
		<td><input type='date' name='dob' value="<?php if($Obj_array[$id]->get_dob() != "0000-00-00"){echo $Obj_array[$id]->get_dob();} ?>"></td>
		<td><input type='radio' name='gender' value='male' <?PHP if($Obj_array[$id]->get_gender() == 'male'){ echo "checked=\"checked\""; } ?> /> Male
		<input type='radio' name='gender' value='female' <?PHP if($Obj_array[$id]->get_gender() == 'female'){ echo "checked=\"checked\""; } ?> />Female</td>
		<td><select name="sire_id" style="max-width: 200px;">
		<?PHP echo drop_menu($Obj_array,$Obj_array[$id]->get_sire_id(),"male") ?>
		</td></select>
		<td><select name="dam_id" style="width: 200px;">
		<?PHP drop_menu($Obj_array,$Obj_array[$id]->get_dam_id(),"female") ?>
		</select></td>
		<?php
		
		if ($Obj_array[$id]->get_available()) {
			$checked = "checked=\"checked\"";
		} else {
			$checked = NULL;
		echo "<td><input type=\"checkbox\"" . $checked . "name=\"available\" value=\"TRUE\"/></td>";
		}
		if ($Obj_array[$id]->get_display()) {
			$checked = "checked=\"checked\"";
		} else {
			$checked = NULL;
		}
		echo "<td><input type=\"checkbox\"" . $checked . "name=\"display\" value=\"TRUE\"/></td></tr>";



?>		

		<tr><td colspan="9">
		<input name="updateall" type="submit" value="Update" >
		</form>
		<form method="link" action="index.php">
		<input type="submit" value="Back">
		<form name='add' action='insert.php' method='POST'>
		<input type='submit' value='Add Dog' />
		</form>
		</FORM>
		
		</td></tr>
		<tr><td colspan="9">
			<form enctype="multipart/form-data" action="upload.php" method="post">
			<input type="hidden" name="MAX_FILE_SIZE" value="1000000" />
			Thumb Image: <input type="file" name="userfile" />
			<input type="submit" value="Upload File" />
			<input type='hidden' name='id' value="<?php echo $id ?>">
			<input type='hidden' name='position' value="thumb">
			</form>
			<a target="_blank" href="../dogimages/large<?php echo $Obj_array[$id]->get_id();?>.jpg" rel="lightbox[list]">
			<img src="../dogimages/thumb<?php echo $Obj_array[$id]->get_id();?>.jpg" alt="<?php echo $Obj_array[$id]->get_cname();?>" width="166" height="125"></a>
		</td></tr>
		<tr><td colspan="9">
			<form enctype="multipart/form-data" action="upload.php" method="post">
			<input type="hidden" name="MAX_FILE_SIZE" value="1000000" />
			Gallery Image: <input type="file" name="userfile" />
			<input type="submit" value="Upload File" />
			<input type='hidden' name='id' value="<?php echo $id ?>">
			<input type='hidden' name='position' value="large">
			</form>
			<img src="../dogimages/large<?php echo $Obj_array[$id]->get_id();?>.jpg" alt="<?php echo $Obj_array[$id]->get_cname();?>">
		</td></tr>


<?php
}
?>
