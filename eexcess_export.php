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

  $url = '/blocks/eexcess/eexcess_export.php';
  block_eexcess_setup_page($url);

  # $PAGE->requires->js('/blocks/eexcess/js/export.js');
  # echo $OUTPUT->action_link(
  # '/blocks/eexcess/eexcess_export_run.php',
  #   get_string('export', 'block_eexcess'),
  #   new component_action('click', 'eexcess_export_js')
  # );

  $str = get_string('download_JSON', 'block_eexcess');
  $actionlink = new action_menu_link(
    new moodle_url('eexcess_export_run.php'),
    NULL,
    $str,
    true,
    array('class' => 'btn btn-primary')
  );


  echo $OUTPUT->header();
  echo $OUTPUT->heading(get_string('export_profile', 'block_eexcess'));
  echo $OUTPUT->render($actionlink);
  echo $OUTPUT->footer();