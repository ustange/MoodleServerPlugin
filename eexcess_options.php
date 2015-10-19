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

require_once('citation_form.php');
require_login();
$url = new moodle_url('/local/eexcess/eexcess_options.php');
$title = get_string('citsettings','local_eexcess');
$tablename = "local_eexcess_citation";
$userid=$USER->id;

if($_POST["submitbutton"]){
	$user_setting = $DB->get_record($tablename, array("userid"=>$userid), $fields='*', $strictness=IGNORE_MISSING);

	if($user_setting==false){
		//insert
		$s = new stdClass();
		$s->id = null;
		$s->userid = $userid;
		$s->citation = $_POST["changecit"];
		$DB->insert_record($tablename,$s);
	}else{
		//update
		$user_setting->citation = $_POST["changecit"];
		$DB->update_record($tablename,$user_setting);
	}
}
$form = new local_eexcess_citation_form($url);

echo $OUTPUT->header();
echo $OUTPUT->heading($title);
$form->display();
echo $OUTPUT->footer();