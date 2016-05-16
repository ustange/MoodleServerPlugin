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
 * Remove records eexcess image license from database.
 *
 * @package    block_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
require_once(dirname(dirname(dirname(__FILE__))) . '/config.php');

$systemcontext = context_system::instance();
$id = required_param('catid', PARAM_INT);

if ($id && isloggedin() && has_capability('block/eexcess:myaddinstance', $systemcontext) && confirm_sesskey()) {
    $tablename = "block_eexcess_image_license";
    $changedid = $DB->get_record($tablename, array("id" => $id), $fields = '*', $strictness = IGNORE_MISSING);
    $useriddb = $changedid->userid;
    $userid = $USER->id;
    if ($useriddb === $userid) {
        $DB->delete_records($tablename, array("id" => $id));
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false));
    }
} else {
    echo json_encode(array("success" => false));
}
