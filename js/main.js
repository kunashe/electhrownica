//---author: kunashe

$("document").ready(function(){

	//train_data = alloc();
	//map_data();
	
	frame_info = null;
								
	//---leaflet
	
	map = L.map('map').setView([1.351928,103.819804], 12);
	
	 var kmlLayer = new L.KML("kml/planning_area.kml", {async: true});
														  
	 kmlLayer.on("loaded", function(e) { 
		//map.fitBounds(e.target.getBounds());
	 });
											
	 map.addLayer(kmlLayer);
	
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' &copy; MMXIII <a href="#" target="_blank">Electhrownica</a> | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
	}).addTo(map);
	
	//---anchor circles
	
	anchor_s = L.circle([52.30624848,-1.945547977], 150, {
    color: '#ff4625',
    fillColor: '#ff4625',
    fillOpacity: 1
	}).addTo(map);
	
	anchor_n = L.circle([52.68637707,-1.800372802], 150, {
    color: '#ff4625',
    fillColor: '#ff4625',
    fillOpacity: 1
	}).addTo(map);
	
	//---leaderboard

	$("li").on("click", function() {
		var $myLi = $(this);
		var listHeight = $("ol").innerHeight();
		var elemHeight = $myLi.height();
		var elemTop = $myLi.position().top;
		var moveUp = listHeight - (listHeight - elemTop);
		var moveDown = elemHeight;
		var liId = $myLi.attr("id");
		var enough = false;
		var liHtml = $myLi.outerHTML();
		
		$("li").each(function() {
			if ($(this).attr("id") == liId) {
				return false;
			}
			$(this).animate({"top": '+=' + moveDown}, 1000);
		});
		
		$myLi.animate({"top": '-=' + moveUp}, 1000, function() {
			$myLi.remove();
			var oldHtml = $("ol").html();
			$("ol").html(liHtml + oldHtml);
			$("li").attr("style", "");
		});
	});

	(function($) {
	  $.fn.outerHTML = function() {
		return $(this).clone().wrap('<div></div>').parent().html();
	  }
	})(jQuery);

	  kmlLayer.on("loaded", function(e) { 
            popup();
         });
	
	$.countdown.setDefaults($.countdown.regional['compactLabels']);
	
	var austDay = new Date();
	austDay = new Date(austDay.getFullYear(), 11 - 1, 13);
	
	$('#defaultCountdown').countdown({until: austDay});
	
	$('#year').text(austDay.getFullYear());
	
});

//---annotations

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
		