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
   * Shows user's eexcess request history.
   *
   * @package    block_eexcess
   * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
   * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
   */

  require_once(dirname(dirname(dirname(__FILE__))) . '/config.php');
  require_once($CFG->libdir . '/formslib.php');
  require_once('locallib.php');
  require_login();

  $url = '/blocks/eexcess/eexcess_history.php';
  block_eexcess_setup_page($url);

  $userid    = $USER->id;
  $tablename = "block_eexcess_history";
  $records   = $DB->get_records($tablename, array("userid" => $USER->id));

  $history = array();
  foreach ($records as $record) {
    $json              = $record->json;
    $decoded           = json_decode($json);
    $keyword           = $decoded->data->data->profile->contextKeywords[0]->text;
    $data              = $decoded->data->data;
    $history[$keyword] = $data;
  }

  // Regroup items for mustache.
  $i = 0;
  foreach ($history as $keyword => $data) {
    $results = array();
    foreach ($data->result as $result) {
      $results[] = array(
        'title'     => $result->title,
        'language'  => $result->language,
        'licence'   => $result->licence,
        'date'      => $result->date,
        'mediaType' => $result->mediaType,
        'provider'  => $result->documentBadge->provider,
        'uri'       => $result->documentBadge->uri,
        'id'        => $result->documentBadge->id,
      );
    }

    $content['history'][] = array(
      'title'      => $keyword,
      'i'          => $i++,
      'item_count' => $data->totalResults,
      'userID'     => $data->profile->origin->userID,
      'queryID'    => $data->queryID,
      'data'       => $results,
    );
  }

  echo $OUTPUT->header();
  echo $OUTPUT->heading(get_string('history', 'block_eexcess'));
  echo $OUTPUT->render_from_template("block_eexcess/history_list", $content);
  require 'libs/kint/Kint.class.php';
  Kint::dump($history);
  echo $OUTPUT->footer();



