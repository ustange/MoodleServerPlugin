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
   * Save references.
   *
   * @package    block_eexcess
   * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
   * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
   */

  define('AJAX_SCRIPT', TRUE);
  require_once(dirname(__FILE__) . '/../../config.php');
  $systemcontext = context_system::instance();

  if (isloggedin() && has_capability('block/eexcess:myaddinstance', $systemcontext)) {
    $tablename = "block_eexcess_references";

    $userid = $USER->id;
    $time   = time();

    $reference_json = optional_param('reference_json', FALSE, PARAM_TEXT);
    $reference_type = optional_param('event', FALSE, PARAM_TEXT);
    $current_uri    = optional_param('current_uri', FALSE, PARAM_TEXT);
    $current_title  = optional_param('current_title', FALSE, PARAM_TEXT);

    $reference = json_decode($reference_json);

    $s                       = new stdClass();
    $s->id                   = NULL;
    $s->userid               = $userid;
    $s->timestamp            = $time;
    $s->reference_type       = $reference_type;
    $s->reference_to_id      = $reference->id;
    $s->reference_to_uri     = $reference->uri;
    $s->reference_to_title   = $reference->title;
    $s->reference_to_preview = $reference->previewImage;
    $s->reference_to_facets  = json_encode($reference->facets);
    $s->reference_from_uri   = $current_uri;
    $s->reference_from_title = $current_title;

    $r = $DB->insert_record($tablename, $s);
    echo json_encode(array("res", $r));
  }
