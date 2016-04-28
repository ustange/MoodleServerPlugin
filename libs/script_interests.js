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
        var tagitOpts = {triggerKeys:['enter', 'comma', 'tab']};
        $('.int-category ul').tagit(tagitOpts);
        $("#mform1").on('submit',function(){
            var cats = $('.int-category'),
                jsonObj = [];
                cats.each(function(){
                    var elm = $(this);
                    jsonObj.push({
                        catid:elm.data("catid") ? elm.data("catid") : false,
                        title:!elm.data("catid") ? elm.find('input').val() : elm.find('span').text(),
                        interests:elm.find('ul').tagit('tags'),
                        active:elm.find('.active').is(':checked')
                    });
                });
                console.log(jsonObj);
                $("#interest_json").val(JSON.stringify(jsonObj));
                console.log($("#interest_json").val());
                return true;
        });

        $(".delete_interests").click(function(e){
            e.preventDefault();
            if(confirm("Are you sure you want to delete this?")){
                var catid = $(e.target).data('catid');
                var sesskey = $(e.target).parent().data('sesskey');
                $.ajax({
                    url: "delete_interests_from_db.php",
                    type: "POST",
                    data:{
                        catid:catid,
                        sesskey:sesskey
                    },
                    success:function(res){
                        var json = JSON.parse(res);
                        if(json.success){
                            $(e.target).parent().remove();
                        } else {
                            alert(json.msg);
                        }

                    }
                });
            } else {
                return false;
            }

        });
        $(".int-category input[type=checkbox]").on('change',function(e){
            if($(e.target).is(":checked")){
                $(e.target).parent().removeClass("inactive-cat");
                $(e.target).parent().addClass("active-cat");
            } else {
                $(e.target).parent().removeClass("active-cat");
                $(e.target).parent().addClass("inactive-cat");
            }
        });

        $("#id_area_for_tags").on('click',function(){
            var intrestBlock = $('<div class="int-category new-cat"><input class="title_interests" /><ul></ul></div>');
            intrestBlock.insertBefore($(this));
            intrestBlock.find('ul').tagit(tagitOpts);
        });

    });

})(jQuery);