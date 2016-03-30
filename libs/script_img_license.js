(function($){
    $(function(){
        $("#mform1").on('submit',function(){
            var cats = $('.img_licenses'),
                jsonObj = [];
                cats.each(function(){
                    var elm = $(this);
                    jsonObj.push({
                        catid:elm.data("catid") ? elm.data("catid") : false,
                        license:!elm.data("catid") ? elm.find('input').val() : elm.find('.url_license').text() || elm.find('.url_license').val()
                    });
                });
                console.log('jsonObj',jsonObj);
                $("#img_license_json").val(JSON.stringify(jsonObj));
        });

        $('.edit_button').on('click', function(e){
            var divImgLicense = $(e.target).parent().parent();
            var licenseSpan = divImgLicense.find('.added_img_license_text');
            var licenseValue = divImgLicense.find('.url_license').text();
            var input = $('<input class = "url_license">');
            console.log(licenseValue);
            input.val(licenseValue);
            licenseSpan.remove();
            divImgLicense.append(input);
            $(e.target).unbind('click');
        });

        $('.delete_button').on('click', function(e){
            e.preventDefault();
            if(confirm("Are you sure you want to delete this?")){
                var catid = $(e.target).parent().parent().parent().data('catid');
                var sesskey = $(e.target).parent().parent().parent().data('sesskey');
                $.ajax({
                    url: "delete_imglic_from_DB.php",
                    type: "POST",
                    data:{
                        catid:catid,
                        sesskey:sesskey
                    },success:function(){
                        $(e.target).parent().parent().parent().remove();
                    }
                });
            }
        });

        $('#license_but').on('click', function(){
            var block = $('<div class = "img_licenses new-cat"><input><div>');
            block.insertBefore($(this));
        });
    });
})(jQuery);
