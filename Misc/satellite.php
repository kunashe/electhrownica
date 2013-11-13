<?php
ini_set('display_errors', False);
header("Content-type: text/html");

$url = "http://maps.google.co.uk/maps?f=q&source=s_q&hl=en&geocode=&q=redditch&aq=&sll=51.48931,-0.08819&sspn=0.470305,1.352692&ie=UTF8&hq=&hnear=Redditch,+Worcestershire,+United+Kingdom&ll=52.30897,-1.940936&spn=0.006835,0.021136&t=h&z=14&output=embed";

$handle = fopen($url, "r");

$html = "";

//$pattern = new Array;

//$pattern[0] = '/\.js\?id\=3/';
//$pattern[1] = '/\-1\.8\.3\.min\.js/';
//$pattern[2] = '/htmlembed\.css/';
$pattern[0] = '\</head\>';

if ($handle) {    
		
		while (!feof($handle)) {        
			
			$buffer = fgets($handle, 4096);  
			
			for($i=0;$i<1;$i++){
			
				preg_match($pattern[$i],$buffer,$matches);

				if($matches[0] == '.js?id=3'){

					$buffer = '<script src="js/plugins.js" type="text/javascript"></script><script src="js/htmlembed.js?id=3" type="text/javascript"></script>';

				}elseif($matches[0] == '-1.8.3.min.js'){
				
					$buffer = '<script src="js/vendor/jquery-1.9.0.min.js" type="text/javascript"></script>';
				
				}elseif($matches[0] == 'htmlembed.css'){
				
					$buffer = '<link rel="stylesheet" href="http://mapsdata.co.uk/mapsdataapp/assets/css/htmlembed.css"><link href="css/main_embed.css" rel="stylesheet">';
				
				
				}elseif($matches[0] == '</head>'){
				
					$buffer = 'head><script src="js/vendor/jquery-1.9.0.min.js" type="text/javascript"></script><script src="js/satellite.js" type="text/javascript"></script>';echo "nonsuchplace";
				
				}
				
				unset($matches);
			
			}
				
			$html = $html.$buffer;  
			  
		}
		
	echo 'test'.$html;    
			
	fclose($handle);
	
}




?>