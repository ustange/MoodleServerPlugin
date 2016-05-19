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
   * Lists references to EEXCESS sources/material.
   *
   * @package    block_eexcess
   * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
   * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
   */

  require_once(dirname(dirname(dirname(__FILE__))) . '/config.php');
  require_once($CFG->libdir . '/formslib.php');
  require_once('locallib.php');
  require_login();

  $url = '/blocks/eexcess/eexcess_references.php';
  block_eexcess_setup_page($url);

  $uid     = $USER->id;
  $table   = "block_eexcess_references";
  $records = $DB->get_records($table, array("userid" => $uid));

  // Group references by title.
  $references = array();
  foreach ($records as $record) {
    $references[$record->reference_from_title][] = $record;
  }

  // Regroup references for mustache.
  $i = 0;
  foreach ($references as $title => $data) {
    $content['references'][] = array(
      'title'      => $title,
      'i'          => $i++,
      'item_count' => sizeof($data),
      'data'       => $data
    );
  }


  if (empty($records)) {
    $result = 'No results';
  } else {
    $result = $OUTPUT->render_from_template("block_eexcess/references_list", $content);
  }

  echo $OUTPUT->header();
  echo $OUTPUT->heading(get_string('references', 'block_eexcess'));
  echo $result;
  echo $OUTPUT->footer();