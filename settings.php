<?php
/*defined('MOODLE_INTERNAL') || die();
if ($hassiteconfig) {
	$settings = new admin_settingpage('local_eexcess',get_string('pluginname','local_eexcess'));
	$setting = new admin_setting_configselect('local_eexcess/changecit', new lang_string('changecit', 'local_eexcess'), '',
                                                      0, array(0 => get_string('no'), 1 => get_string('yes')));
	$settings->add($setting);
}*/
if ($hassiteconfig) {
    
    
    $settings = new admin_settingpage('local_eexcess', get_string('eexcesscit', 'local_eexcess'));
	global $CFG;
	$citFolder = $CFG->dirroot."/local/eexcess/citationStyles";
	$fileArr = get_directory_list($citFolder);
	$citArr = array();
	
	foreach($fileArr as $value){
		$file_path = $citFolder."/".$value;
		$file_content = file_get_contents($file_path);
		$simpleXML = simplexml_load_string($file_content);
		$name = (string) $simpleXML->info->title;
		$citArr[] = $name;
		
	}
	$citArr["lnk"] = "insert link";
	$default = false;
	$settings->add(new admin_setting_configselect('local_eexcess/citation', new lang_string('changecit', 'local_eexcess'), '', $default,$citArr));
	$settings->add(new admin_setting_configtext('local_eexcess/base_url', new lang_string('eexcess_base_url', 'local_eexcess'), '',
                                                'http://eexcess-dev.joanneum.at/eexcess-privacy-proxy-1.0-SNAPSHOT/api/v1/'));
    $ADMIN->add('localplugins', $settings);
}