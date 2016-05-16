// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @package    block_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

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
                    url: "delete_imglic_from_db.php",
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
