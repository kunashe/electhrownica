//---set new label position

function label_pos(){

	$(".unfixed").each(function(){
		
		var rt_code = 'tt_ltv_rdc';
		var distance = $(this).attr("id");
		var left = parseInt($(this).css('left'));
		var top = parseInt($(this).css('top'));
		
		$.get("label_position.php?rt_code=" + rt_code +"&distance=" + distance +"&left=" + left + "&top=" + top,function(result){
		
			console.log(result);
		
		});
	});

} 
