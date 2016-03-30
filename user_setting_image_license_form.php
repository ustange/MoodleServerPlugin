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
        $userimglicense = $DB->get_records('block_eexcess_image_license', array("userid" => $userid));
        $deletestring = get_string('delete', 'block_eexcess');
        $editstring = get_string('edit', 'block_eexcess');

        foreach ($userimglicense as $value) {
            $sesskey = sesskey();
            $userimglicensefinal = trim($value->license);
            $catid = $value->id;
            if (strpos($userimglicensefinal, 'http://') !== false || strpos($userimglicensefinal, 'https://') !== false) {
                $html = "<div data-catid = \"{$catid}\" data-sesskey=\"{$sesskey}\" class = 'img_licenses'>";
                $html .= "<div class = 'added_img_license_buttons'><span><a class = 'delete_button' href = \"{$deletebuturl}\">";
                $html .= "$deletestring</a></span><span class = 'edit_button'>$editstring</span></div>";
                $html .= "<div class = 'added_img_license_text'><a class = 'url_license' target = 'blank'";
                $html .= "href = '{$userimglicensefinal}'>{$userimglicensefinal}</a></div></div>";
                $mform->addElement("html", $html);
            } else {
                $html = "<div data-catid = \"{$catid}\" data-sesskey=\"{$sesskey}\" class = 'img_licenses'>";
                $html .= "<div class = 'added_img_license_buttons'><span><a class = 'delete_button' href = \"{$deletebuturl}\">";
                $html .= "$deletestring</a></span><span class = 'edit_button'>$editstring</span></div>";
                $html .= "<div class = 'added_img_license_text'><span class = 'url_license'>";
                $html .= "{$userimglicensefinal}</span></div></div>";
                $mform->addElement("html", $html);
            }
        }

        $mform->addElement('html', '<input type="hidden" id="img_license_json" name="img_license_json">');
        $buttitle = get_string('img_license', 'block_eexcess');
        $addimglic = '<button type="button" id="license_but" class = "class_area_for_img_license_button">'.$buttitle.'</button>';
        $mform->addElement('html', $addimglic);
        $this->add_action_buttons(true, get_string('savechanges'));
    }
}