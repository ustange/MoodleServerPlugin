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
	if(confirm("Are you sure you want to delete this?")){
        var catid = $(e.target).data('catid');
		$.ajax({
			url: "delete_from_DB.php",
			type: "POST",
			data:{
				catid:catid
			},
			success:function(res){
                            var json = JSON.parse(res);
				if(json.success){
                                    $(e.target).parent().remove();
                                }else{
                                    alert(json.msg);
                                }
				
			}
		});
    }else{
		return false;
	}
		
		
	});
	$(".int-category input[type=checkbox]").on('change',function(e){
		if($(e.target).is(":checked")){
			$(e.target).parent().removeClass("inactive-cat");
			$(e.target).parent().addClass("active-cat");
		}else{
			$(e.target).parent().removeClass("active-cat");
			$(e.target).parent().addClass("inactive-cat");
			
			
		}
	});
	
	$("#id_area_for_tags").on('click',function(){
		var intrestBlock = $('<div class="int-category new-cat"><input class="title_interests" /><ul></ul></div>');
		intrestBlock.insertBefore($(this));
		intrestBlock.find('ul').tagit(tagitOpts);
	});
	
	})
	
})(jQuery)