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
 * @package    local-eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(dirname(dirname(dirname(__FILE__))) . '/config.php');
require_once($CFG->libdir . '/formslib.php');

$PAGE->set_pagelayout('standart');
$PAGE->set_heading($COURSE->fullname);

class local_eexcess_usersettings_form extends moodleform {

    public function definition() {
        global $CFG;
		global $USER;
		global $DB;
		$deleteButURL = $CFG->wwwroor."/local/eexcess/delete_from_DB.php";
		$tablename = "local_eexcess_interests";

		$mform =& $this->_form;
	$cats = $DB->get_records($tablename,array("userid"=>$USER->id));
	
	foreach($cats as $cat){
		
		$tags = explode(",",$cat->interests);
		
		$listr ="";
		foreach($tags as $tag){
			$listr .= "<li>$tag</li>";
		}
		$catid = $cat->id;
		if($cat->active>0){
			$checked = "checked=\"true\"";
			$activeclass = "inactive-cat";
		}else{
			$checked = "";
			$activeclass = "";
		}
		
		$mform->addElement('html',"<div data-catid=\"{$catid}\" class=\"int-category $activeclass \"><span><h4>{$cat->title}</h4></span><label>Use -</label> <input type=\"checkbox\" $checked value=\"1\" class=\"active\"/><a data-catid=\"{$catid}\" href=\"{$deleteButURL}\" class=\"delete_interests\">delete</a><ul >$listr</ul></div>");
	}
		$mform->addElement('html','<input type="hidden" id="interest_json" name="interest_json">');
		$mform->addElement('button','button_add_area_for_tags','+');
		
		$this->add_action_buttons(true, get_string('savechanges'));

    }
}