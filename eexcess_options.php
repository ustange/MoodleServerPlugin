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
 * Adds user interests tags settings in navigation block.
 *
 * @package    local_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once('user_settings_form.php');
require_once('locallib.php');
require_login();
$title = get_string('interests', 'local_eexcess');
$tablename = "local_eexcess_interests";
$userid = $USER->id;

$PAGE->requires->css("/local/eexcess/tagit-stylish-yellow.css");
$PAGE->requires->js("/local/eexcess/libs/jquery.1.7.2.min.js");
$PAGE->requires->js("/local/eexcess/libs/jquery-ui.1.8.20.min.js");
$PAGE->requires->js("/local/eexcess/libs/tagit.js");
$PAGE->requires->js("/local/eexcess/libs/script.js");

if (optional_param('submitbutton', false, PARAM_ACTION)) {
    $systemcontext = context_system::instance();
    if (isloggedin() && has_capability('local/eexcess:managedata', $systemcontext)) {
        $cats = json_decode(optional_param('interest_json', false, PARAM_TEXT));

        foreach ($cats as $cat) {
            $tmp = array();
            foreach ($cat->interests as $int) {
                $tmp[] = $int->value;
            }
            $intstr = implode(",", $tmp);

            if ($cat->catid == false) {
                $ins = new stdClass();
                $ins->id = null;
                $ins->userid = $userid;
                $ins->title = $cat->title;
                $ins->interests = $intstr;
                $ins->active = 1;
                $DB->insert_record($tablename, $ins);

            } else {
                $upd = new stdClass();
                $upd->id = $cat->catid;
                $upd->userid = $userid;
                $upd->title = $cat->title;
                $upd->interests = $intstr;
                $upd->active = $cat->active;
                $DB->update_record($tablename, $upd);

            }
        }
    }
}
$url = '/local/eexcess/eexcess_options.php';
local_eexcess_setup_page($url);
$form = new local_eexcess_usersettings_form();

echo $OUTPUT->header();
echo $OUTPUT->heading($title);
$form->display();
echo $OUTPUT->footer();