//---author: team electhrownica

$("document").ready(function(){
									
	//---leaflet
	
	map = L.map('map').setView([1.351928,103.819804], 12);
	
	kmlLayer = new L.KML("kml/planning_area.kml", {async: true});
														  											
	map.addLayer(kmlLayer);
	
	kmlLayer.on("loaded", function(e){ 
		
		popup();
		
		$("#p17").click();
		
		$("svg g path").attr("stroke-width","2");
		
		$("svg g path").hover(function(){
    
			$(this).attr("fill","#ff0000");

		},function(){

			$(this).attr("fill","#0033ff");

		});
		
	 });
	
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' &copy; MMXIII <a href="#" target="_blank">Electhrownica</a> | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
	}).addTo(map);
		
	//---activate leaderboard

	bind_lb();
	
	//---activate countdown
	
	var austDay = new Date();
	
	austDay = new Date(austDay.getFullYear() + 1, 1 - 1, 30);
	
	$('#defaultCountdown').countdown({until: austDay});
	
	$('#year').text(austDay.getFullYear());
	
});

//---bind leader board

function bind_lb(){
	
	$("#lb li").click(function(){
		
		leader_board($(this));
	
	});

}

//--animate leader board

function leader_board(list){

	var $myLi = list;
	var listHeight = $("#lb").innerHeight();
	var elemHeight = $myLi.height();
	var elemTop = $myLi.position().top;
	var moveUp = listHeight - (listHeight - elemTop);
	var moveDown = elemHeight;
	var liId = $myLi.attr("id");
	var enough = false;
	var liHtml = $myLi.outerHTML();
	
	$("#lb li").each(function() {
		if ($(this).attr("id") == liId) {
			return false;
		}
		$(this).animate({"top": '+=' + moveDown}, 1000);
	});
	
	$myLi.animate({"top": '-=' + moveUp}, 1000, function() {
		$myLi.remove();
		var oldHtml = $("#lb").html();
		$("#lb").html(liHtml + oldHtml);
		$("#lb li").attr("style", "");
		
		bind_lb();
		
	});

}

//---map annotations - static concept

function popup(){
	
	var descr = {};
		
	descr["9"] = " 0.511 kg,  10/2012,  &Delta; + 2%";
	descr["29"] = " 0.358 kg,  10/2012,  &Delta; - 1%";
	descr["17"] = " 1.386 kg,  10/2012,  &Delta;  0%";
	descr["26"] = " 0.372 kg,  10/2012,  &Delta; + 8%";
	descr["12"] = " 0.498 kg,  10/2012,  &Delta; + 1%";
	descr["2"] = " 0.510 kg,  10/2012,  &Delta; - 4%";
	descr["3"] = " 0.367 kg,  10/2012,  &Delta; + 5%";
	
	var index = [9,29,17,26,12,2,3]
	
	for(var i = 0; i < 7; i++){
		
		$($('svg g')[index[i]]).attr('id','p'+index[i]);
		
		$($('svg g')[index[i]]).attr('data-prec',index[i]);
		
		$($('svg g')[index[i]]).attr('class','precincts');
		
	}
	
	$(".precincts").click(function(){
		
		var di = $(this).data('prec');
		
		$("#pop_txt").html(descr[di+""]);
	
	});
	
}
		