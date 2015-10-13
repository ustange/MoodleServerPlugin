<?php
require_once('citation_form.php');
require_login();
$url = new moodle_url('/local/eexcess/eexcess_options.php');
$form = new local_eexcess_citation_form($url);
$title = get_string('citsettings','local_eexcess');
$tablename = "local_eexcess_citation";
$userid=$USER->id;


//var_dump($userid);
//var_dump($USER);



if($_POST["submitbutton"]){
	$user_setting = $DB->get_record($tablename, array("userid"=>$userid), $fields='*', $strictness=IGNORE_MISSING);
	
	if($user_setting==false){
		//insert
		$s = new stdClass();
		$s->id = null;
		$s->userid = $userid;
		$s->citation = $_POST["changecit"];
		$DB->insert_record($tablename,$s);
	}else{
		//update
		$user_setting->citation = $_POST["changecit"];
		$DB->update_record($tablename,$user_setting);
		
	}
	
}


echo $OUTPUT->header();
echo $OUTPUT->heading($title);
//echo $OUTPUT->box_start();
$form->display();
//echo $OUTPUT->box_end();
echo $OUTPUT->footer();

