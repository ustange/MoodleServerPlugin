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
 * Add page to admin menu.
 *
 * @package    local_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {

    $settings = new admin_settingpage('local_eexcess', get_string('eexcesssettings', 'local_eexcess'));
    global $CFG;
    $citfolder = $CFG->dirroot."/local/eexcess/citationStyles";
    $filearr = get_directory_list($citfolder);
    $citarr = array();

    foreach ($filearr as $value) {
        $filepath = $citfolder."/".$value;
        $filecontent = file_get_contents($filepath);
        $simplexml = simplexml_load_string($filecontent);
        $name = (string) $simplexml->info->title;
        $citarr[] = $name;

    }
    $citarr["lnk"] = get_string('link', 'local_eexcess');
    $default = '8';
    $settings->add(new admin_setting_configselect('local_eexcess/citation',
    new lang_string('changecit', 'local_eexcess'), '', $default, $citarr));

    $settings->add(new admin_setting_configtext('local_eexcess/base_url', new lang_string('eexcess_base_url', 'local_eexcess'), '',
    'https://eexcess.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/'));

    $ADMIN->add('localplugins', $settings);
}