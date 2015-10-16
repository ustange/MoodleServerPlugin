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
 * @copyright: bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

global $PAGE;

$base_url = get_config('local_eexcess','base_url');
$params = array('base_url' => $CFG->wwwroot,'userid'=>$USER->id,'rec_base_url'=>$base_url);

$PAGE->requires->string_for_js('showicon', 'local_eexcess');
$PAGE->requires->js_call_amd('local_eexcess/EEXCESSResults','init',$params);

function local_eexcess_extends_navigation(global_navigation $navigation) {
$title = $navigation->add('Eexcess settings');
$url = new moodle_url('/local/eexcess/eexcess_options.php');
$subTitle = $title->add('Citation settings',$url);

}
function local_eexcess_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload) {
    global $CFG, $DB, $USER;

    $fullpath = "/{$context->id}/local_eexcess/$filearea/{$args[0]}/{$args[1]}";

    $fs = get_file_storage();
    if (!$file = $fs->get_file_by_hash(sha1($fullpath)) or $file->is_directory()) {
        return false;
    }

    send_stored_file($file);
}