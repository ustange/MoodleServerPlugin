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

class local_eexcess_citation_form extends moodleform {

    public function definition() {
        global $CFG;
        global $USER;
        global $DB;
        $tablename = "local_eexcess_citation";

        $citfolder = $CFG->dirroot."/local/eexcess/citationStyles";
        $filearr = get_directory_list($citfolder);
        $citarr = array();
        $userid=$USER->id;
        $usersetting = $DB->get_record($tablename, array("userid" => $userid), $fields='*', $strictness = IGNORE_MISSING);
        $i = 0;
        foreach ($filearr as $value){
            $file_path = $citfolder."/".$value;
            $file_content = file_get_contents($file_path);
            $simpleXML = simplexml_load_string($file_content);
            $name = (string) $simpleXML->info->title;
            $citarr["$i"] = $name;
            $i++;
        }
        $citarr["lnk"] = get_string('link', 'local_eexcess');
        $mform =& $this->_form;
        $sel = $mform->addElement('select', 'changecit', get_string('changecit', 'local_eexcess'), $citarr);
        $sel->setSelected($usersetting->citation);
        $this->add_action_buttons(true, get_string('savechanges'));

    }
}