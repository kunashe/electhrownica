<?php

$lne = "http://mapsdata.co.uk/mapsdataapp/assets/js/htmlembed.js?id=3";

$pattern = '/\.js\?id\=3/';

preg_match($pattern,$buffer,$matches);

if(isset($matches[0])){

	$buffer = '<script src="js/htmlembed.js?id=3" type="text/javascript"></script>'

}


?>