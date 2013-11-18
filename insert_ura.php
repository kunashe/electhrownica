<?php
header('Content-type: application/json');
ini_set('display_errors', false);

include("config.php");

$collection = $db->ura;

$ura_blob = file_get_contents("Misc/Singapore Planning Areas.txt");

$ura_arr = explode("\n",$ura_blob);

$i = 0;

foreach($ura_arr as $ura_name){
	
	$ura_data = array("id"=> $i, "name"=> $ura_name);
	
	$collection->insert($ura_data);
	
	$i++;

}

echo "...ura name insertion complete";

$connection->close();

?>