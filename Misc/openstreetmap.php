<?php
ini_set('display_errors', False);
header("Content-type: text/html");

$url = "http://www.openstreetmap.org/export/embed.html?bbox=-1.94855,52.304999,-1.944188,52.307032&layer=mapnik&marker=52.306248,-1.945547";

$handle = fopen($url, "r");

$html = "";

//$pattern = new Array;

$pattern[0] = '6f2446da844c36375973cc4fff046722';
$pattern[1] = '4bcb6cadf875d3acc7c9508e52f71934';

if ($handle) {    
		
		while (!feof($handle)) {        
			
			$buffer = fgets($handle, 4096);  
			
			for($i=0;$i<=1;$i++){
				
				preg_match($pattern[$i],$buffer,$matches);
				
				if($matches[0] == '6f2446da844c36375973cc4fff046722'){
					echo "nonsuchplace";
					$buffer = '<script src="http://www.openstreetmap.org/assets/embed-6f2446da844c36375973cc4fff046722.js" type="text/javascript"></script><script src="js/plugins.js" type="text/javascript"></script><script src="js/vendor/jquery-1.9.0.min.js" type="text/javascript"></script><script src="js/main.js" type="text/javascript"></script>';
			
				}elseif($matches[0] == '4bcb6cadf875d3acc7c9508e52f71934'){
				
					$buffer = '<link rel="stylesheet" href="http://www.openstreetmap.org/assets/embed-4bcb6cadf875d3acc7c9508e52f71934.css"><link href="css/main_embed.css" rel="stylesheet">';
				
				
				}
				
				unset($matches);
			
			}
				
			$html = $html.$buffer;  
			  
		}
		
	echo $html;    
			
	fclose($handle);
	
}

?>