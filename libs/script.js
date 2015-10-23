(function($){
	$(function(){
		var tagitOpts = {triggerKeys:['enter', 'comma', 'tab']};
		$('.int-category ul').tagit(tagitOpts);
	$("#mform1").on('submit',function(){
		var cats = $('.int-category'),
			jsonObj = [];
		cats.each(function(){
			var elm = $(this);
			jsonObj.push({
				catid:elm.data("catid")?elm.data("catid"):false,
				title:!elm.data("catid")?elm.find('input').val():elm.find('span').text(),
				interests:elm.find('ul').tagit('tags'),
				active:elm.find('.active').is(':checked')
			})
		})
		console.log(jsonObj);
		$("#interest_json").val(JSON.stringify(jsonObj));
		console.log($("#interest_json").val())
		return true;
	});
	
	$(".delete_interests").click(function(e){
		e.preventDefault();
		var catid = $(e.target).data('catid');
		$.ajax({
			url: "delete_from_DB.php",
			type: "POST",
			data:{
				catid:catid
			},
			success:function(res){
				console.log(res);
				$(e.target).parent().remove();
			}
		});
		
	});
	$(".int-category input[type=checkbox]").on('change',function(e){
		if($(e.target).is(":checked")){
			$(e.target).parent().addClass("inactive-cat")
		}else{
			$(e.target).parent().removeClass("inactive-cat")
		}
	})
	$("#id_button_add_area_for_tags").on('click',function(){
		var intrestBlock = $('<div class="int-category new-cat"><input class="title_interests" /><ul></ul></div>');
		intrestBlock.insertBefore($(this).parent().parent());
		intrestBlock.find('ul').tagit(tagitOpts);
	});
	
	})
	
})(jQuery)