//---bubble presence 

presence();

function presence(){

	if(document.getElementsByTagName("circle").length == 1){
	
		add_path();
	
	}else{
			
		setTimeout("presence()",500);
	
	}

}

//---path-div -> body

$("body").append('<div id="route" style="position: absolute; width: 562.3333px; z-index: 2000;">'+
			'</div>'	
			);

//---pb link

$("body").prepend('<div class="pb_container">&rarr;  <a onclick="playback();" href="javascript:void(0)">playback</a></div>');

//---pb next train

$("body").append('<div class="pb_container" style="top: auto; bottom: 0px;">&rarr;  <a onclick="playrandom();" href="javascript:void(0)">next train</a></div>');
			
//---get/set data

$("document").ready(function(){

	train_data = alloc();
	map_data();
	
	//---viewport parameters
	
	viewport = new Object;
	var wmc = new Object;
	
	viewport.wmc = {
					tt_ltv_rdc: {height: 1820,
								width: 562.3333,
								limits:{
									xaxis:{min: 56.8616,max: 58.1159},
									yaxis:{min: 579.5624,max: 583.8093}
									},
								utm_origin: 57.1889
								}
					};
});

//---path -> iframe

function add_path(){
		
		var path = $("#route");
		
		$("#OpenLayers\\.Layer\\.OSM_2").css("overflow-y","none");
		
		$("#OpenLayers\\.Layer\\.OSM_2").append(path);
		
		var path_h, path_w, bubbl_r, ref_off, path_top, path_left;
		
		path_h = viewport['wmc']['tt_ltv_rdc']['height'];
		path_w = viewport['wmc']['tt_ltv_rdc']['width'];
		
		var circle = document.getElementsByTagName("circle")[0];
		
		bubbl_r = parseInt(circle.getAttribute('r')); 
			
		ref_off = circle.getBoundingClientRect();
		
		path_top = (ref_off['top'] + bubbl_r) - path_h;
		
		var x_min, x_max, range_x, utm_o, delta_x;
		
		x_min = viewport.wmc.tt_ltv_rdc.limits.xaxis['min'];
		x_max = viewport.wmc.tt_ltv_rdc.limits.xaxis['max'];
		utm_o = viewport.wmc.tt_ltv_rdc['utm_origin'];
		
		range_x = x_max - x_min;
		
		delta_x = ((utm_o-x_min)/range_x)*path_w;
		
		path_left = (ref_off['left'] + bubbl_r) - delta_x;
		
		$('#route').offset({'top': path_top,'left': path_left});

}
		
//---get train-data

function alloc(init){
	
	var values;
	
	if(init){
	
		values = $("#form_input").serialize();
	
	}else{
		
		values = "rt_code=tt_ltv_lob&direction=sb&service_type=17-Stop&service=06:20";
		
	}
	
	var serv_meta = new Object;
	var energy_meta = new Object;
	var intervals = new Object;
	
	var units = $.getJSON("allocations.php?" + values,function(serv_e){
		
		for(var index in serv_e){
			
			intervals = {label: index.replace("serv","sID."),data: JSON.parse(serv_e[index]['data'])};
			
			//---serv meta -> flot plot variable
			serv_meta[index] = intervals;
			
			serv_e[index].label = index;
			
			serv_e[index].data = intervals.data;
			
			//---energy meta -> consumption meta data	
			energy_meta = serv_e;	

		}
		
	});
	
	return function expose(){

		return energy_meta
	
	};
	
}

//---get route-data

function map_data(){
	
	var pipe_c = $.getJSON("stn_coord.php?rt_code=tt_ltv_rdc",function(coord){

						stn_coord = JSON.parse(coord);
					
					});
	
	//---
	
	var	pipe_b = $.getJSON("path_coord.php?rt_code=tt_ltv_rdc",function(route){

							path_coord = JSON.parse(route);

						});
						
	//---check pipe completion & plot
	
		pipe_b.complete(function(){
		
			pipe_c.complete(function(){
			
				map_path(path_coord,stn_coord);
			
			});
						
		});

}

//---draw route

function map_path(path_coord,stn_coord){

	//--- create gps path array
	
	var gps_path = new Array();
	
	gps_vector = path_coord.map(function(element){
			
		gps_coord = [element[1],element[2]];
		
		return gps_coord;
		
		});
			
	gps_path.push({data:gps_vector,color:"#f6358a",lines:{show:true,lineWidth:3}});
	
	var j = 0;

	for(j = 0;j <=stn_coord.length-1;j++){
	
		gps_path.push({data:[stn_coord[j]],points: {show:true}, radius: 5,color:"#F24171"});
	
	}

	var route_map = $("#route");

	//---map options
	
	var vp_limits = viewport.wmc['tt_ltv_rdc'].limits;

	var options = {
					grid:{show: false},
					xaxis:{min: vp_limits.xaxis.min,max: vp_limits.xaxis.max},
					yaxis:{min: vp_limits.yaxis.min,max: vp_limits.yaxis.max}
				};

	//--- draw 

	vport();

	wmc_map = $.plot(route_map,gps_path, options);
			
}

//---init playback

function playback(){

	var unit_meta = train_data();

	tracker = play(unit_meta['serv102']);

	pb();

}

//---play random

function playrandom(){
	
	$(document).scrollTop(-$(document).height);
	
	var unit_meta = train_data();
	
	var rand = random_h(unit_meta);
	
	tracker = play(unit_meta[rand]);
	
	pb();

}

//---random hash

function random_h(trains) {
    
	var temp_key, keys = [];
    
	for(temp_key in trains) {
       
	   if(trains.hasOwnProperty(temp_key)) {
           
		   keys.push(temp_key);
		   
       }
    }
	
    return keys[Math.floor(Math.random() * keys.length)];
}

//---position playback

function play(service){
	
	var i = 0; 
	
	//---intervals struct->[refX,economy,cumulative,regen,net]
	
	var intervals = service['data'];
	
	var unit = service['unit'];
	
	return function next_f(){
		
			var x, y, refx, ec, gps_loc, coord;
			
			refx = intervals[i][0];
	
			gps_loc = unit_loc(refx);  
			
			coord = transform(gps_loc[0][0],gps_loc[0][1]);
			
			x = coord[0][0];
			
			y = coord[0][1];
			
			refx = parseFloat(refx).toFixed(1);
			
			//---draw on canvas
			
			function route_overlay(){
		
					var array_size = wmc_map.hooks.drawOverlay.length;

					wmc_map.hooks.drawOverlay.splice(0,array_size);
						
					wmc_map.triggerRedrawOverlay();
					
					wmc_map.hooks.drawOverlay.push(function (wmc_map,ctx){
							
						if(x){
							
							//---unit arc
							ctx.beginPath();
							ctx.lineWidth = 7;  
							ctx.strokeStyle = "#1F75CC"; 
							ctx.arc(x,y,12,0,Math.PI*2,false); 	
							ctx.fillStyle = "#FFFFFF";
							ctx.fill(); 
							ctx.stroke();
							//---text background
							ctx.beginPath();
							ctx.strokeStyle = "#000066"; 
							ctx.rect(x + (18),y + (-9),ctx.measureText("Distance: " + refx + "km").width,-8); 
							ctx.fillStyle = "#000066";
							ctx.fill();
							ctx.stroke();
							//---unit number
							ctx.beginPath();
							ctx.fillStyle = "#ffffff";
							ctx.fillText("Distance: " + refx + "km",x + (18),y + (-9));					
						
						}
					
					});
								
			}
			
			route_overlay();
		
			i++	
			
			frame_info = {'index':i,'last': intervals.length}; 
			
			return frame_info
	}
	
}

//---set fps

function pb(){

	var frame_info = tracker();
	
	if(frame_info['index'] != frame_info['last']){
	
		setTimeout('pb()',250);
	
	}

}

//---adjust distance

function line_x(dist){

	var stns = new Object;
	var rt = $("#route_select").val();
	var dir = $('input[name="direction"]:checked').val();
	
	switch(dir){
	
		case 'nb':
		var os = rt.replace(/tt_(.*)_/,"");
		
		stns['rdc'] = 0;
		stns['alv'] = 5.13514395098956;
		stns['btg'] = 7.86744956006953;
		stns['lob'] = 12.0355697913846;
		stns['nfd'] = 13.7606027395175;
		stns['knn'] = 16.1293081749118;
		stns['brv'] = 17.7494931650339;
		stns['sly'] = 19.5601706664581;
		stns['uni'] = 20.6158085185911;
		stns['fwy'] = 23.49821647538;
		stns['bhm'] = 24.883558265347;
		stns['dud'] = 27.1563882848512;
		stns['ast'] = 29.0327607574523;
		stns['gvh'] = 31.1813435210433;
		stns['erd'] = 32.9479295932873;
		stns['crd'] = 33.893243003156;
		stns['wyl'] = 35.0035556820192;
		stns['sut'] = 37.2079611891665;
		stns['fok'] = 39.3004594706979;
		stns['bul'] = 40.9161415574575;
		stns['bkt'] = 42.3718283076053;
		stns['sen'] = 46.3555758710689;
		stns['lic'] = 51.1803381024426;
		stns['ltv'] = 53.0287582584483;
		
		var os_dist = stns[os];
		
		dist = dist + os_dist;
		
		break;
		
		case 'sb':
		var os = rt.replace(/tt_/,"");
		os = os.replace(/_(.*)/,"");
		
		stns['ltv'] = 0;
		stns['lic'] = 1.84842015600572;
		stns['sen'] = 6.67318238737937;
		stns['bkt'] = 10.656929950843;
		stns['bul'] = 12.1126167009908;
		stns['fok'] = 13.7282987877504;
		stns['sut'] = 15.8207970692818;
		stns['wyl'] = 18.0252025764291;
		stns['crd'] = 19.1355152552923;
		stns['erd'] = 20.080828665161;
		stns['gvh'] = 21.847414737405;
		stns['ast'] = 23.995997500996;
		stns['dud'] = 25.8723699735971;
		stns['bhm'] = 28.1451999931013;
		stns['fwy'] = 29.5305417830683;
		stns['uni'] = 32.4129497398572;
		stns['sly'] = 33.4685875919902;
		stns['brv'] = 35.2792650934144;
		stns['knn'] = 36.8994500835364;
		stns['nfd'] = 39.2681555189308;
		stns['lob'] = 40.9931884670637;
		stns['btg'] = 45.1613086983788;
		stns['alv'] = 47.8936143074588;
		stns['rdc'] = 53.0287582584483;
		
		var os_dist = stns[os];
		
		dist = dist + os_dist;
		
		break;
	
	}
	
	return dist;

}

//---calculate min 

Array.prototype.min = function(){

	if(this.length == 0)
	return {'index':-1}
	
	var min_index = 0;
	
	for(var i = 1; i <this.length; i++)
		if(this[i]<this[min_index])
		min_index = i;
	return {'index': min_index, 'value': this[min_index]}

}

//---calculate position

function unit_loc(dist){

	dist = line_x(dist);

	if($("[name=direction]").serialize()=="direction=nb"){

		dist = path_coord[0][0] - dist;

	}
	
	var prox, index, lon, lat, gps_loc;
	
	prox = $.map($.makeArray(path_coord),function(coord,index){

		diff = Math.abs(dist - coord[0]);

		return diff;

	});
	
	index = prox.min()['index'];
			
	lon = path_coord[index][1];
	lat = path_coord[index][2];
	
	gps_loc = [[lon,lat]]; 
	
	return gps_loc;
	
}

//---set size

function vport(){
	
	var route_h = viewport['wmc']['tt_ltv_rdc']['height'];
	
	$("#route").css('height',route_h);

}

//---lon/lat -> x/y

function transform(lon,lat){
	
	var x_min, x_max, delta_x, x;
	var y_min, y_max, delta_y, y;
	var map_w, map_h;
	
	map_w = $("#route").width(); 
	map_h = $("#route").height();
	
	x_min = wmc_map.getAxes().xaxis.min;
	x_max = wmc_map.getAxes().xaxis.max;  
	delta_x = x_max - x_min;  
		
	x = Math.abs(((lon+(x_min*-1))/delta_x)*map_w);
	
	//----

	y_min = wmc_map.getAxes().yaxis.min;
	y_max = wmc_map.getAxes().yaxis.max;
	delta_y = y_max - y_min;
	
	y = ((y_max-lat)/delta_y)*map_h;
	
	var c_coord = [[x,y]];
	
	return c_coord;

}
			
//---end animation methods
