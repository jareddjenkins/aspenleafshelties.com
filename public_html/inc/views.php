<?php
require (dirname(__FILE__).'/data.php');

///////////////////////////////////////////////////////////////////////////////////////////////////

$Dog_array = create_dog_array($Connection);

function drop_menu($Obj_array,$default_id, $gender = NULL) {
	echo $default_id;
	if ($gender === NULL){ echo "GENDER IS NULLLLLLLLLLLLLLLLLLL";}
	$options_avail = array();
	$options_not_avail = array();
?>
	<option value="NULL"> -----------  Not Selected  ----------- </option>
<?php
	foreach ($Obj_array as $Dog) {

		if (strcmp($Dog->get_gender(), $gender) === 0||is_null($gender)){
			if ($Dog->get_display() == TRUE){
					$options_avail[$Dog->get_id()] = $Dog->get_display_name();			
				} elseif ($Dog->get_display()== FALSE){
					$options_not_avail[$Dog->get_id()] = $Dog->get_display_name();
				}
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

function list_table($Object_array, $filter_collumn,$filter_value, $require_display = FALSE) {
?>
	<?php


	foreach ($Object_array as $Dog) {
			
		if (strcmp ($Dog->$filter_collumn(), $filter_value) == 0)  {
			if ($Dog->get_display() || $require_display == FALSE) {
				?>
				<div class="doglist">
					<a target="_blank" href="dogimages/large<?php echo $Dog->get_id();?>.jpg" rel="lightbox[list]" title="<?php echo $Dog->get_cname();?>">
					<div class="doglistimgborder">
					<img src="dogimages/large<?php echo $Dog->get_id();?>.jpg" alt="<?php echo $Dog->get_cname();?>"></a></td>
					</div>
					<ul><?php 
					echo "<li> \"" . $Dog->get_cname() . "\" </li><li>" . $Dog->get_rname(). "</li><li>&nbsp" ;
					if ($Dog->get_dob()){ echo "</li><li>DOB: " . $Dog->get_dob(); }
					if ($Dog->get_sire_id()){ echo "</li><li>Sire: " . $Object_array[$Dog->get_sire_id()]->get_rname(); }
					if ($Dog->get_dam_id()){ echo "</li><li>Dam: " . $Object_array[$Dog->get_dam_id()]->get_rname(); }
					if ($Dog->get_comments()){ echo "</li><li>Comments: " . $Dog->get_comments(); }?>

					<li><a href="pedigree.php?id=<?php echo $Dog->get_id();?>"target="_blank" >Pedigree Chart</a>
				</li></ul>
				</div>
				<div style="clear: both;"></div>
	<?php 
			}
		}		
	}
	?>

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
	<td>" . $Dog->get_cname() . "</td>\n
	<td>" . $Dog->get_comments() . "</td>\n<td>";
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
		}
		echo "<td><input type=\"checkbox\"" . $checked . "name=\"available\" value=\"TRUE\"/></td>";
		
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
		</FORM>
		<form name='add' action='insert.php' method='POST'>
		<input type='submit' value='Add Dog' />
		</form>
		
		
		</td></tr>
		<tr><td colspan="9">
			<form enctype="multipart/form-data" action="upload.php" method="post">
			<input type="hidden" name="MAX_FILE_SIZE" value="10000000" />
			Thumb Image: <input type="file" name="userfile" />
			<input type="submit" value="Upload File" />
			<input type='hidden' name='id' value="<?php echo $id ?>">
			<input type='hidden' name='position' value="large">
			</form>
			<a target="_blank" href="http://aspenleafshelties.com/dogimages/large<?php echo $Obj_array[$id]->get_id();?>.jpg" rel="lightbox[list]">
			<img src="http://aspenleafshelties.com/dogimages/large<?php echo $Obj_array[$id]->get_id();?>.jpg" alt="<?php echo $Obj_array[$id]->get_cname();?>" width="166" height="125"></a>
		</td></tr>

<?php
}
function pedigree_table($ped_name){
?>
<table class="pedigree">
		<tr>
			<td rowspan='8'><p>Sire</br><?php echo $ped_name[2]; ?></p></td>
			<td rowspan='4'><p>Sire</br><?php echo $ped_name[4]; ?></p></td>
			<td rowspan='2'><p>Sire</br><?php echo $ped_name[8]; ?></p></td>
			<td rowspan='1'><p>Sire</br><?php echo $ped_name[16]; ?></p></td>
		</tr><tr>
			<td rowspan='1' class='dam'><p>Dam</br><?php echo $ped_name[17]; ?></p></td>
		</tr><tr>
			<td rowspan='2' class='dam'><p>Dam</br<?php echo $ped_name[9]; ?></td>
			<td rowspan='1'><p>Sire</br><?php echo $ped_name[18]; ?></p></td>
		</tr><tr>
			<td rowspan='1' class='dam'><p>Dam</br><?php echo $ped_name[19]; ?></p></td>
		</tr><tr>
			<td rowspan='4' class='dam'><p>Dam</br><?php echo $ped_name[5]; ?></p></td>
			<td rowspan='2'><p>Sire</br><?php echo $ped_name[10]; ?></p></td>
			<td rowspan='1'><p>Sire</br><?php echo $ped_name[20]; ?></p></td>
		</tr><tr>
			<td rowspan='1' class='dam'><p>Dam</br><?php echo $ped_name[21]; ?></p></td>
		</tr><tr>
		<td rowspan='2' class='dam'><p>Dam</br><?php echo $ped_name[11]; ?></p></td>
			<td rowspan='1'><p>Sire</br><?php echo $ped_name[22]; ?></p></td>
		</tr><tr>
			<td rowspan='1' class='dam'><p>Dam</br><?php echo $ped_name[23]; ?></p></td>
		</tr><tr>
	</table>
	<table class="pedigree">
		<tr>
			<td rowspan='8' class='dam'><p>Dam</br><?php echo $ped_name[3]; ?></p></td>
			<td rowspan='4'><p>Sire</br><?php echo $ped_name[6]; ?></p></td>
			<td rowspan='2'><p>Sire</br><?php echo $ped_name[12]; ?></p></td>
			<td rowspan='1'><p>Sire</br><?php echo $ped_name[24]; ?></p></td>
		</tr><tr>
			<td rowspan='1' class='dam'><p>Dam</br><?php echo $ped_name[25]; ?></p></td>
		</tr><tr>
			<td rowspan='2' class='dam'><p>Dam</br><?php echo $ped_name[13]; ?></p></td>
			<td rowspan='1'><p>Sire</br><?php echo $ped_name[26]; ?></p></td>
		</tr><tr>
			<td rowspan='1' class='dam'><p>Dam</br><?php echo $ped_name[27]; ?></p></td>
		</tr><tr>
			<td rowspan='4' class='dam'><p>Dam</br><?php echo $ped_name[7]; ?></p></td>
			<td rowspan='2'><p>Sire</br><?php echo $ped_name[14]; ?></p></td>
			<td rowspan='1'><p>Sire</br><?php echo $ped_name[28]; ?></p></td>
		</tr><tr>
			<td rowspan='1' class='dam'><p>Dam</br><?php echo $ped_name[29]; ?></p></td>
		</tr><tr>
		<td rowspan='2' class='dam'><p>Dam</br><?php echo $ped_name[15]; ?></p></td>
			<td rowspan='1'><p>Sire</br><?php echo $ped_name[30]; ?></p></td>
		</tr><tr>
			<td rowspan='1' class='dam'><p>Dam</br><?php echo $ped_name[31]; ?></p></td>
		</tr><tr>
	</table>
<?php
}	
?>
