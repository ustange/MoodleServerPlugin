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
 * desc
 *
 * @package    block_eexcess
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

class block_eexcess extends block_base {
    public function init() {
        $this->title = get_string('pluginname', 'block_eexcess');
    }
    function has_config() {
        return true;
    }
    function applicable_formats() {
        return array('all' => true);
    }

    public function get_content() {
        global $PAGE, $DB, $USER;
        if ($this->content !== null) {
          return $this->content;
        }

        // Titles.
        $interests_title = get_string('interests', 'block_eexcess');
        $citation_title = get_string('citation', 'block_eexcess');
        $img_license_title = get_string('imagelicense', 'block_eexcess');
        $show_hide_bar_title = get_string('showhidebar', 'block_eexcess');

        // New moodle urls.
        $url_interests = new moodle_url('/blocks/eexcess/eexcess_interests.php');
        $url_citation = new moodle_url('/blocks/eexcess/eexcess_citation.php');
        $url_img_license = new moodle_url('/blocks/eexcess/eexcess_image_license.php');

        // HTML elements.
        $interests = "<li><a href = '$url_interests'>$interests_title</a></li>";
        $citation = "<li><a href = '$url_citation'>$citation_title</a></li>";
        $img_license = "<li><a href = '$url_img_license'>$img_license_title</a></li>";
        $show_hide_bar = "<li><button class = 'show-hide-bar'>$show_hide_bar_title</button></li>";
        $html = "<ul class = 'eexcess-settings'>$interests $citation $img_license $show_hide_bar</ul>";

        // Params for js.
        $tablename = "block_eexcess_interests";
        $userid = $USER->id;
        $cats = $DB->get_records($tablename, array("userid" => $userid, "active" => true));
        $interestsarr = array();
        foreach ($cats as $cat) {
            $interestsarr[] = array("text" => $cat->interests);
        }
        $baseurl = get_config('block_eexcess', 'base_url');

        $params = array('userid' => $userid, 'rec_base_url' => $baseurl, "interests" => $interestsarr);

        $PAGE->requires->js_call_amd('block_eexcess/EEXCESSResults', 'init', $params);

        // HTML content.
        $this->content         =  new stdClass;
        $this->content->text   = $html;
        
        return $this->content;
    }
    
}