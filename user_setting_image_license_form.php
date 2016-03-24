<?php
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
 * Form for user image license settings.
 *
 * @package    block_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(dirname(dirname(dirname(__FILE__))) . '/config.php');
require_once($CFG->libdir . '/formslib.php');
/**
 * Extend moodle image license form
 */
class block_eexcess_imagelicense_form extends moodleform {
    /**
     * Define this form - called from the parent constructor.
     */
    public function definition() {
        global $DB;
        global $USER;
        global $CFG;
        $mform =& $this->_form;
        $deletebuturl = $CFG->wwwroot."/block/eexcess/delete_imglic_from_DB.php";
        $userid = $USER->id;
        $user_img_license = $DB->get_records('block_eexcess_image_license', array("userid" => $userid));

        foreach($user_img_license as $value){
            $sesskey = sesskey();
            $user_img_license_final = trim($value->license);
            $catid = $value->id;
            if (strpos($user_img_license_final, 'http://') !== false || strpos($user_img_license_final, 'https://') !== false) {
                $mform ->addElement("html", "<div data-catid = \"{$catid}\" data-sesskey=\"{$sesskey}\" class = 'img_licenses'><div class = 'added_img_license_buttons'><span><a class = 'delete_button' href = \"{$deletebuturl}\">Delete</a></span><span class = 'edit_button'>Edit</span></div><div class = 'added_img_license_text'><a class = 'url_license' target = 'blank' href = '{$user_img_license_final}'>{$user_img_license_final}</a></div></div>");
            }
            else{
                $mform ->addElement("html", "<div data-catid = \"{$catid}\" data-sesskey=\"{$sesskey}\" class = 'img_licenses'><div class = 'added_img_license_buttons'><span><a class = 'delete_button' href = \"{$deletebuturl}\">Delete</a></span><span class = 'edit_button'>Edit</span></div><div class = 'added_img_license_text'><span class = 'url_license'>{$user_img_license_final}</span></div></div>");
            }
            
            

        }
        
        $mform->addElement('html', '<input type="hidden" id="img_license_json" name="img_license_json">');
        $buttitle = get_string('img_license', 'block_eexcess');
        $mform->addElement('html', '<button type="button" id="id_area_for_img_license_button" class = "class_area_for_img_license_button">'.$buttitle.'</button>');
        $this->add_action_buttons(true, get_string('savechanges'));
    }
}