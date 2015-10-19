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

defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {

    $settings = new admin_settingpage('local_eexcess', get_string('eexcesscit', 'local_eexcess'));
	global $CFG;
	$citFolder = $CFG->dirroot."/local/eexcess/citationStyles";
	$fileArr = get_directory_list($citFolder);
	$citArr = array();

	foreach($fileArr as $value){
		$file_path = $citFolder."/".$value;
		$file_content = file_get_contents($file_path);
		$simpleXML = simplexml_load_string($file_content);
		$name = (string) $simpleXML->info->title;
		$citArr[] = $name;

	}
	$citArr["lnk"] = "insert link";
	$default = false;
	$settings->add(new admin_setting_configselect('local_eexcess/citation', new lang_string('changecit', 'local_eexcess'), '', $default,$citArr));
	$settings->add(new admin_setting_configtext('local_eexcess/base_url', new lang_string('eexcess_base_url', 'local_eexcess'), '',
                                                'http://eexcess-dev.joanneum.at/eexcess-privacy-proxy-1.0-SNAPSHOT/api/v1/'));
    $ADMIN->add('localplugins', $settings);
}