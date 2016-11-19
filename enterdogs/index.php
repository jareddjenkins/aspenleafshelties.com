<?php 
session_start();


include (dirname(__FILE__).'/inc/views.php');


if(!empty($_SESSION['LoggedIn']) && !empty($_SESSION['Username']))  {
	header( 'Location: http://www.aspenleafshelties.com/enterdogs/full-list.php' ) ;
}  
elseif(!empty($_POST['username']) && !empty($_POST['password']))  
{  
    $username =$_POST['username'];  
    $password = md5($_POST['password']);  

/////////////////////////

$checklogin = authenticate($Connection,$username,$password);
echo $checklogin;
//////////////////////////////////////////	
	
      
    if(!empty($_SESSION['LoggedIn']) && !empty($_SESSION['Username'])) {   
                  
        echo "<h1>Success</h1>";  
        echo "<p>We are now redirecting you to the member area.</p>";  
        echo "<meta http-equiv='Refresh' content='2'>";  
    }
    else  {
        echo "<h1>Error</h1>";  
        echo "<p>Sorry, your account could not be found. Please <a href=\"index.php\">click here to try again</a>.</p>";  
    } 
}
else  
{
include (dirname(__FILE__).'/enterheader.html');  
    ?>  
      
   <h1>Member Login</h1>  
      
   <p>Thanks for visiting! Please either login below, or <a href="register.php">click here to register</a>.</p>  
      
    <form method="post" action="index.php" name="loginform" id="loginform">  
    <fieldset>  
        <label for="username">Username:</label><input type="text" name="username" id="username" /><br />  
        <label for="password">Password:</label><input type="password" name="password" id="password" /><br />  
        <input type="submit" name="login" id="login" value="Login" />  
    </fieldset>  
    </form>  
      
   <?php  
}  
?>  
<?php include (dirname(__FILE__)."/footer.html"); ?>

