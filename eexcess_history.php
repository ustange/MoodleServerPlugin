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
   * Adds user interests tags settings in navigation block.
   *
   * @package    local_eexcess
   * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
   * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
   */

  require_once('user_settings_form.php');
  require_once('locallib.php');
  require_login();

  $title = get_string('history', 'local_eexcess');

  $PAGE->requires->css("/local/eexcess/tagit-stylish-yellow.css");
  $PAGE->requires->js("/local/eexcess/libs/jquery.1.7.2.min.js");
  $PAGE->requires->js("/local/eexcess/libs/jquery-ui.1.8.20.min.js");
  $PAGE->requires->js("/local/eexcess/libs/tagit.js");
  $PAGE->requires->js("/local/eexcess/libs/script.js");

  $tablename = "local_eexcess_history";
  $userid    = $USER->id;

  $history = $DB->get_records($tablename, array("userid" => $USER->id));
  $items = array();

  foreach ($history as $history_item) {
    $json    = $history_item->json;
    $items[] = json_decode($json);
  }

  $url = '/local/eexcess/eexcess_history.php';
  local_eexcess_setup_page($url);

  echo $OUTPUT->header();
  echo $OUTPUT->heading($title);
  require 'libs/kint/Kint.class.php';
  Kint::dump( $items );
  echo $OUTPUT->footer();