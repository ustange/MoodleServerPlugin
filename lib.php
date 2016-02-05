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
 * EEXCESS local plugin lib.
 *
 * @package    local_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Adds module specific settings to the settings block
 *
 * @param global_navigation $navigation The global navigation object
 */
function local_eexcess_extend_navigation(global_navigation $navigation) {
    $systemcontext = context_system::instance();
    if (isloggedin() && has_capability('local/eexcess:managedata', $systemcontext)) {
        global $PAGE, $DB, $USER;

        $tablename = "local_eexcess_interests";
        $userid = $USER->id;
        $cats = $DB->get_records($tablename, array("userid" => $userid, "active" => true));
        $interests = array();
        foreach ($cats as $cat) {
            $interests[] = array("text" => $cat->interests);
        }
        $baseurl = get_config('local_eexcess', 'base_url');
        $params = array('userid' => $USER->id, 'rec_base_url' => $baseurl, "interests" => $interests);

        $PAGE->requires->js_call_amd('local_eexcess/EEXCESSResults', 'init', $params);

        $title = $navigation->add(get_string('eexcesssettings', 'local_eexcess'));
        $url = new moodle_url('/local/eexcess/eexcess_options.php');
        $urlcit = new moodle_url('/local/eexcess/eexcess_citation.php');
        $subtitle = $title->add(get_string('interests', 'local_eexcess'), $url);
        $subtitlecit = $title->add(get_string('citation', 'local_eexcess'), $urlcit);
    }
}

/**
 * Serves the eexcess files.
 *
 * @param stdClass $course course object
 * @param stdClass $cm course module object
 * @param stdClass $context context object
 * @param string $filearea file area
 * @param array $args extra arguments
 * @param bool $forcedownload whether or not force download
 * @return bool false if file not found, does not return if found - just send the file
 */
function local_eexcess_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload) {

    $fullpath = "/{$context->id}/local_eexcess/$filearea/{$args[0]}/{$args[1]}";

    $fs = get_file_storage();
    if (!$file = $fs->get_file_by_hash(sha1($fullpath)) or $file->is_directory()) {
        return false;
    }

    send_stored_file($file);
}




