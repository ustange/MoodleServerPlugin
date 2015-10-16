<?php

require_once(dirname(dirname(dirname(__FILE__))) . '/config.php');
require_once($CFG->libdir . '/formslib.php');

$PAGE->set_pagelayout('standart');
$PAGE->set_heading($COURSE->fullname);


class local_eexcess_citation_form extends moodleform {

    public function definition() {
        global $CFG;
		global $USER;
		global $DB;
		$tablename = "local_eexcess_citation";
		
	$citFolder = $CFG->dirroot."/local/eexcess/citationStyles";
	$fileArr = get_directory_list($citFolder);
	$citArr = array();
	$userid=$USER->id;
	$user_setting = $DB->get_record($tablename, array("userid"=>$userid), $fields='*', $strictness=IGNORE_MISSING);
	$i = 0;
		foreach($fileArr as $value){
			$file_path = $citFolder."/".$value;
			$file_content = file_get_contents($file_path);
			$simpleXML = simplexml_load_string($file_content);
			$name = (string) $simpleXML->info->title;
			$citArr["$i"] = $name;
			$i++;
		}
		$citArr["lnk"] = "insert link";
        $mform =& $this->_form;
		
        $sel = $mform->addElement('select', 'changecit',get_string('changecit', 'local_eexcess'),$citArr);
		
		$sel->setSelected($user_setting->citation);
        $this->add_action_buttons(true, get_string('savechanges'));
        
        
    }
}
