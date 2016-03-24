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
 * Add admin settings.
 *
 * @package    block_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

if ($ADMIN->fulltree) {
    
    $citfolder = $CFG->dirroot."/blocks/eexcess/citationStyles";
    $filearr = get_directory_list($citfolder);
    $citarr = array();

    foreach ($filearr as $value) {
        $filepath = $citfolder."/".$value;
        $filecontent = file_get_contents($filepath);
        $simplexml = simplexml_load_string($filecontent);
        $name = (string) $simplexml->info->title;
        $citarr[] = $name;

    }
    $citarr["lnk"] = get_string('link', 'block_eexcess');
    $default = '8';
    $settings->add(new admin_setting_configselect('block_eexcess/citation',
    new lang_string('changecit', 'block_eexcess'), '', $default, $citarr));
    
    $settings->add(new admin_setting_configtext('block_eexcess/base_url', new lang_string('eexcess_base_url', 'block_eexcess'), '',
    'https://eexcess.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/'));

    $settings->add(new admin_setting_configtextarea("block_eexcess/img_license", new lang_string('img_license', 'block_eexcess'), 'info', ''));
}