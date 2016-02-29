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
 * Install utility.
 *
 * @package    local_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Creates EXXCESS user role.
 */
function xmldb_local_eexcess_install() {
    global $DB;
    $rolename = get_string('eexcess_user_role', 'local_eexcess');
    $roledescription = get_string('eexcess_user_role_description', 'local_eexcess');
    create_role($rolename, 'eexcessuser', $roledescription, '');
    $rolerecord = $DB->get_record('role', array("shortname" => 'eexcessuser'), $fields = '*');
    set_role_contextlevels($rolerecord->id, array(CONTEXT_SYSTEM));
    $context = context_system::instance();
    assign_capability('local/eexcess:managedata', CAP_ALLOW, $rolerecord->id, $context->id, true);
    $context->mark_dirty();
}