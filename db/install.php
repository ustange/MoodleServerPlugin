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
 * @package    block_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Adds eexcess block on eexcess user settings pages.
 */
function xmldb_block_eexcess_install() {
    $page = new moodle_page();
    $page->set_context(context_system::instance());
    $page->blocks->add_region(BLOCK_POS_LEFT);
    $page->blocks->add_block('eexcess', BLOCK_POS_LEFT, 0, false, 'blocks-eexcess-eexcess_citation', null);
    $page->blocks->add_block('eexcess', BLOCK_POS_LEFT, 0, false, 'blocks-eexcess-eexcess_interests', null);
    $page->blocks->add_block('eexcess', BLOCK_POS_LEFT, 0, false, 'blocks-eexcess-eexcess_image_license', null);
}

