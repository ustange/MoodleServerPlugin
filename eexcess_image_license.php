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
 * Adds user image license settings.
 *
 * @package    block_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once('user_setting_image_license_form.php');
require_once('locallib.php');
require_login();
$PAGE->requires->js("/blocks/eexcess/libs/jquery.1.7.2.min.js");
$PAGE->requires->js("/blocks/eexcess/libs/script_img_license.js");
$tablename = 'block_eexcess_image_license';
$userid = $USER->id;
if (optional_param('submitbutton', false, PARAM_ACTION)) {
    $systemcontext = context_system::instance();
    if (isloggedin() && has_capability('block/eexcess:myaddinstance', $systemcontext)) {
        $cats = json_decode(optional_param('img_license_json', false, PARAM_TEXT));
        foreach ($cats as $cat) {
            if ($cat->catid == false) {
                $ins = new stdClass();
                $ins->id = null;
                $ins->userid = $userid;
                $ins->license = $cat->license;
                $DB->insert_record($tablename, $ins);
            } else {
                $upd = new stdClass();
                $upd->id = $cat->catid;
                $upd->userid = $userid;
                $upd->license = $cat->license;
                $DB->update_record($tablename, $upd);
            }
        }
    }
}
$title = get_string('image_license', 'block_eexcess');
$url = '/blocks/eexcess/eexcess_image_license.php';
block_eexcess_setup_page($url);
$form = new block_eexcess_imagelicense_form();

echo $OUTPUT->header();
echo $OUTPUT->heading($title);
$form->display();
echo $OUTPUT->footer();