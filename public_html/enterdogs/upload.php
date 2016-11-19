<?php include "auth.php"; ?> 
<html>
<head>
<title>Aspenleaf - Uploading File</title>
</head>
 
<body>
 
<?php

$id = $_POST['id'];
$position = $_POST['position'];
$name = $position .$id  .$cname ;

    // Lets check for errors first. 
    if($_FILES['userfile']['error'] > 0){
        echo 'General Error';
        switch($_FILES['userfile']['error'])	{   // These are default PHP Errors
            case 1: echo "File exceeded the PHP property upload_max_filesize"; break;  
            case 2: echo "File has exceeded max_file_size (The hidden element we created on our form)"; break;  
            case 3: echo 'File was partially uploaded, not the whole thing'; break;       
            case 4: echo 'No was file uploaded'; break;            
		}
        exit;
    }
	
    if($_FILES['userfile']['type'] != 'image/jpeg'){
		echo "Only jpg files are allowed.";
     //  Then let's put the file   re ever we want to
    // In this case, I have a folder named "upload"
    //  inside my root directory
	}
    $up_folder = dirname(dirname(__FILE__)).'/dogimages/' . $name.'.jpg';

    if(is_uploaded_file($_FILES['userfile']['tmp_name'])){
        if(!move_uploaded_file($_FILES['userfile']['tmp_name'], $up_folder)){
            // The uploaded file cannot be moved to the directory we want
            echo "Files too strong, I can't move it!!";
            exit;
        }
    }
    else{
        // If this is not a file, it could be someone 
        // trying to put malicous code in the input
        echo "Hmmm, something smells fishy around here with this file: ";
        echo $_FILES['userfile']['name'];
        exit;
    }
    // If all goes well, then we have uploaded the file
?>
Image uploaded. Click back to return to edit page.<form  name="back" action="edit.php" method="POST"><input type='hidden' name='id' value="<?php echo $id; ?>"><input type="submit" value="Back"></form>
<img src="<?php echo 'http://aspenleafshelties.com/dogimages/'. $name . '.jpg'; ?>">
</body>
</html>