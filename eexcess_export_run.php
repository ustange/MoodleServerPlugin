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
  
  
  require_once(dirname(dirname(dirname(__FILE__))) . '/config.php');
  
  $userid  = $USER->id;
  $context = context_system::instance();
  $sesskey = sesskey();

  if (
    $userid
    && isloggedin()
    && has_capability('block/eexcess:myaddinstance', $context)
    && confirm_sesskey($sesskey)
  ) {
    $filename = 'eexcess_profile.json';

    $records_history = $DB->get_records(
      "block_eexcess_history",
      array("userid" => $userid)
    );

    // Prevent to json_encode() the string twice
    // (it already is a JSON string).
    $history = array();
    foreach ($records_history as $record) {
      $history[] = json_decode($record->json);
    }

    $references = $DB->get_records(
      "block_eexcess_references",
      array("userid" => $userid)
    );

    $data = array(
      'metadata'   => array(
        'version'   => '1.0',
        'userid'    => $userid,
        'timestamp' => time(),
      ),
      'history'    => $history,
      'references' => $references,
    );

    $content = json_encode($data);
    
    header("Cache-Control: public");
    header("Content-Description: File Transfer");
    header("Content-Length: " . strlen("$content") . ";");
    header("Content-Disposition: attachment; filename=$filename");
    header("Content-Type: application/octet-stream; ");
    header("Content-Transfer-Encoding: binary");
    
    echo $content;
  }