<?php
ini_set('display_errors', True);
include("config.php");

$rt_code = $_GET['rt_code'];
$distance = $_GET['distance'];
$left = $_GET['left'];
$top = $_GET['top'];

switch($rt_code){

	case "tt_ltv_rdc": 	
		$table = "stn_ltv_rdc_utm";
		break;
}

mysql_query("UPDATE IGNORE $table SET left_dim='$left',top_dim='$top' WHERE distance='$distance'")or die('Error updating label positions'.mysql_error());

echo "Success.";


?>