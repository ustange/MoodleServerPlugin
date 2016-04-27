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
 * EEXCESS block plugin locallib.
 *
 * @package    block_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Setup page for eexcess user settings
 *
 * @param string $pageurl url of loaded page
 */
function block_eexcess_setup_page($pageurl) {
    global $PAGE;
    $systemcontext = context_system::instance();
    $PAGE->set_context($systemcontext);
    $url = new moodle_url($pageurl);
    $PAGE->set_url($url);
    $PAGE->set_pagelayout('standard');
    $PAGE->set_heading(get_string('pluginname', 'block_eexcess'));
}