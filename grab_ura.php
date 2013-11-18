<?php
header('Content-type: application/json');
ini_set('display_errors', false);

include("config.php");

$collection = $db->ura;

$cur_ura = $collection->find();

$ura_names = array();

$i = 0;

foreach($cur_ura as $ura){
	
	$ura_names[$i] =  array("name"=>$ura['name']);
	
	$i++;

}

echo json_encode($ura_names);

$connection->close();

?>